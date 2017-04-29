import json

import logging

from harvester import config
from harvester.db import Repository


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
            # NOTE:
            # We can filter at this point before storing into db.
            # For now, just save the raw tweet.
            _id, _rev = self.repo.store(tweet)
            print('id: {}  rev: {}'.format(_id, _rev))
