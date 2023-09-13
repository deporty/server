import subprocess
import re


def get_last_commit():
    return subprocess.check_output('git rev-parse HEAD',  shell=True, text=True)


def get_changed_files(commit_hash):

    a = subprocess.check_output(
        'git diff --name-only ' + commit_hash,  shell=True, text=True)
    b = a.split('\n')

    def delete_exceptions(x):
        paths_to_resolve = [
            '^servers',
            '^packages',
        ]

        valid = False
        i = 0
        while(not valid and i < len(paths_to_resolve)):
            pat = paths_to_resolve[i]
            pattern = re.compile(pat)
            t = pattern.findall(x)
            valid = len(t) > 0
            i += 1
        return valid

    res = list(
        filter(
            delete_exceptions,
            filter(lambda x: x != '', b)
        )
    )
    return res
