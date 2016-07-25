#from fc_prod_serv.models import MediaFile
from typing import List


class Folder(object):
    def __init__(self, name: str, parent=None):
        self.name = name
        self.parent = parent  # type:Folder
        self.child_folders = []  # type:[Folder]
        self.files = None
        self.expanded = False  # type:bool

    def contains_files(self):  # type:bool
        if self.files is not None and len(self.files) > 0:
            return True

        for folder in  self.child_folders:
            if folder.contains_files():
                return True

        return False


class File(object):
    def __init__(self, name: str, path: str, size: int):
        self.name = name
        self.path = path
        self.size = size
