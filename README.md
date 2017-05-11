# About
GOAL is an implementation of yet another distributed Big Data analytics system, leveraging Australian National eResearch Collaboration Tools and Resources [NeCTAR Cloud Platform](https://nectar.org.au/). However, it is not limited to NeCTAR. In fact it can easily adapt to any OpenStack based Cloud Platform or AWS with minimal effort. 

GOAL Project is done by **Team 1** of Cluster and Cloud Computing COMP90024_2017_SM1, The University of Melbourne. The meaning of GOAL discussed at team [kick off meeting](https://github.com/victorskl/goal/issues/5).

## Quick Overview
![goal_software_components.jpg](https://www.dropbox.com/s/kpibc8zyiomspcp/goal_software_components.jpg?raw=1)
**Figure 1**

The GOAL application itself comprises of 3 key software components. They are
1. Harvester - programs to ingest tweets from Twitter to internal database
2. Analytics - programs to study the analysis cases and topics, mainly Natural Language Processing
3. Visualization - web application to visualize the the analytic cases

The Figure 1 shows the overview of how GOAL software component interact each other and the data flow. It starts by [1 to many] harvester instances ingesting streaming tweets as well as targeted-topics-search tweets into internal CouchDB. Harvesters also tag tweets if a topic is defined for an analytic case. Harvested tweets are consumed by both analytic programs and web application instances. These are all individual Python programs and modules - leveraging both Python2 and Python3 and, its related software packages and libraries - deploy and run independent of each others in a sense of distributed way.

![goal_infra.jpg](https://www.dropbox.com/s/wqun9gr59z6zpac/goal_infra.jpg?raw=1)
**Figure 2**

Another design goal is the GOAL application and its backbone infrastructure are able to deploy up to any N-numbers of instances, i.e. dynamically scale out to cope with scalability requirement for most demanding analytic cases. It has design in mind such that leveraging CouchDB Cluster as well as Spark Cluster to power house the demanding Natural Language Process pipelines and MapReduce jobs. This process of setting up of infrastructure has to be quick, idempotent and automated way. It is targeted towards Cloud Computing and Cloud Platforms. Figure 2 depict the experimental setup on NeCTAR Cloud Platform for 4 medium size VM instances and 4 small size VM instances during [GOAL 2017 SM1 Sprint](https://github.com/victorskl/goal/projects/1). 

## Demo
GOAL system demo video recorded during [GOAL 2017 SM1 Sprint](https://github.com/victorskl/goal/projects/1).

https://www.youtube.com/watch?v=WUNTp3diXdw

# Trying It
Trying GOAL requires Cloud Resouces. If you have these resoureces in hand, you can checkout/clone the GOAL code and start with [Automaton](./automaton). Each software package contains README on how to get started. Then you can [read Wiki](https://github.com/victorskl/goal/wiki) for how to get involved with the project further or need helps.
