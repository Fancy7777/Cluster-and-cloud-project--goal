#!/bin/bash

[ $# -eq 0 ] && { echo "Usage: $0 key_file.pem spark.yaml"; exit 1; }

ansible-playbook -i spark_hosts.ini -u ubuntu -b --become-method=sudo --key-file=$1 $2