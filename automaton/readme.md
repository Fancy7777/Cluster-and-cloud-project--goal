## Automaton

The Automaton package comprises of

* provision module
* nectar package and sub-modules
* ansible playbook recipes

## Provision Module

* Design to provision NeCTAR Cloud Computing to setup cluster cloud compute engines
* Automate configuration cluster using Ansible [playbook recipes](playbooks)

#### How to Provision CLI

* Go to project root i.e. `cd goal`

* Copy `config.ini.sample` to `config.ini` and configure the parameters

* Invoke `automaton.provision` module
    ```
    python3 -m automaton.provision
    ```

* Note that `provision` module does not run on Windows.
    ```
    D:\goal>python -m automaton.provision
    SCRIPT DOES NOT RUN ON WINDOWS
    ```

* On Windows, use [Bash on Ubuntu on Windows from WSL](https://github.com/victorskl/nectar-boto-ansible-tute#notes-for-ansible-on-windows)

* Read [`requirement.txt`](../requirements.txt) for dependency. Usually you can pip the requirement.
    ```
    pip3 install -r requirements.txt --user
    ```

#### Sample Screen of Provisioning CouchDB Cluster

Note that it should further [configure through Fauxton UI](https://github.com/victorskl/couchdb-cluster-ansible#configure-couchdb-cluster) to complete CouchDB Cluster setup. 

```
victorskl@LOCALHOST:~/cloudcode/project2/goal$ python3 -m automaton.provision
# --------------- CURRENT PROVISION
Reservation r-v0zqbwi6 has 1 instances.
        i-4bf80167 130.56.253.117 NCI running

# --------------- NEW PROVISION
How many instances require? (1-50): 2
Create 2 new instances? (y or n): y
Creating instances....
Creating status: pending
Creating status: pending
Creating status: pending
Creating status: pending
Done.
Reservation r-0eg2d92v has 2 instances.
        i-8444af02 115.146.93.31 melbourne-np running
        i-c0fdded9  melbourne pending

# --------------- AVAILABLE RESOURCES
0:      i-4bf80167      130.56.253.117  running NCI
1:      i-8444af02      115.146.93.31   running melbourne-np
2:      i-c0fdded9      115.146.93.255  running melbourne-np

Pick instances (a or 0 1 3): 1 2
[ check ]  Selected [Instance:i-8444af02, Instance:i-c0fdded9]

# --------------- PREFLIGHT CHECK
Give provision name for server group (couchdbs):
[ check ]  couchdbs
Give name for host file (hosts.ini):
[ check ]  hosts.ini
Writing host file... hosts.ini

# --------------- FIREWALL
Open ports? (y or n): y
0:      sg-0cdb768f     e57f01279e0c4ad8be600ec415cdc432        default Default security group
1:      sg-2b3e8377     e57f01279e0c4ad8be600ec415cdc432        ssh     Port 22

Pick security group (1 or 3): 0
Enter ports to open: 9584 9586
[ check ]  Adding rules to security group default with opening ports [9584, 9586]

# --------------- ANSIBLING
[ check ]  Scanning host :       ssh-keyscan -4 -t rsa 115.146.93.31
# 115.146.93.31 SSH-2.0-OpenSSH_7.2p2 Ubuntu-4ubuntu2.1
[ check ]  Added new known host:  115.146.93.31.
[ check ]  Scanning host :       ssh-keyscan -4 -t rsa 115.146.93.255
# 115.146.93.255 SSH-2.0-OpenSSH_7.2p2 Ubuntu-4ubuntu2.1
[ check ]  Added new known host:  115.146.93.255.
Enter login username (ubuntu):
Enter playbook recipe path (automaton/playbooks/couchdb.yaml):
ansible-playbook -i hosts.ini -u ubuntu -b --become-method=sudo --key-file=/path/to/nectar/key_pair.pem automaton/playbooks/couchdb.yaml --extra-vars "admin=xXx cookie=xXXXxxXXxxX password=XxXxXXxxX"
Execute? (y or n): y
Launching in T minus time
00:00
..................................................

PLAY [couchdbs] ****************************************************************

TASK [setup] *******************************************************************
ok: [115.146.93.31]
ok: [115.146.93.255]

TASK [System Update] ***********************************************************
changed: [115.146.93.31]
changed: [115.146.93.255]

TASK [Check CouchDB Service Exist] *********************************************
ok: [115.146.93.255]
ok: [115.146.93.31]

TASK [Stop CouchDB Service If Exist] *******************************************
skipping: [115.146.93.31]
skipping: [115.146.93.255]

TASK [Setup Build Environment] *************************************************
changed: [115.146.93.255]
changed: [115.146.93.31]

TASK [Download CouchDB] ********************************************************
changed: [115.146.93.31]
changed: [115.146.93.255]

TASK [Unpack CouchDB Source] ***************************************************
changed: [115.146.93.255]
changed: [115.146.93.31]

TASK [Configure Build] *********************************************************
changed: [115.146.93.31]
changed: [115.146.93.255]

TASK [Make Build] **************************************************************
changed: [115.146.93.255]
changed: [115.146.93.31]

TASK [Deploy CouchDB] **********************************************************
changed: [115.146.93.255]
changed: [115.146.93.31]

TASK [Add CouchDB System Account] **********************************************
changed: [115.146.93.255]
changed: [115.146.93.31]

TASK [Change CouchDB Ownership] ************************************************
changed: [115.146.93.255]
changed: [115.146.93.31]

TASK [Change CouchDB Config File Permission] ***********************************
changed: [115.146.93.255]
changed: [115.146.93.31]

TASK [Change CouchDB Directory Permission] *************************************
changed: [115.146.93.255]
changed: [115.146.93.31]

TASK [Change Node Name] ********************************************************
changed: [115.146.93.31]
changed: [115.146.93.255]

TASK [Set Cookie] **************************************************************
changed: [115.146.93.31]
changed: [115.146.93.255]

TASK [Bind Cluster Address to Public] ******************************************
changed: [115.146.93.31] => (item=bind_address = 0.0.0.0)
changed: [115.146.93.255] => (item=bind_address = 0.0.0.0)
changed: [115.146.93.255] => (item=port = 9584)
changed: [115.146.93.31] => (item=port = 9584)

TASK [Bind Node Address to Public] *********************************************
ok: [115.146.93.255] => (item=bind_address = 0.0.0.0)
ok: [115.146.93.31] => (item=bind_address = 0.0.0.0)
changed: [115.146.93.255] => (item=port = 9586)
changed: [115.146.93.31] => (item=port = 9586)

TASK [Add Admin User] **********************************************************
changed: [115.146.93.31]
changed: [115.146.93.255]

TASK [Install CouchDB Service] *************************************************
changed: [115.146.93.255]
changed: [115.146.93.31]

TASK [Enable CouchDB Service] **************************************************
changed: [115.146.93.255]
changed: [115.146.93.31]

TASK [Start CouchDB Service] ***************************************************
changed: [115.146.93.255]
changed: [115.146.93.31]

PLAY RECAP *********************************************************************
115.146.93.255             : ok=21   changed=19   unreachable=0    failed=0
115.146.93.31              : ok=21   changed=19   unreachable=0    failed=0

```

---

Related projects:

* https://github.com/victorskl/nectar-boto-ansible-tute
* https://github.com/victorskl/couchdb-cluster-ansible