import configparser

parser = configparser.ConfigParser()
parser.read('config.ini')


def mksample():
    parser['twitter']['consumer_key'] = 'consumer_key'
    parser['twitter']['consumer_secret'] = 'consumer_secret'
    parser['twitter']['access_token'] = 'access_token'
    parser['twitter']['access_token_secret'] = 'access_token_secret'

    parser['couchdb']['connection'] = 'http://localhost:5984/'

    with open('config.ini.sample', 'w') as sample:
        parser.write(sample)


def main():
    mksample()


if __name__ == '__main__':
    main()
