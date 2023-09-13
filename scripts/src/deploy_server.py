
import subprocess
from src.docker_helpers import generate_dockerfile, build_image, upload_image
from src.kubernetes_helpers import kube, get_ingress_template
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
  
  for server in servers_to_deploy:
    version = server[1]
    config = organize_server_config(server_configurations[server[0]], env)
    
    if(config['enabled']):
      
      deploy_server(config, version, current_kubernetes_configuration)
    else:
      print("Omiting deployment: " + config['name'])
    
  ingress_path = get_ingress_template(server_configurations)


def deploy_server(server_config, version, current_kubernetes_configuration):
    project = current_kubernetes_configuration['project']
    print_title(f"Construyendo: {server_config['name']} {version}")

    LOG_FOLDER = 'logs'
    if(not os.path.exists(LOG_FOLDER)):
        os.mkdir(LOG_FOLDER)

    SERVICE_LOG_FOLDER = 'logs/'+server_config['name'] + '.log'
    
    logger = Logger(SERVICE_LOG_FOLDER)
    logger.log('Building service ' + server_config['name'])
    command = 'cd ../servers/' + server_config['name'] + ' && npm run build'
    
    
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
    
    ingress = kube(server_config, logger)
    
    
    command = f'kubectl apply -f {ingress}'
    res = subprocess.check_output(command,  shell=True, text=True)
      
    logger.log(res)
    logger.save()