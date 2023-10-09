import shutil
import subprocess    
import argparse

parser = argparse.ArgumentParser(description="")
    
# Agrega argumentos
parser.add_argument('--env', help="Environtment: local, dev, pdn")

# Parsea los argumentos
args = parser.parse_args()

env = args.env or 'pdn'  

current_env_path  = f'../environments/env.ts'
target_env_path  = f'../environments/{env}.ts'

with open(current_env_path, 'r') as t:
    current_env_content = t.read()

with open(target_env_path, 'r') as t:
    target_env_content = t.read()

with open(current_env_path, 'w') as t:
    t.write(target_env_content)




res = subprocess.check_output('cd .. && npx tsc -p tsconfig.json',  shell=True, text=True)
  

with open(current_env_path, 'w') as t:
    t.write(current_env_content)

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