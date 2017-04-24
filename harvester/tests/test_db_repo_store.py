import unittest

from harvester.tests.testcases import RepositoryTestCase


class RepositoryStoreTestCase(RepositoryTestCase):
    def test_repo_store(self):
        doc = {'_id': 'charlie', 'type': 'account', 'holder': 'Charlie', 'balance': 100}
        doc_id, doc_rev = self.repo.store(doc)
        self.assertEqual(doc_id, 'charlie')


if __name__ == '__main__':
    unittest.main()
