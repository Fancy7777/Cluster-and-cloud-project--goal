import unittest

from harvester.tests.testcases import ConnectionTestCase


class ConnectionDirectTestCase(ConnectionTestCase):
    """
    Examples for direct access to the Server object 
    that holds in the current Connection context.
    
    After connection establish, use 'connection.server.*' 
    for CouchDB API:
        https://pythonhosted.org/CouchDB/client.html#server
    """

    def test_conn_establish(self):
        self.assertTrue(self.connection.server is not None)


if __name__ == '__main__':
    unittest.main()
