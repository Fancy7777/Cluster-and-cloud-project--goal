## Automaton

The Automaton package comprises of

* provision module
* nectar package and sub-modules
* ansible playbook recipes

## Provision Module

* Design to provision NeCTAR Cloud Computing to setup cluster cloud compute engines
* Automate configuration cluster using Ansible [playbook recipes](playbooks)

### How to Provision CLI

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

### Sample Screen Output of Provisioning

* https://github.com/victorskl/goal/wiki/Provision-Sample-Outputs

---

Related projects:

* https://github.com/victorskl/nectar-boto-ansible-tute
* https://github.com/victorskl/couchdb-cluster-ansible
