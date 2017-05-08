## How to

- Configure
    - `spark_hosts.ini` mandatory for IP Addresses
    - `spark-env.sh`
    - `slaves`
    - `spark_cluster.yaml` mandatory for vars section 
    
- Invoke playbook script
    ```
    bash play.sh key_file.pem spark_cluster.yaml
    ```

- After successful with playbook installation
    - Perform [password-less SSH setup](https://www.google.com.au/search?q=password-less+SSH+setup) from master to all workers
    - On master node, first generate SSH key if none exist: `ssh-keygen -t rsa`
    - Append master SSH public key found under `/home/ubuntu/.ssh/id_rsa.pub` to all workers nodes's `authorized_keys` found under `/home/ubuntu/.ssh/`. Make sure `.ssh` directory has `chmod 700 .ssh`.
    
- Then [start the cluster by following standalone mode](http://spark.apache.org/docs/latest/spark-standalone.html)
    - On master, `start-master.sh`
    - On each worker, `start-slave.sh spark://spark1:7077`
    - Visit `http://master-ip-address:8080/` for Master Web UI

- Example Spark application and job submission script
    - [retagger.py](../../analysis/retagger.py)
    - [retagger_job.sh](../../analysis/retagger_job.sh)


---
- Experimental files, not require
    - `spark.service`
    - `spark_master.yaml`

