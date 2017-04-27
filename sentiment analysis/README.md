Sentiment Analysis

=========

Prepare data: use the Backward MaxMatch algorithm to split the content in hashtags. Save the data into format like following: 
	[{'twitter_content':.........., 'hashtag_content':..........},.....]

Sentiment analysis: use the buildin function to analyse sentence positive or negative(I think it always works for either analysing an area's happiness level or other aspects as long as they are related with 'adjectives') Try: http://text-processing.com/demo/sentiment/  a generated version to test your sentence or word

Subject oriented: use Wu-Palmer algorithm to compare similarities between two words. 

Further development: 
for subject oriented:
1. wu-palmer can compare nouns with nouns and verbs but not adjectives and adverbs. Therefore need another algorithm to compare adjectives and adverbs. Got PMI, SVD, Word2Vec to support this function. Word2Vec works not very well but it is not too bad. PMI or SVD runs slow which needs to combine with the whole system

2. Compare the most common sense of a word either adjectives or nouns with right format of the goal. Currently test it with noun format crime.

3. Large dataset can contribute to more accurate result. Which needs to test on it later on.

4. Hash tags content is quite important. The split algorithm I use, I just test it on smallTwitter.json. It takes quite a while to run. Still needs to improve

5. Got a formula ready to detect the crime probability which is not included in the code(easy part).

6. May need a classification algorithm for further subject oriented topics. Currently what I'm thinking is to process streaming data and analyse which area could have accident or crime happening. After we build the model on the program I write. Then it will be easier to detect the crime when streaming data coming in.


Sentiment analysis further development(maybe): 
	1. Check the happiness status for a certain area
		http://journals.plos.org/plosone/article?id=10.1371/journal.pone.0064417(has a good formula)
	2. Sentiment analysis, more accurate model
		https://github.com/vivekn/sentiment


What I think about the plan is:
	1. get harvest data(if there's exact queries, otherwise proceed)
	2. use the above model to get the training data
		1. sentimental analysis - filter 1
		2. subject oriented -filter 2
		3. get training data
	3. Train the classifier
	4. Use the model to detect streaming data
	5. Classification! Done!
