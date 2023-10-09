import json
import os
import threading

from src.deploy_server import build_servers
from src.git_helpers import get_last_commit, get_changed_files
from src.helpers import extract_servers_to_deploy, print_title


last_commit_hash = get_last_commit()

print("Last commit hash ", last_commit_hash)

files = get_changed_files(last_commit_hash)

print_title("Files: ")
for file in files:
    print("\t- ", file)
print()



with open('servers.config.json', 'r') as f:
    SERVER_CONFIGURATIONS = json.load(f)

with open('kubernetes.config.json', 'r') as f:
    KUBERNETES_CONFIGURATION = json.load(f)

servers_to_deploy = extract_servers_to_deploy(files)
# servers_to_deploy = [
#     ('authorization','1.0.1'),
#     ('users','1.0.3'),
#     ('teams','1.0.2'),
#     ('tournaments','1.0.2'),
#     ('organizations','1.0.1'),
#     ('locations','1.0.1')
# ]

env = os.environ.get('ENV') or 'pdn'

CURRENT_KUBERNETES_CONFIGURATION = KUBERNETES_CONFIGURATION[env]

build_servers(servers_to_deploy, SERVER_CONFIGURATIONS,CURRENT_KUBERNETES_CONFIGURATION, env)
