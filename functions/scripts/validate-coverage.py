import argparse
from bs4 import BeautifulSoup

parser = argparse.ArgumentParser(
    description='Validate de coverage for a lcov.')
parser.add_argument('--path', help='Path to index.html lcov file')

args = vars(parser.parse_args())

rulers = {
    'Statements': 1,
    'Branches': 1,
    'Functions': 1,
    'Lines': 1
}
# ../coverage/lcov-report/index.html
errors = []
if(args['path'] != None):

    with open(args['path'], 'r') as t:
        content = t.read()
    soup = BeautifulSoup(content, features="html.parser")

    divs = soup.find_all(class_='space-right2')
    for div in divs:
        tag = div.find(class_='quiet').text
        value = float(div.find(class_='strong').text.replace('%', ''))

        prev_value = rulers[tag]
        if(value < prev_value):
            errors.append((tag, value, ' < ', prev_value))
if(len(errors) != 0):
    for error in errors:
        print(*error)
exit(1)
