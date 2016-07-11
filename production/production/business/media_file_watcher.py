import os
from functools import reduce
from typing import Dict

from production.business.models import Folder, File


class MediaFileWatcher:
    def load_files(self, root_folder_path: str, exts: [str]):  # type:Folder

        if not os.path.exists(root_folder_path):
            return None

        root_folder = None
        start = root_folder_path.rfind(os.sep) + 1
        # start = root_folder_path.rfind(os.sep, 0, start) +1

        folder_lookup = {}  # type:Dict[str, Folder]
        for dir_path, sub_folders, files in os.walk(root_folder_path):
            folder = self.get_folder_from_path(dir_path)
            folder_names = dir_path[start:].split(os.sep)
            folder_lookup[folder_names[-1]] = folder
            if len(folder_names) > 1:
                parent_name = folder_names[-2]
                parent_folder = folder_lookup.get(parent_name, None)
                if parent_folder is not None:
                    parent_folder.child_folders.append(folder)
                    folder.parent = parent_folder
            else:
                root_folder = folder
            for file in files:
                if self.is_match(file, exts):
                    mw = self.get_media_file(file, dir_path)
                    if folder.files is None:
                        folder.files = []
                    folder.files.append(mw)


        return self.clone_with_only_found_files(root_folder)

    def clone_with_only_found_files(self, folder:Folder):
        clone = Folder(folder.name, folder.parent)
        if folder.files is not None:
            clone.files = folder.files
        for child_folder in folder.child_folders:
            if child_folder.contains_files():
                child = self.clone_with_only_found_files(child_folder)
                clone.child_folders.append(child)
        return clone

    def is_match(self, file_name: str, exts: [str]):  # type:bool

        for ext in exts:
            if file_name.endswith("." + ext):
                return True
        return False

    def get_folder_from_path(self, path: str):  # type:Folder
        item_name = os.path.basename(path)
        return Folder(item_name)

    def get_media_file(self, file_name: str, dir_path: str):
        file_name_path = os.path.join(dir_path, file_name)

        return File(file_name, file_name_path)
