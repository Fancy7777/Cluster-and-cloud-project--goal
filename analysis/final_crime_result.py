from pyspark.sql import SparkSession
import nltk
from string import punctuation
from nltk.corpus import stopwords
from nltk.corpus import wordnet as wn
from collections import OrderedDict
from nltk.stem import WordNetLemmatizer
import couchdb

from couchdb import ResourceConflict
import time
from time import gmtime, strftime
from datetime import datetime, timedelta



lemmatizer = nltk.stem.wordnet.WordNetLemmatizer()
word_tokenizer = nltk.tokenize.regexp.WordPunctTokenizer()
stop_words = stopwords.words('english')
non_words = list(punctuation)
couch = couchdb.Server('http://cadmin:qwerty8888@115.146.94.41:9584/')




def get_content():
    spark = SparkSession \
        .builder \
        .appName("Crime Detection") \
        .config("cloudant.host", "115.146.94.41:9584/") \
        .config("cloudant.username", "cadmin") \
        .config("cloudant.password", "qwerty8888") \
        .config("cloudant.protocol", "http") \
        .config('jsonstore.rdd.partitions', 32) \
        .getOrCreate()

    spark.sql(" CREATE TEMPORARY VIEW tweetTmpView USING com.cloudant.spark OPTIONS ( database 'tweet_raw_crimeresult')")

    twt = spark.sql('SELECT text,entities,geo,created_at,user FROM tweetTmpView')
    # hashtag = spark.sql('SELECT hashtags FROM tweetTmpView')
    # twt.printSchema()

    # print 'Total # of rows in tweet_raw: ' + str(twt.count())
    content = []
    for tw in twt.collect():
        content_dict = {}
        if (len(tw.entities.hashtags) == 0):
            content_dict['twitter_content'] = tw.text.encode('utf-8')
            content_dict['geo'] = tw.geo
            content_dict['created_at'] = tw.created_at
            content_dict['location'] = tw.user.location
        else:
            content_dict['twitter_content'] = tw.text.encode('utf-8')
            content_dict['hashtag'] = tw.entities.hashtags[0].text
            content_dict['geo'] = tw.geo
            content_dict['created_at'] = tw.created_at
            content_dict['location'] = tw.user.location

        content.append(content_dict)
    return content


def preprocess(content):
    word_tokenizer = nltk.tokenize.regexp.WordPunctTokenizer()

    words_set = []
    for twitter in content:
        words_set += (word_tokenizer.tokenize(twitter['twitter_content']))
    words_set = list(set(words_set))

    stop_words = stopwords.words('english')
    non_words = list(punctuation)
    lemmatizer = nltk.stem.wordnet.WordNetLemmatizer()

    # only need the alphabetic word
    formartted_twitter_words_set = []
    for word in words_set:
        if (word.isalpha() != False) and (word not in non_words) and (word not in stop_words):
            formartted_twitter_words_set.append(lemmatizer.lemmatize(word))

    nltk_words_set = list(set(nltk.corpus.words.words()))
    # training whole set
    training_set = formartted_twitter_words_set + nltk_words_set
    return training_set

def format_word(text):
    formartted_twitter_content = []
    tweeter_content = word_tokenizer.tokenize(text)
    for word in tweeter_content:
        if (word.isalpha() != False) and (word not in non_words) and (word not in stop_words):
            formartted_twitter_content.append(lemmatizer.lemmatize(word))
    return formartted_twitter_content

def process_content(tweeter_content):
    #only need the alphabetic word
    for tweeter in tweeter_content:
        if 'hashtag' in tweeter.keys():
            tweeter['twitter_content'] = format_word(tweeter['twitter_content'])
            tweeter['hashtag'] = format_word(tweeter['hashtag'])
        else:
            tweeter['twitter_content'] = format_word(tweeter['twitter_content'])
    return tweeter_content


# split the word in hashtags by using the training set
# using backward MaxMatch
def find_match_word(hash_content, wordlist):
    split_words = []
    while len(hash_content) != 0:
        # return the index of the matched word
        word, index = check_match(hash_content, wordlist)
        split_words.append(word)
        # remove the matched words from the original tokens
        hash_content = hash_content[len(hash_content) * (-1):index]
    return split_words




def check_match(hash_content, wordlist):
    count = 0
    i = 0
    j = len(hash_content) * (-1)
    temp = ''
    while i >= j:
        i -= 1
        # save the temporary word and wait for max match
        if lemmatizer.lemmatize(hash_content[i:]) in wordlist and i != j:
            temp = hash_content[i:]
            count = i
        # if already rich the max lenght, return current saved temporary word
        elif lemmatizer.lemmatize(hash_content[i:]) in wordlist and i == j:
            temp = hash_content[i:]
            return temp, i
        else:
            # base case: if reach the maximum length and the word is not in wordlist
            # return current temporary word
            if len(temp) > 0 and i == j:
                return temp, count
            # return one single letter if theres no match
            elif len(temp) == 0 and i == j:
                return hash_content[i:], -1
            else:
                continue

