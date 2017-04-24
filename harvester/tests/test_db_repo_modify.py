import unittest

from harvester.tests.testcases import RepositoryTestCase


class RepositoryModifyTestCase(RepositoryTestCase):
    def test_repo_modify(self):
        doc = {'_id': 'charlie', 'type': 'account', 'holder': 'Charlie', 'balance': 200}
        doc_id, doc_rev = self.repo.modify(doc)
        if doc_id is not None:
            new_doc = self.repo.read(doc_id)
            self.assertEqual(new_doc['balance'], 200)


if __name__ == '__main__':
    unittest.main()
