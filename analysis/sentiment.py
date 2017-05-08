import json
from collections import OrderedDict
from string import punctuation
from timeit import default_timer as timer

import nltk
from nltk.corpus import stopwords
from nltk.sentiment import SentimentIntensityAnalyzer

# use WordNetLemmatizer to lemmatize the word
lemmatizer = nltk.stem.wordnet.WordNetLemmatizer()
stop_words = stopwords.words('english')
non_words = list(punctuation)
word_tokenizer = nltk.tokenize.regexp.WordPunctTokenizer()


def make_training_set():
    # save the content data into format like following
    # [{'twitter_content': 'text,text,text,text', 'hashtag_content': '#whatthewaht'},...]
    content_data = []
    with open('tinyTwitter.json') as data_file:
        for line in data_file:
            content_dic = {}
            if line[0] == '{':
                line = line[:-1]
                if line[-1] == ',':
                    # get the content
                    content_dic['twitter_content'] = json.loads(line[:-1]).get('json').get('text')
                    if len(json.loads(line[:-1]).get('json').get('entities').get('hashtags')) != 0:
                        content_dic['hashtag_content'] = \
                            json.loads(line[:-1]).get('json').get('entities').get('hashtags')[0].get('text')
                    content_data.append(content_dic)

    # create the own word set from the twitter content to expand NLTK wordset
    word_tokenizer = nltk.tokenize.regexp.WordPunctTokenizer()

    words_set = []
    for twitter in content_data:
        words_set += (word_tokenizer.tokenize(twitter['twitter_content']))
    words_set = list(set(words_set))

    stop_words = stopwords.words('english')
    non_words = list(punctuation)
    lemmatizer = nltk.stem.wordnet.WordNetLemmatizer()

    # only need the alphabetic word
    formatted_twitter_words_set = []
    for word in words_set:
        if (word.isalpha() is not False) and (word not in non_words) and (word not in stop_words):
            formatted_twitter_words_set.append(lemmatizer.lemmatize(word))

    nltk_words_set = list(set(nltk.corpus.words.words()))
    # training whole set
    return formatted_twitter_words_set + nltk_words_set, content_data


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


# ---


def process_content(tweeter_content):
    # only need the alphabetic word
    formatted_twitter_content = []
    tweeter_content = word_tokenizer.tokenize(tweeter_content)
    for word in tweeter_content:
        if (word.isalpha() != False) and (word not in non_words) and (word not in stop_words):
            formatted_twitter_content.append(lemmatizer.lemmatize(word))
    return formatted_twitter_content


def sort_ordered_dict(orderdict):
    return OrderedDict(sorted(orderdict.items(), key=lambda x: x[1], reverse=True))


def print_dt(routine, t_start):
    time_taken = '%s takes %.18f seconds.' % (routine, (timer() - t_start))
    print(time_taken)


def main():
    t_start = timer()
    training_set, content_data = make_training_set()
    # print(training_set)
    print_dt('training_set', t_start)

    # --

    t_start = timer()
    # split the hashtag content now!!
    for twitter in content_data:
        if 'hashtag_content' in twitter.keys():
            twitter['hashtag_content'] = find_match_word(twitter['hashtag_content'].lower(), training_set)
    print_dt('split_hash_tag', t_start)

    # --

    t_start = timer()
    sid = SentimentIntensityAnalyzer()
    positive_tweets = []
    negative_tweets = []
    neutral_tweets = []
    compound_tweets = []

    for twitter in content_data:
        if 'hashtag_content' in twitter.keys():
            temp_content = process_content(twitter['twitter_content'] + ' '.join(twitter['hashtag_content']))
            temp_content = ' '.join(temp_content)
            result = sort_ordered_dict(sid.polarity_scores(temp_content))
            if result.keys()[0] == 'pos':
                positive_tweets.append(temp_content)
            elif result.keys()[0] == 'neg':
                negative_tweets.append(temp_content)
            elif result.keys()[0] == 'neu':
                neutral_tweets.append(temp_content)
            elif result.keys()[0] == 'compound':
                compound_tweets.append(temp_content)
        else:
            temp_content = process_content(twitter['twitter_content'])
            temp_content = ' '.join(temp_content)
            result = sort_ordered_dict(sid.polarity_scores(temp_content))
            if result.keys()[0] == 'pos':
                positive_tweets.append(temp_content)
            elif result.keys()[0] == 'neg':
                negative_tweets.append(temp_content)
            elif result.keys()[0] == 'neu':
                neutral_tweets.append(temp_content)
            elif result.keys()[0] == 'compound':
                compound_tweets.append(temp_content)

    print_dt('sentiment_analysis', t_start)

    print('positive_tweets: ', len(positive_tweets))
    print('negative_tweets: ', len(negative_tweets))
    print('negative_tweets: ', len(neutral_tweets))
    print('negative_tweets: ', len(compound_tweets))


if __name__ == '__main__':
    main()
