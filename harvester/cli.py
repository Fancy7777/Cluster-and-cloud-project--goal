import logging
import signal
import sys
import time

import tweepy
from tweepy import Stream

from harvester import config
from harvester.sapi import TweetStreamingListener


class Harvester(object):
    def __init__(self):
        self.auth = tweepy.OAuthHandler(config.consumer_key, config.consumer_secret)
        self.auth.set_access_token(config.access_token, config.access_token_secret)
        self.stream = Stream(self.auth, TweetStreamingListener())
        signal.signal(signal.SIGINT, self.exit_signal_handler)

    def exit_signal_handler(self, signum, frame):
        msg = 'Stopping...'
        logging.info(msg)
        print(msg)
        self.stream.disconnect()
        time.sleep(10)  # easing
        sys.exit(0)

    def start(self):
        msg = 'Starting tweet stream harvesting. Press Ctrl+C to stop.'
        logging.info(msg)
        print(msg)
        self.stream.filter(locations=config.locations, track=config.track)


if __name__ == '__main__':
    Harvester().start()
