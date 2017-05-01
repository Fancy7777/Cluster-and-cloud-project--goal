import unittest

from automaton.nectar import firewall


class FirewallTestCase(unittest.TestCase):
    def setUp(self):
        self.sec_grp = 'apache'
        self.sec_desc = 'Our Apache Group'

    # @unittest.skip
    def test_create(self):
        sec_grp = firewall.create_security_group(self.sec_grp, self.sec_desc)
        self.assertEqual(sec_grp.name, 'apache')

    def test_get_security_group(self):
        sec_grp = firewall.get_security_group(self.sec_grp)
        self.assertEqual(sec_grp.name, 'apache')

    @unittest.skip
    def test_open_port(self):
        result = firewall.open_tcp_port(80, self.sec_grp)
        self.assertTrue(result)

    def test_get_firewall_rules(self):
        result = firewall.get_firewall_rules(self.sec_grp)
        print(result)
        self.assertTrue(True)

    # @unittest.skip
    def test_allow(self):
        firewall.allow_tcp_connection_range_from(1, 65535, self.sec_grp, '192.168.56.101/24')

    @unittest.skip
    def test_delete(self):
        result = firewall.delete_security_group('apache')
        self.assertTrue(result)


if __name__ == '__main__':
    unittest.main()
