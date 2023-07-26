
import json

with open('Untitled-1.json', 'r') as f:
    content = json.load(f)
data = ''
for x in content:
    data = data + x['teamA']['id'] + '-' + x['teamB']['id']+'\n'

with open('res.txt', 'w') as f:
    f.write(data)

