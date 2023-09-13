import os
import shutil
import subprocess
res = subprocess.check_output('cd .. && tsc -p tsconfig.json',  shell=True, text=True)


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

