import os

from production.business.models import Folder, File


class MediaFileWatcher:
    def load_files(self, root_folder_path: str, exts: [str]):  # type:Folder

        if not os.path.exists(root_folder_path):
            return None

        root_folder = None  # type:Folder
        last_folder = None  # type:Folder

        for dir_path, sub_folders, files in os.walk(root_folder_path):
            folder = self.get_folder_from_path(dir_path, last_folder)
            print(dir_path)
            if last_folder is None:
                root_folder = folder
            else:
                last_folder.child_folders.append(folder)
            for file in files:
                if self.is_match(file, exts):
                    mw = self.get_media_file(file, dir_path)
                    if folder.files is None:
                        folder.files = []
                    folder.files.append(mw)
            last_folder = folder

        return self.clone_with_only_found_files(root_folder)

    def clone_with_only_found_files(self, folder:Folder):
        clone = Folder(folder.name, folder.parent)
        for child_folder in folder.child_folders:
            if folder.contains_files():
                child = self.clone_with_only_found_files(child_folder)
                clone.child_folders.append(child)
        return clone



    def is_match(self, file_name: str, exts: [str]):  # type:bool

        for ext in exts:
            if file_name.endswith("." + ext):
                return True
        return False

    def get_folder_from_path(self, path: str, parent: Folder):  # type:Folder
        item_name = os.path.basename(path)
        return Folder(name=item_name, parent=parent)

    def get_media_file(self, file_name: str, dir_path: str):
        file_name_path = os.path.join(dir_path, file_name)

        return File(file_name, file_name_path)
