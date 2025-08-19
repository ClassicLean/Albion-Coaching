"""
AI Orchestrator Starter
Single-file starter for model-driven code generation -> test -> review loop.

How to use (quick):
1) Clone your repo where you want generated files.
2) Copy this file into that repo as `orchestrator.py`.
3) Create a Python venv, install requirements: `pip install -r requirements.txt` (see below)
4) Set environment var: OPENAI_API_KEY (or adapt to other provider).
5) Run: `python orchestrator.py --task "Add a simple greet function and tests"`

This example uses the OpenAI python package. It keeps things tiny and safe: single iteration,
no network access for generated code, and local test run with pytest. Treat output as a draft.

Requirements (requirements.txt):
openai>=1.0.0
GitPython>=3.1.30
pytest>=7.0
"""

import os
import json
import subprocess
import argparse
from git import Repo
import openai
from pathlib import Path

# ---------- CONFIG ----------
MODEL_BUILDER = "gpt-4o-mini"   # change to what you have access to
MODEL_REVIEWER = "gpt-4o-mini"
MAX_ITER = 3

# ---------- HELPERS ----------

def call_model(system, user_prompt, model=MODEL_BUILDER, max_tokens=1500):
    """Call OpenAI chat completion. Returns assistant text."""
    openai.api_key = os.getenv("OPENAI_API_KEY")
    messages = [
        {"role": "system", "content": system},
        {"role": "user", "content": user_prompt},
    ]
    resp = openai.ChatCompletion.create(model=model, messages=messages, max_tokens=max_tokens)
    # the exact field varies by SDK versions; keep safe
    out = resp.choices[0].message.content
    return out


def write_files_from_json(files_json, base_dir):
    """files_json expected: [{'path': 'src/foo.py', 'content': '...'}, ...]"""
    for f in files_json:
        p = Path(base_dir) / f['path']
        p.parent.mkdir(parents=True, exist_ok=True)
        p.write_text(f['content'], encoding='utf-8')


def run_pytest(base_dir):
    try:
        proc = subprocess.run(["pytest", "-q"], cwd=base_dir, capture_output=True, text=True, timeout=60)
        return proc.returncode == 0, proc.stdout + "\n" + proc.stderr
    except subprocess.TimeoutExpired:
        return False, "pytest timeout"


def git_commit_push(repo_path, message):
    repo = Repo(repo_path)
    repo.git.add(all=True)
    repo.index.commit(message)
    # push branch if remote exists
    try:
        origin = repo.remote(name='origin')
        origin.push()
    except Exception:
        pass

# ---------- ORCHESTRATION ----------

def orchestrate(task_desc, repo_path="."):
    base = Path(repo_path).resolve()
    print(f"Working in {base}")

    # 1) Builder: ask model to produce files + tests
    system_builder = "You are Builder. Return ONLY a JSON array named 'files' with file objects {path, content}. Include tests under tests/. Do not call external services. Keep code small and runnable with pytest."
    user_builder = f"Task: {task_desc}\nReturn JSON object: { \"files\": [ {{\"path\":\"src/example.py\",\"content\":\"...\"}} ] }"

    print("Calling builder model...")
    raw = call_model(system_builder, user_builder)

    # Try to extract JSON from model output
    try:
        # naive find first '{' to parse JSON
        start = raw.find('{')
        json_text = raw[start:]
        data = json.loads(json_text)
        files = data.get('files', [])
    except Exception as e:
        print("Failed to parse builder output:", e)
        print("Raw output:\n", raw)
        return

    # 2) write files
    write_files_from_json(files, base)
    print("Wrote files:")
    for f in files:
        print(" -", f['path'])

    # 3) commit
    git_commit_push(base, "chore: add builder files")

    # 4) run tests locally
    passed, output = run_pytest(base)
    print("Pytest passed:", passed)
    print(output)

    # 5) Reviewer: ask model to review files and test output
    system_rev = "You are Reviewer. Given list of file paths and test output, suggest fixes or 'approve'. Return JSON: {status: 'approve'|'fix', changes: [{path, content}], notes: '...'}"
    file_list = [str((base / f['path']).as_posix()) for f in files]
    user_rev = json.dumps({"files": file_list, "pytest_output": output})
    review_raw = call_model(system_rev, user_rev, model=MODEL_REVIEWER)

    try:
        start = review_raw.find('{')
        review_json = json.loads(review_raw[start:])
    except Exception as e:
        print("Failed to parse reviewer output:", e)
        print("Raw review:\n", review_raw)
        return

    print("Reviewer status:", review_json.get('status'))
    if review_json.get('status') == 'fix':
        changes = review_json.get('changes', [])
        write_files_from_json(changes, base)
        git_commit_push(base, "fix: apply reviewer changes")
        print("Applied reviewer changes. Run tests again manually.")
    else:
        print("Approved by reviewer. Open a PR for human review before merge.")


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--task', required=True, help='Short task description')
    parser.add_argument('--repo', default='.', help='Path to repo')
    args = parser.parse_args()
    orchestrate(args.task, args.repo)
