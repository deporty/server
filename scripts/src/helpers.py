import re
import json
import os
import threading
import concurrent.futures
import subprocess


def extract_servers_to_deploy(files):
    response = []
    servers = []

    for file in files:
        pattern = re.compile(r'^servers/([a-zA-Z-_]+)')
        res = pattern.match(file)
        if(res != None):
          s = res.group(1)
          if(s not in servers):
            package_json = json.load(open('../servers/' + s +'/package.json' ))
            version = package_json['version']
                                     
            response.append((s,version))
            servers.append(s)
    return response


      
def build_packages():
  LOG_FOLDER = 'logs'
  if(not os.path.exists(LOG_FOLDER)):
    os.mkdir(LOG_FOLDER)
  
  PACKAGES_PATH = LOG_FOLDER+ '/packages.log'

    
  
  print_title("Construyendo Paquetes")
  packages = os.listdir('../packages')
  threads = []
  
  with concurrent.futures.ThreadPoolExecutor(max_workers=len(packages)) as executor:
    for package in packages:
      threads.append( executor.submit(build_package, package) )


  concurrent.futures.wait(threads)
  content = ''
  
  for thread in threads:
    content += thread.result()
    content += '\n'
  
  with open(PACKAGES_PATH, 'w') as f:
    f.write(content)
    
    


def build_package(package):
  print_title("Construyendo " + package)
  command = 'cd ../packages/' + package + ' && npm run build'
  print(command)
  res = subprocess.check_output(command,  shell=True, text=True)
  return res
  
def _print_title(title):
  i = 1
  while(True):
    print()
    print(i, title.upper())
    print()
    i = i + 1 
    yield i
  
def print_title(title):
  next(_print_title( title))