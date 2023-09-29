import os
import shutil
import subprocess


command = 'npx tsc -p ../tsconfig.json'

print(command)

res = subprocess.check_output(command,  shell=True, text=True)


files = [
    {
        'original': r'../package.json',
        'target': r'../dist/package.json'
    },
    {
        'original': r'../.npmrc',
        'target': r'../dist/.npmrc'
    }
]
for f in files:
    shutil.copyfile(f['original'], f['target'])


print(res)