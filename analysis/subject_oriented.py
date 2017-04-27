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


##use wu-palmer algorithm to calculate similarity
from nltk.corpus import wordnet as wn
from collections import OrderedDict

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
            if wn.lemma_from_key(check_item.keys()[index]).synset().pos() == 'n' or wn.lemma_from_key(check_item.keys()[index]).synset().pos() == 'v':
                result[word] = wn.lemma_from_key(check_item.keys()[index]).synset()
                continue
            else:
                pass
    return result



from nltk.stem import WordNetLemmatizer
lemmatizer = nltk.stem.wordnet.WordNetLemmatizer()

#use the lemmatizer defined in the previous workshop
def lemmatize(word):
    lemma = lemmatizer.lemmatize(word,'v')
    if lemma == word:
        lemma = lemmatizer.lemmatize(word,'n')
    return lemma


##test a few words and sentence
test_data1 =  ['killer']
test_data2 =  ['murder']
test_data3 =  ['bomb']
test_data4 =  ['accident']
test_data5 =  ['theft']
test_data6 =  ['robbery']
test_data7 =  ['accident','happen','in','melbourne']

def cal_happiness(test_data):
    twitter_synset =[]
    for word in test_data:
    #print word
        synset = store_synset_primarySense(lemmatize(word))
        if (len(synset) >0):
            twitter_synset.append(synset)
    
    wu_palmer_score = 0
    for word in twitter_synset:
        wu_palmer_score += wn.wup_similarity(word.values()[0],store_synset_primarySense('crime').values()[0])
    return float(wu_palmer_score)/float(len(twitter_synset))

print 'similarity between crime and killer: ' + str(cal_happiness(test_data1))
print 'similarity between crime and murder: ' + str(cal_happiness(test_data2))
print 'similarity between crime and bomb: ' + str(cal_happiness(test_data3))
print 'similarity between crime and accident: ' + str(cal_happiness(test_data4))
print 'similarity between crime and theft: ' + str(cal_happiness(test_data5))
print 'similarity between crime and robbery: ' + str(cal_happiness(test_data6))
print 'similarity between crime and sentence(accident happen in melbourne): ' + str(cal_happiness(test_data7))