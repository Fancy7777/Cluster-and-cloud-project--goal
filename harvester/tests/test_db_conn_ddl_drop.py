import unittest

from harvester.tests.testcases import ConnectionTestCase


class ConnectionDDLTestCase(ConnectionTestCase):
    def test_conn_drop_db(self):
        self.assertTrue(self.connection.drop('test'))


if __name__ == '__main__':
    unittest.main()
