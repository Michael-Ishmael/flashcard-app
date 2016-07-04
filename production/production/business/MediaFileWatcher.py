import os

from fc_prod_serv.models import MediaFile

class MediaFileWatcher:

    def load_files(self, sub_folder, ext, type_id, lst):
        for dirPath, subFolder, files in os.walk(os.path.join(self.media_path, sub_folder)):
            for item in files:
                if item.endswith("." + ext):
                    file_name_path = os.path.join(dirPath, item)
                    sub_path = item
                    item_name = os.path.basename(item)
                    dir_path = os.path.dirname(file_name_path)
                    dir_name = os.path.basename(dir_path)
                    file_sub = dir_name
                    while not dir_name == sub_folder:
                        sub_path = os.path.join(dir_name, sub_path)
                        dir_path = os.path.dirname(dir_path)
                        dir_name = os.path.basename(dir_path)

                        file = MediaFile()
                        file.media_file_type_id = type_id
                        file.name = item_name
                        file.path = file_name_path

                        lst.append(MediaFile(item_name, sub_path, file_name_path, file_sub))