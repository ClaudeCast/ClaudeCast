import subprocess
import random
from datetime import datetime, timedelta
import pytz
import os

def get_commit_hashes():
    # Get all commit hashes
    result = subprocess.run(['git', 'log', '--format=%H'], capture_output=True, text=True)
    return result.stdout.strip().split('\n')

def modify_commit_dates(commits):
    print(commits)
    if len(commits) < 2:
        print("Need at least 2 commits to modify dates")
        return

    # Start with current date for the newest commit
    current_date = datetime.now(pytz.UTC)
    
    # Create the filter-branch command with environment variables for each commit
    env = os.environ.copy()
    
    # Suppress git-filter-branch warning
    env['FILTER_BRANCH_SQUELCH_WARNING'] = '1'
    
    # Set the author name and email for all commits
    author_name = "ParthDesai"
    author_email = "desaiparth08@gmail.com"
    
    # Process commits from newest to oldest
    for i, commit in enumerate(commits):
        if i == 0:  # Most recent commit
            # Set to exact current time
            date_str = current_date.strftime('%a %b %d %H:%M:%S %Y +0000')
        else:
            # Random days before the previous commit (between 0.2 and 5 days)
            days_before = random.uniform(0.2, 5.0)
            current_date = current_date - timedelta(days=days_before)
            current_date = current_date.replace(
                hour=random.randint(0, 23),
                minute=random.randint(0, 59)
            )
            date_str = current_date.strftime('%a %b %d %H:%M:%S %Y +0000')
        
        # Store both author and committer dates
        env[f'GIT_AUTHOR_{commit}'] = date_str
        env[f'GIT_COMMITTER_{commit}'] = date_str
    
    filter_script = f'''
    COMMIT_SHA=$(git rev-parse $GIT_COMMIT)
    
    # Always set the author and email for every commit
    export GIT_AUTHOR_NAME="{author_name}"
    export GIT_AUTHOR_EMAIL="{author_email}"
    export GIT_COMMITTER_NAME="{author_name}"
    export GIT_COMMITTER_EMAIL="{author_email}"
    
    # Get the dates for this commit
    AUTHOR_DATE=$(printenv "GIT_AUTHOR_$COMMIT_SHA")
    COMMITTER_DATE=$(printenv "GIT_COMMITTER_$COMMIT_SHA")
    
    if [ ! -z "$AUTHOR_DATE" ]; then
        export GIT_AUTHOR_DATE="$AUTHOR_DATE"
        export GIT_COMMITTER_DATE="$COMMITTER_DATE"
    fi
    '''
    
    try:
        subprocess.run(
            ['git', 'filter-branch', '-f', '--env-filter', filter_script, '--', '--all'],
            env=env,
            check=True,
            stderr=subprocess.PIPE
        )
        print("\nCommit dates have been modified successfully!")
        print("\nYou may need to force push your changes:")
        print("git push -f origin main")
    except subprocess.CalledProcessError as e:
        if "Cannot create a new backup" in e.stderr.decode():
            print("Error: Previous backup exists. Run 'git filter-branch -f' to overwrite.")
        else:
            print(f"Error during filter-branch: {e.stderr.decode()}")

if __name__ == "__main__":
    try:
        commits = get_commit_hashes()
        print(f"Found {len(commits)} commits")
        modify_commit_dates(commits)
    except Exception as e:
        print(f"An error occurred: {str(e)}") 