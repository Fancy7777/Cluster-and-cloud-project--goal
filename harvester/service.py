import json

import logging
from collections import OrderedDict

import re
from nltk.sentiment import SentimentIntensityAnalyzer

from harvester import config
from harvester.db import Repository

tag = config.parser['tagging']['tag_name']
keyword = config.parser['tagging']['keyword']

sid = SentimentIntensityAnalyzer()


def sort_ordered_dict(order_dict):
    return OrderedDict(sorted(order_dict.items(), key=lambda x: x[1], reverse=True))


class TweetHarvestingService(object):
    def __init__(self):
        self.repo = Repository(config.tweet_db_name, config.connection)

    def process(self, raw_data):
        tweet = json.loads(raw_data)
        skip = False
        try:
            tweet['_id'] = tweet['id_str']
        except KeyError:
            try:
                tweet['_id'] = tweet['id']
            except KeyError as e:
                msg = '[SKIP] Tweet without id_str or id.\n'
                msg += json.dumps(tweet)
                msg += '\n'
                logging.exception(msg)
                skip = True

        if skip:
            pass
        else:

            # Add sentiment analysis tag if a keyword present
            match = re.findall(keyword, tweet['text'])
            if match:
                result = sort_ordered_dict(sid.polarity_scores(tweet['text'])).keys()
                tweet.update({tag: list(result)[0]})

            _id, _rev = self.repo.store(tweet)
            print('id: {}  rev: {}'.format(_id, _rev))
