""" Module db: a database API for CouchDB
 Using Facet design pattern but it still exposes 
 the respective backing object for direct access.
 Check the tests/test_db_* unit test cases for usage.
 
 Function verbs are closely tuned for Document concept.
 e.g. store document, modify document, trash document, so on..
"""

import logging

from couchdb import ResourceConflict, PreconditionFailed, ResourceNotFound
from couchdb import Server
from couchdb import Unauthorized

__all__ = ['Connection', 'Repository']


class Connection(object):
    """
    Facet for CouchDB client module Server object. 
        https://pythonhosted.org/CouchDB/client.html#server
    
    Most DDL operations required Database Admin or Server Admin
    privilege. And these operations can be also done directly on
    CouchDB Fauxton UI or through curl API calls. So minimal DDL
    implementation is required here. 
    """

    def __init__(self, conn):
        self.conn = conn
        self.server = None
        self.establish()

    def establish(self):
        try:
            self.server = Server(url=self.conn)
        except Unauthorized:
            msg = 'Unauthorized error. Check connection string: {}'.format(self.conn)
            logging.error(msg)
        except ConnectionRefusedError:
            msg = 'Can not connect to {}'.format(self.conn)
            logging.error(msg)

    def spawn(self, name):
        try:
            new_db = self.server.create(name)
            if new_db is not None:
                msg = '[SPAWN DB] spawning new database --:  {}'.format(name)
                logging.info(msg)
            return new_db
        except PreconditionFailed:
            msg = '[SPAWN DB] Existing database --:  {}'.format(name)
            logging.warning(msg)
            return self.server[name]
        except Unauthorized:
            msg = 'Unauthorized error. You are not a server admin: {}'.format(self.conn)
            logging.error(msg)

    def drop(self, name):
        try:
            self.server.delete(name)
            msg = '[DROP DB] --: {}'.format(name)
            logging.warning(msg)
            return True
        except ResourceNotFound:
            msg = '[DROP DB] Database does not exist --: {}'.format(name)
            logging.warning(msg)
            return False
        except Unauthorized:
            msg = 'Unauthorized error. You are not a server admin: {}'.format(self.conn)
            logging.error(msg)
            return False


class Repository(object):
    """
    Facet for CouchDB client module Database object. 
        https://pythonhosted.org/CouchDB/client.html#database
    
    Object Composition: Repository has a Connection.
    """

    def __init__(self, name, conn):
        self.name = name
        self.connection = Connection(conn)
        try:
            self.database = self.connection.server[self.name]
        except ResourceNotFound:
            msg = 'Database is not existed. Creating one --:  {}'.format(self.name)
            logging.info(msg)
            self.database = self.connection.spawn(self.name)

    def store(self, doc):
        try:
            if '_id' not in doc:
                msg = 'No document _id supply.'
                logging.warning(msg)
            return self.database.save(doc)
        except ResourceConflict:
            msg = 'ResourceConflict: Document update conflict {}'.format(doc)
            logging.warning(msg)
            if '_id' in doc and self.read(doc['_id']) is not None:
                d = self.read(doc['_id'])
                return d.id, d.rev
            else:
                return None, None

    def modify(self, doc):
        if '_id' not in doc:
            msg = 'No document _id supply. {}'.format(doc)
            logging.error(msg)
            return None, None
        old_doc = self.read(doc['_id'])
        if old_doc is None:
            logging.warning('ResourceNotFound: {}'.format(doc['_id']))
            return None, None
        doc['_rev'] = old_doc.rev
        return self.store(doc)

    def read(self, doc_id):
        return self.database.get(doc_id)

    def trash(self, doc_id):
        doc = self.read(doc_id)
        try:
            if doc is not None:
                self.database.delete(doc)
        except ResourceConflict:
            msg = 'ResourceConflict: Document update conflict {}'.format(doc)
            logging.warning(msg)

    def expunge(self, doc_ids):
        """
        This is not support for now for CouchDB 2.0
        :param doc_ids: 
        :return: 
        """
        docs = []
        for _id in doc_ids:
            doc = self.read(_id)
            if doc is not None:
                docs.append(doc)
        return self.database.purge(docs)
