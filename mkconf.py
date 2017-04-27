import configparser

parser = configparser.ConfigParser()
parser.read('config.ini')


def mksample():
    # Never commit your local config.ini
    # Instead overwrite config values here, if any.
    # If you make changes to your local config.ini,
    # run python mkconf.py to update config.ini.sample.
    # And commit this sample file only.

    # harvester
    parser['twitter']['consumer_key'] = 'consumer_key'
    parser['twitter']['consumer_secret'] = 'consumer_secret'
    parser['twitter']['access_token'] = 'access_token'
    parser['twitter']['access_token_secret'] = 'access_token_secret'
    parser['couchdb']['connection'] = 'http://localhost:5984/'

    # automaton
    parser['credentials']['aws_access_key_id'] = 'INSERT_YOUR_ACCESS_KEY_FROM-ec2rc.sh'
    parser['credentials']['aws_secret_access_key'] = 'INSERT_YOUR_SECRET_KEY_FROM-ec2rc.sh'

    parser['default']['key_name'] = 'INSERT_YOUR_KEY_PAIR_NAME'
    parser['default']['instance_type'] = 'm2.small'

    parser['local']['key_file_path'] = '/home/username/path/to/key/location'
    parser['local']['key_file'] = 'cloud_key_pair.key'
    
    parser['db']['admin'] = 'admin'
    parser['db']['password'] = 'password'
    parser['db']['cookie'] = 'cookie'

    with open('config.ini.sample', 'w') as sample:
        parser.write(sample)


def main():
    mksample()


if __name__ == '__main__':
    main()
