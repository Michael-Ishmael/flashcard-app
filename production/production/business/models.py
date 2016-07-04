from fc_prod_serv.models import MediaFile


class Folder():
    def __init__(self, name: str, parent=None):
        self.name = name
        self.parent = parent  # type:Folder
        self.child_folders = []  # type:[Folder]
        self.files = None  # type:MediaFile
