import json
import logging
from configparser import ConfigParser
from datetime import datetime

parser = ConfigParser()
parser.read(r'config.ini')

consumer_key = parser['twitter']['consumer_key']
consumer_secret = parser['twitter']['consumer_secret']
access_token = parser['twitter']['access_token']
access_token_secret = parser['twitter']['access_token_secret']

locations = json.loads(parser['filter']['locations'])
track = json.loads(parser['filter']['track'])

connection = parser['couchdb']['connection']
tweet_db_name = parser['couchdb']['tweet_db_name']

logging.basicConfig(
    filename='harvester_' + datetime.now().strftime('%Y%m%d_%H%M%S') + '.log',
    filemode='w',
    level=logging.INFO,
    format='%(asctime)s [%(levelname)s] %(message)s',
    datefmt='%m/%d/%Y %I:%M:%S %p')

logging.info('Logging started...')
