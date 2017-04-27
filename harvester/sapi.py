import logging
from datetime import datetime

from tweepy import StreamListener

from harvester.service import TweetHarvestingService


class TweetStreamingListener(StreamListener):
    # TODO need to test rigorously. Note: beware of Twitter API rate limit!
    def __init__(self):
        super().__init__()
        self.tweet_service = TweetHarvestingService()

    def on_data(self, raw_data):
        self.tweet_service.process(raw_data)

    def on_error(self, status_code):
        logging.error('on_error:  {}'.format(status_code))
        if status_code == 420:
            # returning False in on_data disconnects the stream
            return False

    def on_limit(self, track):
        logging.error('on_limit:  {}'.format(track))
        return False

    def on_timeout(self):
        msg = 'on_timeout: occur at  {}'.format(datetime.now().strftime('%Y%m%d_%H%M%S'))
        logging.error(msg)
        return False

    def on_warning(self, notice):
        logging.error('on_warning:  {}'.format(notice))
        return False

    def on_disconnect(self, notice):
        logging.error('on_disconnect:  {}'.format(notice))
        return False

    def on_delete(self, status_id, user_id):
        logging.error('on_delete:  {}  {}'.format(status_id, user_id))
        return False

    def on_exception(self, exception):
        logging.error('on_exception:  {}'.format(exception))
        return False
