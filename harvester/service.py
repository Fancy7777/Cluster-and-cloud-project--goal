import json

from harvester import config
from harvester.db import Repository


class TweetHarvestingService(object):
    def __init__(self):
        self.repo = Repository(config.tweet_db_name, config.connection)

    def process(self, raw_data):
        tweet = json.loads(raw_data)
        tweet['_id'] = tweet['id_str']

        # TODO:
        # We can filter at this point before storing into db.
        # For now, just save the raw. We should at least only
        # store the fields of interest to save db storage.

        _id, _rev = self.repo.store(tweet)
        print('id: {}  rev: {}'.format(_id, _rev))
