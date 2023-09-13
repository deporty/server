import subprocess

def generate_dockerfile(server_config, logger):

  dockerfile = open('Dockerfile', 'r')
  contents = dockerfile.read()
  
  contents = contents.replace('$SERVER', server_config['name'])
  contents = contents.replace('$PORT', str(server_config['port']))
  
  route = '../Dockerfile.'+server_config['name']
  logger.log(f"The route for the dockerfile is {route}")
  new_dockerfile = open(route, 'w')
  new_dockerfile.write(contents)
  new_dockerfile.close()
  dockerfile.close()
  
  logger.log(f"\n{contents}\n")
  logger.save()
  return route

def build_image(dockerfile_path, server_config, version, logger):

  tag = f"{server_config['name']}:{version}"
  logger.log(f"\nTag: {tag}")
  command = f"cd ../ && docker build --tag {tag}  -f {dockerfile_path.replace('../','./')} ."
  print(command)
  res = subprocess.check_output (command, shell=True, text=True)
  logger.log(res)
  logger.save()
  
  return (tag)

def upload_image(tag, project,server_config,logger, current_kubernetes_configuration):
  repository = current_kubernetes_configuration['repository']
  location = current_kubernetes_configuration['region']
  location_registry = f"{location}-docker.pkg.dev"
  
  image_cloud_name = f"{location_registry}/{project}/{repository}/{tag}"
  
  # southamerica-east1-docker.pkg.dev/deporty-dev/deporty-dev/authorization:1.0.0
  # 
  command = "gcloud auth activate-service-account --key-file=google-cloud-key.json"
  command2 = f"docker tag {tag} {image_cloud_name}"
  command3 = f"gcloud auth configure-docker {location_registry}"
  command4 = f"docker push {image_cloud_name}"

  logger.log(f"\Renaming from {tag} to {image_cloud_name}")
  logger.log(command2)
  print(command2)
  res2 = subprocess.check_output (command2, shell=True, text=True)
  logger.log(res2)
  logger.save()
  
  logger.log(f"\nConfiguring cloud registry {image_cloud_name}")
  logger.log(command3)
  print(command3)
  res3 = subprocess.check_output (command3, shell=True, text=True)
  logger.log(res3)
  logger.save()
  
  logger.log(f"\nUploading image ")
  logger.log(command4)
  print(command4)
  res4 = subprocess.check_output (command4, shell=True, text=True)
  logger.log(res4)
  logger.save()
  
  return image_cloud_name
  