import json
import logging
from configparser import ConfigParser

parser = ConfigParser()
parser.read(r'config.ini')

aws_access_key_id = parser['credentials']['aws_access_key_id']
aws_secret_access_key = parser['credentials']['aws_secret_access_key']

endpoint = parser['nectar']['endpoint']
endpoint_path = parser['nectar']['endpoint_path']
region = parser['nectar']['region']
port = parser['nectar']['port']
placement = parser['nectar']['placement']

default_instance_name = parser['default']['instance_name']
default_image_id = parser['default']['image_id']
default_key_name = parser['default']['key_name']
default_instance_type = parser['default']['instance_type']
default_security_groups = json.loads(parser['default']['security_groups'])

logging.basicConfig(
    # filename='automaton_nectar_' + datetime.now().strftime('%Y%m%d_%H%M%S') + '.log',
    filename='automaton_nectar.log',
    filemode='w',
    level=logging.INFO,
    format='%(asctime)s [%(levelname)s] %(message)s',
    datefmt='%m/%d/%Y %I:%M:%S %p')

logging.info('Logging started...')
