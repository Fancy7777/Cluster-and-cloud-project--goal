import couchdb
import json
from harvester import tweepyquery_tag as config

couch = couchdb.Server(config.connection)

try:
    filename = input("Give the name of the file you wish to import to couchdb and make sure it's in the same folder:")
except ValueError:
    print("not a valid input")

with open(filename) as json_data:
    data = json.load(json_data)

try:
    tweet_db_name = input("Importing to which db?:")
except ValueError:
    print("not a valid input")

try:
    targetdb = couch[tweet_db_name]
except couchdb.http.ResourceNotFound:
    targetdb = couch.create(tweet_db_name)

targetdb.save(data)