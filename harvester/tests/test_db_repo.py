import unittest

from harvester.tests.testcases import RepositoryTestCase


class RepositoryDirectTestCase(RepositoryTestCase):
    """
    Examples for direct access to the Database object 
    that holds in the current Repository context.
    """

    def test_revisions(self):
        _id = 'charlie'
        revs = self.repo.database.revisions(_id)
        for r in revs:
            print(r.rev)
        self.assertTrue(True)

    def test_compact(self):
        success = self.repo.database.compact()
        self.assertTrue(success)


if __name__ == '__main__':
    unittest.main()
