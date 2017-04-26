import platform
import unittest
import colorama
from colorama import Style, Fore, Back

from automaton import provision


class ConnectionTestCase(unittest.TestCase):
    def setUp(self):
        colorama.init()
        if 'Windows' in platform.system():
            print(Fore.CYAN + Style.BRIGHT + 'Script not run on Windows'.upper())
            exit()

    def tearDown(self):
        colorama.deinit()

    def test_ssh_known_hosts(self):
        # ip = '115.146.93.112'
        ip = '115.146.93.209'
        provision.ssh_known_hosts(ip)
        self.assertTrue(True)


if __name__ == '__main__':
    unittest.main(failfast=True)
