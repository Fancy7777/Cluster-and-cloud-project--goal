##first prepare the running data
import json
#save the content data into format like following
#[{'twitter_content': 'text,text,text,text', 'hashtag_content': '#whatthewaht'},...]
content_data =[]
with open('smallTwitter.json') as data_file:
    for line in data_file:
        content_dic = {}
        if line[0] == '{':
            line = line[:-1]
            if line[-1] == ',':
                #get the content
                content_dic['twitter_content'] =json.loads(line[:-1]).get('json').get('text')
                if len(json.loads(line[:-1]).get('json').get('entities').get('hashtags')) !=0:
                    content_dic['hashtag_content'] = json.loads(line[:-1]).get('json').get('entities').get('hashtags')[0].get('text')
                content_data.append(content_dic)

#create the own word set from the twitter content to expand NLTK wordset
words_set = []
for twitter in content_data:
    for word in twitter['twitter_content'].split(' '):
        words_set.append(word)
words_set = list(set(words_set))
#only need the alphabetic word
formartted_twitter_words_set = []
for word in words_set:
    if word.isalpha() != False:
        formartted_twitter_words_set.append(word.lower())

##split the hashtag content program
import nltk
nltk_words_set = list(set(nltk.corpus.words.words()))
#training whole set
training_set = formartted_twitter_words_set+nltk_words_set

#split the word in hashtags by using the training set
#using backward MaxMatch
def find_match_word(hash_content, wordlist):
    split_words = []
    while len(hash_content) !=0:
        #return the index of the matched word
        word, index = check_match(hash_content,wordlist)
        split_words.append(word)
        #remove the matched words from the original tokens
        hash_content = hash_content[len(hash_content)*(-1):index]
    return split_words

#use WordNetLemmatizer to lemmatize the word
lemmatizer = nltk.stem.wordnet.WordNetLemmatizer()
def check_match(hash_content,wordlist):
    count = 0
    i = 0
    j = len(hash_content)*(-1)
    temp = ''
    while i>=j:
        i -= 1
        #save the temporary word and wait for max match
        if lemmatizer.lemmatize(hash_content[i:]) in wordlist and i!=j:
            temp = hash_content[i:]
            count = i
        #if already rich the max lenght, return current saved temporary word
        elif lemmatizer.lemmatize(hash_content[i:]) in wordlist and i==j:
            temp = hash_content[i:]
            return temp,i
        else:
            #base case: if reach the maximum length and the word is not in wordlist
            #return current temporary word
            if len(temp)>0 and i==j:
                return temp,count
            #return one single letter if theres no match
            elif len(temp) == 0 and i == j:
                return hash_content[i:],-1
            else:
                continue

##split the hashtag contetn
#split the hashtag content now!!
#this takes quite long to run
for twitter in content_data:
    if 'hashtag_content' in twitter.keys():
        twitter['hashtag_content'] = find_match_word(twitter['hashtag_content'].lower(),training_set)


##do the sentiment analysis
#just using the nltk build in library
#check some twitt manually. seems good
from nltk.sentiment.vader import SentimentIntensityAnalyzer
from collections import OrderedDict
sid = SentimentIntensityAnalyzer()

def sort_orderedDict(orderdict):
    return OrderedDict(sorted(orderdict.items(), key = lambda x:x[1], reverse = True))

positive_tweets =[]
negative_tweets =[]
neutral_tweets = []
compound_tweets = []


for twitter in content_data:
    if 'hashtag_content' in twitter.keys():
        temp_content = twitter['twitter_content']+' '.join(twitter['hashtag_content'])
        result = sort_orderedDict(sid.polarity_scores(temp_content))
        if result.keys()[0] == 'pos':
            positive_tweets.append(twitter)
        elif result.keys()[0] == 'neg':
            negative_tweets.append(twitter)
        elif result.keys()[0] == 'neu':
            neutral_tweets.append(twitter)
        elif result.keys()[0] == 'compound':
            compound_tweets.append(twitter)
    else:
        result = sort_orderedDict(sid.polarity_scores(twitter['twitter_content']))
        if result.keys()[0] == 'pos':
            positive_tweets.append(twitter)
        elif result.keys()[0] == 'neg':
            negative_tweets.append(twitter)
        elif result.keys()[0] == 'neu':
            neutral_tweets.append(twitter)
        elif result.keys()[0] == 'compound':
            compound_tweets.append(twitter)

print len(positive_tweets)
print len(negative_tweets)
print len(neutral_tweets)
print len(compound_tweets)
