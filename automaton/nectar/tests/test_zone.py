import unittest

from automaton.nectar import zones


class ZoneTestCase(unittest.TestCase):
    def test_get_all(self):
        print(zones.get_all())
        self.assertTrue(True)

    def test_get_by_name(self):
        z = zones.get_by_name('melbourne')
        print(z.name)
        self.assertEqual(z.name, 'melbourne')

    def test_get_by_name_list(self):
        z = zones.get_by_name_list(['monash', 'melbourne'])
        print(z)
        self.assertEqual(z[0].name, 'monash')
        self.assertEqual(z[1].name, 'melbourne')


if __name__ == '__main__':
    unittest.main()
