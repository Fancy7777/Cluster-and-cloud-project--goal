import unittest

from automaton.nectar import volumes


class VolumesTestCase(unittest.TestCase):
    def test_get_all(self):
        vol_list = volumes.get_all()
        print('All volumes: {}'.format(vol_list))
        for vol in vol_list:
            print('id: {}\tsize: {}GB\tzone: {}\tstatus: {}'
                  .format(vol.id, vol.size, vol.zone, vol.status))
        self.assertTrue(True)

    @unittest.skip
    def test_create_volume(self):
        vol = volumes.create_volume(5)
        self.assertTrue(vol.size, 5)

    @unittest.skip
    def test_delete_volume(self):
        vol = volumes.get_all()[0]
        success = volumes.delete_volume(vol.id)
        self.assertTrue(success, True)


if __name__ == '__main__':
    unittest.main()
