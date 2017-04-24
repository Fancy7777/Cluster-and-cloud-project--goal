import unittest

from harvester.tests.testcases import RepositoryTestCase


class RepositoryTrashTestCase(RepositoryTestCase):
    def test_repo_trash(self):
        _id = 'charlie'
        self.repo.trash(_id)
        doc = self.repo.read(_id)
        self.assertEqual(doc, None)

    @unittest.skip
    def test_repo_expunge(self):
        doc_ids = ['charlie', '90e8e5f498f089227a1b9646080009e8']
        print(self.repo.expunge(doc_ids))
        self.assertTrue(True)


if __name__ == '__main__':
    unittest.main()
