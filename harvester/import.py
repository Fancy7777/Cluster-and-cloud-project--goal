import couchdb
import json
#from harvester.service import TweetHarvestingService as tweet_service

ausgrid = [111.89575195844913,-44.01059552028073,154.9154663073704,-9.93368223492055]
couch = couchdb.Server('serverlink')
db = couch['dbname']
COUNT = 0

def checklocation(coordinate):
    if coordinate[0] > ausgrid[0] and coordinate[0] < ausgrid[2] and \
                    coordinate[1] > ausgrid[1] and coordinate[1] < ausgrid [3]:
        return True
    else:
        return False

def twitterprocess(raw_data):
    coordinate = data = (json.loads(raw_data)['json']['coordinates']['coordinates'])
    if checklocation(coordinate):
        data = (json.loads(raw_data)['json'])
        data['_id'] = data['id_str']
        db.save(data)
        print(data['_id'])
        global COUNT
        COUNT = COUNT + 1
    return

def readtwitter():
    print('Start reading twitter file...')
    with open('tinyTwitter.json', 'rt', encoding='latin1') as tweet_data:
        for line in tweet_data:
            if line[0] == '{':
                data = ''
                line = line[:-1]
                if line[-1] == ',':
                    twitterprocess(line[:-1])
                else:
                    twitterprocess(line)
        print('Toal number of tweets: ' + str(COUNT))
    return

readtwitter()