# spit the tag from here
def split_tag(content_data,training_set):
    # split the hashtag content now!!
    for twitter in content_data:
        if 'hashtag_content' in twitter.keys():
            twitter['hashtag_content'] = find_match_word(twitter['hashtag_content'].lower(), training_set)
    return content_data



#check the lemmas for a given word
def lemmas_of_a_word(word):
    lemmas = []
    for item in wn.synsets(word):
        for lemma in item.lemmas():
            lemmas.append(lemma)
    return lemmas

#check the matched lemmas for given lemmas
def matched_lemma(lemmas, word):
    match_lemma =[]
    for lemma in lemmas:
        if lemma.name().lower() == word.lower() or lemma.name() == word:
            match_lemma.append(lemma)
    return match_lemma

#filter out the primary senses
def primary_sense(word):
    lemmas_order_dic ={}
    for item in matched_lemma(lemmas_of_a_word(word),word):
        lemmas_order_dic[item.key()] = item.count()
    return lemmas_order_dic

#sort the dict to filter the primary sense
def sort_orderedDict(orderdict):
    return OrderedDict(sorted(orderdict.items(), key = lambda x:x[1], reverse = True))


#store the sysnset for the most common sense
def store_synset_primarySense(word):
    result = {}
    check_item = sort_orderedDict(primary_sense(word.lower()))
    if len(check_item)==1:
        if wn.lemma_from_key(check_item.keys()[0]).synset().pos() == 'n' or wn.lemma_from_key(check_item.keys()[0]).synset().pos() == 'v':
                result[word] = wn.lemma_from_key(check_item.keys()[0]).synset()
    elif len(check_item)>1:
        for index in range(len(check_item.keys())):
            try:
                if wn.lemma_from_key(check_item.keys()[index]).synset().pos() == 'n' or wn.lemma_from_key(check_item.keys()[index]).synset().pos() == 'v':
                    result[word] = wn.lemma_from_key(check_item.keys()[index]).synset()
                    continue
            except nltk.corpus.reader.wordnet.WordNetError:
                continue
            else:
                pass
    else:
        return 0
    return result

#use the lemmatizer defined in the previous workshop
def lemmatize(word):
    lemma = lemmatizer.lemmatize(word,'v')
    if lemma == word:
        lemma = lemmatizer.lemmatize(word,'n')
    return lemma


def cal_happiness(test_data):
    twitter_synset = []
    for word in test_data:
        # print word
        synset = store_synset_primarySense(lemmatize(word))
        if synset ==0:
            continue
        elif (len(synset) > 0):
            twitter_synset.append(synset)

    wu_palmer_score = 0
    wu_palmer_score1 = 0
    wu_palmer_score2 = 0
    wu_palmer_score3 = 0
    wu_palmer_score4 = 0
    wu_palmer_score5 = 0
    wu_palmer_score6 = 0
    for word in twitter_synset:
        wu_palmer_score += wn.wup_similarity(word.values()[0], store_synset_primarySense('crime').values()[0])
        wu_palmer_score1 += wn.wup_similarity(word.values()[0], store_synset_primarySense('homicide').values()[0])
        wu_palmer_score2 += wn.wup_similarity(word.values()[0], store_synset_primarySense('robbery').values()[0])
        wu_palmer_score3 += wn.wup_similarity(word.values()[0], store_synset_primarySense('weapon').values()[0])
        wu_palmer_score4 += wn.wup_similarity(word.values()[0], store_synset_primarySense('burglary').values()[0])
        wu_palmer_score5 += wn.wup_similarity(word.values()[0], store_synset_primarySense('danger').values()[0])
        wu_palmer_score6 += wn.wup_similarity(word.values()[0], store_synset_primarySense('abduction').values()[0])
    if len(twitter_synset) == 0:
        return 0
    else:
        total = wu_palmer_score+wu_palmer_score1+wu_palmer_score2+wu_palmer_score3+wu_palmer_score4
        return float(float(total)/7.0) / float(len(twitter_synset))



def main():
    content = get_content()
    training_set = preprocess(content)
    content_data = split_tag(content,training_set)
    final_data = process_content(content_data)
    tweet_with_score = {}
    for tweet in final_data:
        if 'hashtag' in tweet.keys():
            acc_len = len(tweet['hashtag']) + len(tweet['twitter_content'])
            score_hashtag = cal_happiness(tweet['hashtag'])
            score_tweet_content = cal_happiness(tweet['twitter_content'])
            if acc_len ==0:
                final_socre = 0
            else:
                final_socre = float(2 * score_hashtag + score_tweet_content) / float(acc_len)
        else:
            acc_len = len(tweet['twitter_content'])
            score_tweet_content = cal_happiness(tweet['twitter_content'])
            if acc_len ==0:
                final_socre = 0
            else:
                final_socre = float(score_tweet_content) / float(acc_len)
        tweet['final_socre'] = final_socre
    try:
        targetdb = couch['result_data']
    except couchdb.http.ResourceNotFound:
        targetdb = couch.create('result_data')

    for tweet in final_data:
        targetdb.save(tweet)



if __name__ == '__main__':
    main()
