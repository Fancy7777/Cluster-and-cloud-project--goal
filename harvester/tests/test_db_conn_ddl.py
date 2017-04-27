import unittest

from harvester.tests.testcases import ConnectionTestCase


class ConnectionDDLTestCase(ConnectionTestCase):
    def test_conn_spawn_db(self):
        db_test = self.connection.spawn('test')
        self.assertEqual(db_test.name, 'test')

    def test_conn_drop_not_exist_db(self):
        self.assertFalse(self.connection.drop('banana'))


if __name__ == '__main__':
    unittest.main()
