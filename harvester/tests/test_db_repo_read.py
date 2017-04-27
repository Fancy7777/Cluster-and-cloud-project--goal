import unittest

from harvester.tests.testcases import RepositoryTestCase


class RepositoryReadTestCase(RepositoryTestCase):
    def test_repo_read(self):
        _id = 'charlie'
        doc = self.repo.read(_id)
        if doc is not None:
            self.assertEqual(doc['holder'], 'Charlie')
            print('id: {},  rev: {}'.format(doc.id, doc.rev))
        else:
            print('Document not found --:   {}'.format(_id))

    def test_repo_read_not_exist(self):
        doc = self.repo.read('zombie')
        self.assertEqual(doc, None)


if __name__ == '__main__':
    unittest.main()
