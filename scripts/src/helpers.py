import re
import json

def extract_servers_to_deploy(files):
    response = []
    servers = []

    for file in files:
        pattern = re.compile(r'^servers/([a-zA-Z-_]+)')
        res = pattern.match(file)
        if(res != None):
            s = res.group(1)
            if(s not in servers):
                package_json = json.load(
                    open('../servers/' + s + '/package.json'))
                version = package_json['version']

                response.append((s, version))
                servers.append(s)
    return response


def _print_title(title):
    i = 1
    while(True):
        print()
        print(i, title.upper())
        print()
        i = i + 1
        yield i


def print_title(title):
    next(_print_title(title))
