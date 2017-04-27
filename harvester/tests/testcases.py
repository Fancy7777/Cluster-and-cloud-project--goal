import unittest

from harvester import config
from harvester.db import Repository, Connection


class ConnectionTestCase(unittest.TestCase):
    """
    Create Connection specify in config.ini
    """

    def setUp(self):
        self.connection = Connection(config.connection)


class RepositoryTestCase(unittest.TestCase):
    """
    Create Repository for database name 'test'
    """

    def setUp(self):
        self.repo = Repository('test', config.connection)
