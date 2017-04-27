import unittest

from automaton.nectar import connection, config


class ConnectionTestCase(unittest.TestCase):
    def setUp(self):
        self.conn = connection.establish()

    def test_conn(self):
        print(self.conn)
        self.assertTrue(self.conn is not None)

    def test_region(self):
        print(self.conn.region.name)
        self.assertEqual(self.conn.region.name, config.region)


if __name__ == '__main__':
    unittest.main()
