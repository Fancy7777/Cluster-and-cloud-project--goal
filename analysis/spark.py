import pprint
from pyspark.sql import SparkSession
import nltk
from string import punctuation  
from nltk.corpus import stopwords 

spark = SparkSession\
    .builder\
    .appName("Cloudant Spark SQL Example in Python")\
    .config("cloudant.host","115.146.95.52:9584")\
    .config("cloudant.username", "cadmin")\
    .config("cloudant.password","qwerty8888")\
    .config("cloudant.protocol","http")\
    .getOrCreate()


spark.sql(" CREATE TEMPORARY VIEW tweetTmpView USING com.cloudant.spark OPTIONS ( database 'tweet_raw_trump')")

twt = spark.sql('SELECT * FROM tweetTmpView')
#hashtag = spark.sql('SELECT hashtags FROM tweetTmpView')
#twt.printSchema()

#print 'Total # of rows in tweet_raw: ' + str(twt.count())
content=[]
for tw in twt.collect():
	content_dict ={}
	if (len(tw.entities.hashtags) == 0):
    	content_dict['text'] = tw.text.encode('utf-8')
    else:
    	content_dict['text'] = tw.text.encode('utf-8')
    	content_dict['hashtag'] = tw.entities.hashtags.encode('utf-8')
    content.append(content_dict)


print content[50]['hashtag']
print len(content)
print "hey*****************8"


word_tokenizer = nltk.tokenize.regexp.WordPunctTokenizer()

words_set = []
for twitter in content:
    words_set +=(word_tokenizer.tokenize(twitter))
words_set = list(set(words_set))

stop_words = stopwords.words('english')
non_words = list(punctuation)
lemmatizer = nltk.stem.wordnet.WordNetLemmatizer()

#only need the alphabetic word
formartted_twitter_words_set = []
for word in words_set:
    if (word.isalpha() != False) and (word not in non_words) and (word not in stop_words):
        formartted_twitter_words_set.append(lemmatizer.lemmatize(word))


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

#spit the tag from here
#for twitter in content:
#    twitter['hashtag_content'] = find_match_word(twitter['hashtag_content'].lower(),training_set)






