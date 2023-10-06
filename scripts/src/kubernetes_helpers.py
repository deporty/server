import subprocess
import re

def kube(server_config, logger, cluster, region):

  command = f"gcloud container clusters get-credentials {cluster} --region {region} --project deporty-dev"
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
    

def get_ingress_template(servers_config, servers_to_deploy):
  
  with open("deployment-templates/ingress.yaml", "r") as ingress:
    template = ingress.read()
  for server in servers_config:
    server_config = servers_config[server]
    if(server_config['enabled']):
      path_ingress = '''
        - path: /:[ingress-path]:
          pathType: Prefix
          backend:
            service:
              name: :[name]:-svc
              port:
                number: :[port]:
      '''
        
      pattern = re.compile(r":\[([\w\-]+)\]:")
      
      res = pattern.search(path_ingress)
      while res != None:
        key = res.group(1)
        print(res.group(0), key)
        path_ingress = path_ingress.replace(res.group(0), str(server_config[key]))
        res = pattern.search(path_ingress)
      
      template += path_ingress
      
  route = "ingress.yaml"
  with open(route, "w") as deployment:
    deployment.write(template)
  
  return route
    