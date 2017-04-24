import tweepy
from tweepy import Stream

from harvester import config

auth = tweepy.OAuthHandler(config.consumer_key, config.consumer_secret)
auth.set_access_token(config.access_token, config.access_token_secret)


class StdOutStreamListener(tweepy.StreamListener):
    def on_data(self, raw_data):
        print(raw_data)

    def on_error(self, status_code):
        print(status_code)


def streaming():
    l = StdOutStreamListener()
    s = Stream(auth, l)
    s.filter(locations=config.locations, track=config.track)


def main():
    streaming()


if __name__ == '__main__':
    main()
