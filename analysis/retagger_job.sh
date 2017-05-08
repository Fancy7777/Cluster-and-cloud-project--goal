#!/usr/bin/env bash

#
# Spark job submission script for retagger.py Spark application.
# Tune number of cores, driver memory and executor memory, if any.
#

CORES=6
DR_MEM=2g
EX_MEM=6g

spark-submit \
    --driver-memory $DR_MEM \
    --executor-memory $EX_MEM \
    --total-executor-cores $CORES \
    --master spark://spark1:7077 \
    --jars cloudant-spark-v2.0.0-185.jar \
    retagger.py
