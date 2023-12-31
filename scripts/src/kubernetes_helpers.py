import subprocess
import re

def kube(server_config, logger, cluster, region,project):
  


  command = f"gcloud container clusters get-credentials {cluster} --region {region} --project {project}"
  print(command)
  res = subprocess.check_output (command, shell=True, text=True)
  logger.log(res)
  logger.save()
  
  route = get_deployment_template(server_config)
  
  print()
  command = f"kubectl apply -f {route}"
  print(command)
  print()
  res = subprocess.check_output (command, shell=True, text=True)
  logger.log(res)
  logger.save()



def get_deployment_template(server_config):
  
  with open("deployment-templates/service-deployment.yaml", "r") as deployment:
    template = deployment.read()
    
    pattern = re.compile(r":\[([\w\-]+)\]:")
    res = pattern.search(template)
    while res != None:
      key = res.group(1)
      template = template.replace(res.group(0), str(server_config[key]))
      res = pattern.search(template)
  
  route = f"{server_config['name']}-service-deployment.yaml"
  with open(f"{server_config['name']}-service-deployment.yaml", "w") as deployment:
    deployment.write(template)
  
  return route

    