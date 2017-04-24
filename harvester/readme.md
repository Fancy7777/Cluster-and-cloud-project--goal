## How to Harvester [CLI](https://en.wikipedia.org/wiki/Command-line_interface)

* Go to project root i.e. `cd goal`

* Copy `config.ini.sample` to `config.ini` and configure the parameters

* Invoke `harvester.cli` module
```
D:\goal>python -m harvester.cli
Starting tweet stream harvesting. Press Ctrl+C to stop.
id: 856523035381121025  rev: 1-639e50a7e194c0b60dcb4823dc9b0b82
id: 856523043266416640  rev: 1-9eab74db8b29fb6098b37c8e3db84426
id: 856523043018989568  rev: 1-a82fdf7a832ac8d7ab61933797f8d2de
id: 856523047246876672  rev: 1-bcec11ebada4e7570e23c06bb75b1638
id: 856523048307965952  rev: 1-13e4fd3b157ff9b39be7a596e47a48c2
id: 856523049557934081  rev: 1-ae57853735eb3fadcd24b5f95913d1ba
id: 856523050614784000  rev: 1-f16812eef42e5555b907679965656cc7
...
...
id: 856523124833001472  rev: 1-815da3b7f6ac949299385796320d19f9
id: 856523127525752833  rev: 1-06a51e6a39786b1d5cf4abee20142bb6
Stopping...
```
* Open CouchDB Fauxton UI `http://192.168.56.101:5984/_utils/#/_all_dbs` in browser. Enjoy tweets!

* NOTE: avoid invoking the application within a short period interval, again and again. A couple of times is fine though. However, doing so risking black-listing by Twitter. Running it continuous for a day or two is fine though.

## How to DB Module

### Configure

* Go to project root i.e. `cd goal`.

* Copy `config.ini.sample` to `config.ini`.

* At `[couchdb]` section, set up CouchDB connection string.
    * If CouchDB is a Cluster setup then
     ```
     http://cadmin:password@192.168.56.101:5984/
     ```
    * If CouchDB is a Single Node setup then
     ```
     http://localhost:5984/
     ```

### Run Test Cases

* Open CouchDB Fauxton UI `http://localhost:5984/_utils` in browser. After running each test case, try to refresh the Fauxton to observe the changes.

* Check that we can connect.
 ```
 D:\goal>python -m unittest harvester.tests.test_db_conn
.
----------------------------------------------------------------------
Ran 1 test in 0.001s

OK
 ```
 
* Run [DDL](https://en.wikipedia.org/wiki/Data_definition_language) test case to create `test` database.
```
D:\goal>python -m unittest harvester.tests.test_db_conn_ddl
..
----------------------------------------------------------------------
Ran 2 tests in 0.252s

OK
```

* Run store test case to save `charlie` document.
```
D:\goal>python -m unittest harvester.tests.test_db_repo_store
.
----------------------------------------------------------------------
Ran 1 test in 0.021s

OK
```

* Run read test case to read `charlie` document.
```
D:\goal>python -m unittest harvester.tests.test_db_repo_read
id: charlie  rev: 1-66c3100fad942721df0d7a259408c4b1
..
----------------------------------------------------------------------
Ran 2 tests in 0.016s

OK
```

* Run modify test case to update `charlie` document.
```
D:\goal>python -m unittest harvester.tests.test_db_repo_modify
.
----------------------------------------------------------------------
Ran 1 test in 0.267s

OK
```

* Run read test case again to read updated `charlie` document.
```
D:\goal>python -m unittest harvester.tests.test_db_repo_read
id: charlie  rev: 2-98c1630d46532cb0d434cf4882ac9258
..
----------------------------------------------------------------------
Ran 2 tests in 0.016s

OK
```

* Run trash test case to delete `charlie` document.
```
D:\goal>python -m unittest harvester.tests.test_db_repo_trash
..
----------------------------------------------------------------------
Ran 2 tests in 0.213s

OK
```

* Run read test case again to read the deleted `charlie` document.
```
D:\goal>python -m unittest harvester.tests.test_db_repo_read
Document not found --:   charlie
..
----------------------------------------------------------------------
Ran 2 tests in 0.016s

OK
```

* Run store test case to restore `charlie` document.
```
D:\goal>python -m unittest harvester.tests.test_db_repo_store
.
----------------------------------------------------------------------
Ran 1 test in 0.107s

OK
```

* Run read test case to read the restored `charlie` document.
```
D:\goal>python -m unittest harvester.tests.test_db_repo_read
id: charlie,  rev: 4-ed3e8473e859d1b8e989c94f8a30a0f7
..
----------------------------------------------------------------------
Ran 2 tests in 0.016s

OK
```

* Run [DML](https://en.wikipedia.org/wiki/Data_manipulation_language) test case (_direct access on [python-couchdb](https://pythonhosted.org/CouchDB/client.html#database) backend `Database` object_) to print document `charlie` revisions. Additionally run compact to purge all old revisions to save disk space.
```
D:\goal>python -m unittest harvester.tests.test_db_repo
.4-ed3e8473e859d1b8e989c94f8a30a0f7
3-08d54c1201dd46e93b5eadafbc8dbc9c
2-98c1630d46532cb0d434cf4882ac9258
1-66c3100fad942721df0d7a259408c4b1
.
----------------------------------------------------------------------
Ran 2 tests in 0.043s

OK
```

* Run again previous test case to observe the compacted revision i.e. `charlie` now _only_ has latest revision.
```
D:\goal>python -m unittest harvester.tests.test_db_repo
.4-ed3e8473e859d1b8e989c94f8a30a0f7
.
----------------------------------------------------------------------
Ran 2 tests in 0.175s

OK
```

* Finally we can drop the `test` database.
```
D:\goal>python -m unittest harvester.tests.test_db_conn_ddl_drop
.
----------------------------------------------------------------------
Ran 1 test in 0.102s

OK
```

* Note: if you run test cases from PyCharm, make sure to set the run configuration `Working directory` to project content root i.e. `D:\goal`. Not `D:\goal\harvester\tests\`.

---

References:

* https://github.com/victorskl/couchdb-cluster-ansible
* https://github.com/victorskl/tweepy-tute
