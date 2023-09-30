import requests
from json import loads, dump
from pgeocode import Nominatim


response = requests.get('https://www.datos.gov.co/resource/xdk5-pm3f.json?$query=SELECT%0A%20%20%60region%60%2C%0A%20%20%60c_digo_dane_del_departamento%60%2C%0A%20%20%60departamento%60%2C%0A%20%20%60c_digo_dane_del_municipio%60%2C%0A%20%20%60municipio%60')
data = response.json()
nomi = Nominatim('co')
def normalize(name):
  return name.replace('í', 'i').replace('á', 'a').replace('é', 'e').replace('ó', 'o').replace('ú', 'u')


def check_state_name(name):
  m = {
    'choco': 'Chocó',
    'boyaca': 'Boyacá',
    'atlantico': 'Atlántico',
    'caqueta': 'Caquetá',
    'guainia': 'Guainía',
    'vaupes': 'Vaupés',
    'cordoba': 'Córdoba',
  }
  
  if( name.lower() in m):
    return (m[name.lower()])
  return name
content = []

for item in data:
  CITY = item['municipio']
  STATE = item['departamento']
  city = normalize(CITY)
  state = normalize(STATE)
  x = nomi.query_location(city)
  if(not x.empty):
    rows = loads(x.to_json(orient='records'))
    notFound = True
    i =  0
    row_data = None
    while notFound and i < len(rows):
      row = rows[i]
      if(row['state_name'].lower() == state.lower()):
        notFound = False
        row_data = row
      i+=1

      
    
    if(row_data == None):
      row_data = rows[0]
      print('Buscando ', city, state)
      print("Revisar: ", CITY, row_data['state_name'])
    STATE = check_state_name(row_data['state_name'])
    CITY = row_data['county_name']
    content.append(
      {
        'name': CITY,
        'state': STATE,
        'latitude': row_data['latitude'],
        'longitude': row_data['longitude'],
      }
    )
      
        

with open('location-scripts/cities.json', 'w', encoding='UTF-8') as t:
  dump( content, t,indent=2, ensure_ascii=False)
