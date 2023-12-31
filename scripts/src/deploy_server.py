
import subprocess
from src.docker_helpers import generate_dockerfile, build_image, upload_image
from src.kubernetes_helpers import kube
from src.helpers import  print_title
from src.logger import  Logger
import os
import copy


def organize_server_config(server_config, env):
  response = copy.deepcopy(server_config)
  for key in server_config['environment'][env].keys():
    response[key] = server_config['environment'][env][key]
  return response
  
  
  
def build_servers(servers_to_deploy, server_configurations, current_kubernetes_configuration, env):
  
  print_title("Construyendo servicios")
  
  project = current_kubernetes_configuration['project']
  cluster = current_kubernetes_configuration['cluster']
  region = current_kubernetes_configuration['region']
  command = f'gcloud container clusters get-credentials {cluster} --region {region} --project {project}'
  res = subprocess.check_output(command,  shell=True, text=True)
  
  for server in servers_to_deploy:
    version = server[1]
    config = organize_server_config(server_configurations[server[0]], env)
    
    if(config['enabled']):
      
      deploy_server(config, version, current_kubernetes_configuration, env)
    else:
      print("Omiting deployment: " + config['name'])
    

def deploy_server(server_config, version, current_kubernetes_configuration, env):
    project = current_kubernetes_configuration['project']
    cluster = current_kubernetes_configuration['cluster']
    region = current_kubernetes_configuration['region']
    print_title(f"Construyendo: {server_config['name']} {version}")

    LOG_FOLDER = 'logs'
    if(not os.path.exists(LOG_FOLDER)):
        os.mkdir(LOG_FOLDER)

    SERVICE_LOG_FOLDER = 'logs/'+server_config['name'] + '.log'
    
    logger = Logger(SERVICE_LOG_FOLDER)
    logger.log('Building service ' + server_config['name'])
    command = 'cd ../servers/' + server_config['name'] + ' && npm install'
   
    logger.log(command)
    print(command)
    res = subprocess.check_output(command,  shell=True, text=True)
    
   
    command = 'cd ../servers/' + server_config['name'] + f' && npm run build -- --env {env}'
    
    print(command)
    logger.log(command)
    
    res = subprocess.check_output(command,  shell=True, text=True)
    
    
    with open(f"../servers/{server_config['name']}/dist/src/infrastructure/{server_config['name']}.constants.js", "r") as t:
      constants = t.read()
    
    constants = constants.replace("exports.SERVER = 'http://127.0.0.1:10000';",f"exports.SERVER = '{current_kubernetes_configuration['ip']}';")
    constants = constants.replace("exports.SERVER = \"http://127.0.0.1:10000\";",f"exports.SERVER = '{current_kubernetes_configuration['ip']}';")
    with open(f"../servers/{server_config['name']}/dist/src/infrastructure/{server_config['name']}.constants.js" ,"w") as t:
      t.write(constants)
      
    
    logger.log(res)
    logger.save()
    
    dockerfile_path = generate_dockerfile(server_config, logger)

    tag = build_image(dockerfile_path, server_config, version, logger)
    cloud_tag =  upload_image(tag, project,server_config,logger, current_kubernetes_configuration)
    server_config['image'] = cloud_tag
    
    kube(server_config, logger, cluster, region, project)
    
    print(logger.content())
    
    
