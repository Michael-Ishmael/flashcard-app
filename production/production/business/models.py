#from fc_prod_serv.models import MediaFile
from typing import List


class Folder(object):
    def __init__(self, name: str, parent=None):
        self.name = name
        self.parent = parent  # type:Folder
        self.child_folders = []  # type:List[Folder]
        self.files = None  # type:List[File]
        self.expanded = False  # type:bool

    def contains_files(self):  # type:bool
        if self.files is not None and len(self.files) > 0:
            return True

        for folder in self.child_folders:
            if folder.contains_files():
                return True

        return False


class File(object):
    def __init__(self, name: str, path: str, size: int, relative_path: str, width_to_height_ratio:float=1):
        self.name = name
        self.path = path
        self.size = size
        self.relative_path = relative_path
        self.width_to_height_ratio = width_to_height_ratio


class CardCropCollection(object):
    def __init__(self):
        self.name = "crops"
        self.crops = []