## How to DB Module

### Configure

* Go to project root i.e. `cd goal`
* Copy `config.ini.sample` to `config.ini`
* At `[couchdb]` section, set up CouchDB connection string
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

