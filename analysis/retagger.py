"""
Retagger is a Spark Application using Spark Cloudant Connector to connect CouchDB
 and using DataFrame to search a keyword present in a tweet text. If found, tag the
 tweet with sentiment analysis using NLTK Vader. The tag will append back to tweet
 and save back to the same or a different database.
 
 Configure configuration section for your case.
"""

import logging
from collections import OrderedDict
from datetime import datetime

from nltk.sentiment import SentimentIntensityAnalyzer

from pyspark.sql import SparkSession
from pyspark.sql.functions import udf
from pyspark.sql.types import *
from pyspark.sql.utils import AnalysisException

# -- CONFIGURATION START --
db_host = '123.456.789.901:5000'
db_user = 'admin'
db_password = 'password'
db_source = 'tweet_raw'
db_target = db_source  # store back to the same database, can be a different database

tag_name = 'tag'  # tag name e.g. {"tag" : "positive"}
keyword = 'Trump'  # can be regex e.g. [Tt]rump
part_size = 32  # data partition size i.e. data parallelism partitioning, parallel = database doc size / part_size
app_name = 'Retagger'

# logging.basicConfig(
#     filename=app_name + datetime.now().strftime('%Y%m%d_%H%M%S') + '.log',
#     filemode='w',
#     level=logging.INFO,
#     format='%(asctime)s [%(levelname)s] %(message)s',
#     datefmt='%m/%d/%Y %I:%M:%S %p')
#
# logging.info('Logging started...')

# -- CONFIGURATION END --

sid = SentimentIntensityAnalyzer()


def sentiment(text):
    return sort_ordered_dict(sid.polarity_scores(text))


def sort_ordered_dict(order_dict):
    return OrderedDict(sorted(order_dict.items(), key=lambda x: x[1], reverse=True)).keys()[0]


def has_column(df, col):
    try:
        var = df[col]
        return True
    except AnalysisException:
        return False


def main():
    spark = SparkSession \
        .builder \
        .appName(app_name) \
        .config('cloudant.host', db_host) \
        .config('cloudant.username', db_user) \
        .config('cloudant.password', db_password) \
        .config('cloudant.protocol', 'http') \
        .config('jsonstore.rdd.partitions', part_size) \
        .getOrCreate()

    tweet = spark.read.load(db_source, 'com.cloudant.spark')
    tweet.cache()
    # tweet.printSchema()

    if not has_column(tweet, tag_name):

        filtered_tweet = tweet.filter(tweet.text.rlike(keyword))

        sentiment_udf = udf(sentiment, StringType())

        df = filtered_tweet.withColumn(tag_name, sentiment_udf(filtered_tweet['text']))

        # df.select('_id', 'text', 'tag').show()
        # print(df.count())

        df.write.format('com.cloudant.spark').save(db_target)


if __name__ == '__main__':
    main()
