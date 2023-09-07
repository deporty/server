import os
import shutil
os.system('npm run compile')

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


