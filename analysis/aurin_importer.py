import couchdb
import json

#modify it before import
couch = couchdb.Server('address')
db = couch['aurin_dataset_number']

try:
    filename = input("Give the name of the file you wish to import to couchdb and make sure it's in the same folder:")
except ValueError:
    print("not a valid input")

with open('filename') as json_data:
    data = json.load(json_data)

db.save(data)