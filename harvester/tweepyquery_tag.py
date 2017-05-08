# encoding: utf-8
import couchdb
from datetime import datetime
from couchdb import ResourceConflict
import tweepy
import json
import time
import logging
from nltk.sentiment.vader import SentimentIntensityAnalyzer
from collections import OrderedDict
from configparser import ConfigParser

parser = ConfigParser()
parser.read(r'queryconfig.ini')

consumer_key = parser['twitter']['consumer_key']
consumer_secret = parser['twitter']['consumer_secret']
access_token = parser['twitter']['access_token']
access_token_secret = parser['twitter']['access_token_secret']

locations = json.loads(parser['filter']['locations'])
keywords = json.loads(parser['filter']['keywords'])

connection = parser['couchdb']['connection']
tweet_db_name = parser['couchdb']['tweet_db_name']

#logging file for duplicates
logging.basicConfig(
    filename='tweepyquery_' + datetime.now().strftime('%Y%m%d_%H%M%S') + '.log',
    filemode='w',
    level=logging.INFO,
    format='%(asctime)s [%(levelname)s] %(message)s',
    datefmt='%m/%d/%Y %I:%M:%S %p')

logging.info('Logging started...')
#sentiment analysis
sid = SentimentIntensityAnalyzer()
def sort_orderedDict(orderdict):
    return OrderedDict(sorted(orderdict.items(), key = lambda x:x[1], reverse = True))

#keyword list in searchquery
def argu(wordlist):
    if len(wordlist) == 1:
        return wordlist[0]
    else:
        argument =''
        for word in wordlist:
            if wordlist[0] == word:
                argument = argument+word
            else:
                argument = argument + ' OR '+word
        return argument
keywordlist = argu(keywords)


auth = tweepy.OAuthHandler(consumer_key, consumer_secret)
auth.set_access_token(access_token, access_token_secret)
api = tweepy.API(auth, wait_on_rate_limit=True, wait_on_rate_limit_notify=True)
print('auth passed')

searchquery = "-RT geocode:"+ locations + ' ' + keywordlist
users = tweepy.Cursor(api.search, q=searchquery).items()

#connect to couchdb server and access to database
couch = couchdb.Server(connection)
try:
    targetdb = couch[tweet_db_name]
except couchdb.http.ResourceNotFound:
    targetdb = couch.create(tweet_db_name)

errorCount = 0
while True:
    try:
        user = next(users)
    except tweepy.TweepError:
        # catches TweepError when rate limiting occurs, sleeps, then restarts.
        # nominally 15 minnutes, make a bit longer to avoid attention.
        print("sleeping....")
        time.sleep(60 * 16)
        user = next(users)
    except StopIteration:
        print("sleeping....no more tweets for now...")
        time.sleep(60 * 60)
        user = next(users)
    try:
        data = user._json
        # data_info = str(data['id']) + '  location: '+ str(data['user']['location']) +'   '+ str(data['text'])
        skip = False
        try:
            data['_id'] = data['id_str']
        except KeyError:
            try:
                data['_id'] = data['id']
            except KeyError as e:
                msg = '[SKIP] Tweet without id_str or id.\n'
                msg += json.dumps(data)
                skip = True
        if skip:
            pass
        else:
            data['_id'] = data['id_str']
            print('_id: ' + str(data['_id']))
            try:
                result = sort_orderedDict(sid.polarity_scores(data['text']))
                data.update({'tag': result.keys()[0]})
                targetdb.save(data)

            except ResourceConflict:
                logging.info("Duplicate observed: " +str(data['_id']))
                print("\n")
                pass
    except UnicodeEncodeError:
        errorCount += 1
        print("UnicodeEncodeError,errorCount =" + str(errorCount))
        pass
