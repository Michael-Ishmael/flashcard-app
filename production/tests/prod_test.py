import os
import unittest
from os.path import expanduser
from production.business.media_file_watcher import MediaFileWatcher


class MediaFileWatcherTest(unittest.TestCase):

    def can_load_folder_structure_test(self):
        mfw = MediaFileWatcher()
        root_folder_path = os.path.join(expanduser('~'), 'Dev/Projects/flashcard-app/media')
        root_folder = mfw.load_files(root_folder_path, ["jpg", "png"])

        self.assertTrue(not root_folder is None)