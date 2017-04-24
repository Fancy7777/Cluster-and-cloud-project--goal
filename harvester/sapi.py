from tweepy import StreamListener


class HarvesterStreamListener(StreamListener):
    def __init__(self):
        super().__init__()

    def on_data(self, raw_data):
        pass

    def on_error(self, status_code):
        pass

