import os
import subprocess
import threading

SERVER_FILE = '../servers'

files = os.listdir(SERVER_FILE)

files  =  list(
  filter(
    lambda x: os.path.isfile(f'{SERVER_FILE}/{x}/package.json'),
    filter(
      lambda x: os.path.isdir(f'{SERVER_FILE}/{x}'),
      files
    )
  )
)
threads = []

def run(server):
  command = f'cd {SERVER_FILE}/{file} && nodemon'
  print('--------------------------------')
  print(command)
  print()
  print('--------------------------------')
  try:
    os.system(f'cd {SERVER_FILE}/{file} && nodemon')
    # process = subprocess.Popen(command, stdout=subprocess.PIPE)
  except Exception as e:
    print(e)


for file in files:
  if(file == 'authorization'):
    h = threading.Thread(target=run, args=(file,) , name = file)
    
    threads.append(h)
    h.start()

isAlive = True
print('Longitud ', len(threads))
while isAlive:
  j = 0
  while j < len(threads) and isAlive:
    t = threads[j]
    isAlive = isAlive or t.is_alive()
    j+=1