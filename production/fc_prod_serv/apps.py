import os
from os.path import expanduser
from typing import List

import simplejson as simplejson
from django.apps import AppConfig
from shutil import copyfile

from fc_prod_serv.models import TargetDevice, CardTargetDevice, CroppingInstruction, Config, Card, Crop, \
    CardCropInstruction
from production.business.crop_cruncher import Bounds, CropCruncher
from production.business.fc_util import join_paths
from production.business.models import Folder
from production.business.photoshop_script_runner import PhotoshopScriptRunner


class FcProdServConfig(AppConfig):
    name = 'fc_prod_serv'


class CardTargetDeviceCreationResult:
    def __init__(self):
        self.status = "no status"
        self.crops_exist = False
        self.crops_invalid = False
        self.targets_exist = False


class DeploymentResult:
    def __init__(self):
        self.deployed = False  # type:bool
        self.status = None  # type:str
        self.xcasset_folder = None  # type:Folder


def get_image_file_name_for_card(card:Card, device:TargetDevice, file_extension, orientation_suffix):
    orientation_suffix = "_" + orientation_suffix if len(orientation_suffix) > 0 else orientation_suffix
    xcasset_seed = card.name.lower().replace("_", "") + orientation_suffix
    xcasset_name = xcasset_seed + '.imageset'
    image_file_name = xcasset_name + "_" + device.name + '.' + file_extension

    return image_file_name


class CropManager(object):
    @staticmethod
    def calculate_crop_requirements(card_id):
        """

        :param card_id:Integer:
        :return:([CardTargetDevice], str)
        """

        card = Card.objects.get(card_id=card_id)
        crop_dict = CropManager.get_crop_dict_for_card(card)
        crops_valid = True

        for key in crop_dict:
            obj = crop_dict[key]
            if not obj is None:
                if len(obj) < 2:
                    crops_valid = False
                    break

        if not crops_valid:
            return [], "Crops invalid"

        targets = TargetDevice.objects.all()

        media_folder = Config.objects.get(settingKey="media_folder").settingValue
        original_image_path = join_paths(media_folder, card.original_image.path)
        xcasset_folder = Config.objects.get(settingKey="xcasset_folder").settingValue
        calcs = []

        for target in targets:
            if target.aspect_ratio.name in crop_dict:
                ctd = CropManager.get_ctd_for_target(target, card, crop_dict, original_image_path, xcasset_folder)
                calcs.append(ctd)

        return calcs, ""

    @staticmethod
    def get_crop_dict_for_card(card):
        """

        :param card:Card:
        :return:dict
        """
        crops = Crop.objects.filter(card=card)
        crop_dict = {}
        for crop in crops:
            or_dict = crop_dict.get(crop.aspect_ratio.name)
            if or_dict is None:
                or_dict = {}
                crop_dict[crop.aspect_ratio.name] = or_dict
            or_dict[crop.orientation.name] = crop
        return crop_dict

    @staticmethod
    def get_ctd_for_target(target, card: Card, crop_dict, original_image_path, xcasset_folder):
        """

        :param target:TargetDevice
        :param card:Card
        :param crop_dict:dict
        :param original_image_path:str
        :param xcasset_folder:str
        :return: CardTargetDevice
        """
        or_dict = crop_dict.get(target.aspect_ratio.name)
        ls_crop = or_dict.get('landscape')
        ls_pcs = Bounds(ls_crop.x, ls_crop.y, ls_crop.w, ls_crop.h)
        pt_crop = or_dict.get('portrait')
        pt_pcs = Bounds(pt_crop.x, pt_crop.y, pt_crop.w, pt_crop.h)

        width_to_height_ratio = card.original_image.width_to_height_ratio
        combined = CropCruncher.can_be_combined_rect(ls_pcs, pt_pcs, target.width,
                                                     int(round(target.width * width_to_height_ratio)))

        if combined:
            xcasset_name = card.name.lower().replace("_", "")

            ls_c_crop, pt_c_crop = CropCruncher.get_combined_crops(ls_pcs, pt_pcs)
            combined_ctd, created = CardTargetDevice.objects.get_or_create(
                card=card,
                target_device=target,
            )
            combined_ctd.ls_xcasset_name = xcasset_name
            combined_ctd.ls_crop_x = ls_c_crop.x
            combined_ctd.ls_crop_y = ls_c_crop.y
            combined_ctd.ls_crop_w = ls_c_crop.w
            combined_ctd.ls_crop_h = ls_c_crop.h
            combined_ctd.pt_crop_x = pt_c_crop.x
            combined_ctd.pt_crop_y = pt_c_crop.y
            combined_ctd.pt_crop_w = pt_c_crop.w
            combined_ctd.pt_crop_h = pt_c_crop.h

            if not created:
                combined_ctd.pt_xcasset_name = None
                related_crop_ins = CroppingInstruction.objects.filter(card_target_device=combined_ctd)
                for c in related_crop_ins:
                    c.delete(keep_parents=True)

            xcasset_path = join_paths(xcasset_folder, xcasset_name + '.imageset',
                                      xcasset_name + "_" + target.name + '.jpg')
            merged_bounds = CropCruncher.get_combined_rect_pcs(ls_pcs, pt_pcs)

            combined_ctd.croppingInstructions.create(
                original_path=original_image_path,
                target_path=xcasset_path,
                crop_start_x_pc=merged_bounds.x,
                crop_start_y_pc=merged_bounds.y,
                crop_end_x_pc=merged_bounds.x2(),
                crop_end_y_pc=merged_bounds.y2(),
                target_width=target.width * merged_bounds.w,
                target_height=target.width * card.original_image.width_to_height_ratio * merged_bounds.h,
                orientation_id=0
            )
            combined_ctd.save()
            return combined_ctd
        else:
            ls_xcasset_name = card.name.lower().replace("_", "") + "_ls"
            pt_xcasset_name = card.name.lower().replace("_", "") + "_pt"
            ctd, created = CardTargetDevice.objects.get_or_create(
                card=card,
                target_device=target,
            )
            ctd.ls_xcasset_name = ls_xcasset_name
            ctd.pt_xcasset_name = pt_xcasset_name

            if not created:
                ctd.ls_crop_x = None
                ctd.ls_crop_y = None
                ctd.ls_crop_w = None
                ctd.ls_crop_h = None
                ctd.pt_crop_x = None
                ctd.pt_crop_y = None
                ctd.pt_crop_w = None
                ctd.pt_crop_h = None

                related_crop_ins = CroppingInstruction.objects.filter(card_target_device=ctd)
                for c in related_crop_ins:
                    c.delete(keep_parents=True)

            ls_xcasset_path = join_paths(xcasset_folder, ls_xcasset_name + '.imageset',
                                         ls_xcasset_name + "_" + target.name + '.jpg')
            ctd.croppingInstructions.create(
                original_path=original_image_path,
                target_path=ls_xcasset_path,
                crop_start_x_pc=ls_pcs.x,
                crop_start_y_pc=ls_pcs.y,
                crop_end_x_pc=ls_pcs.x2(),
                crop_end_y_pc=ls_pcs.y2(),
                target_width=target.width,
                target_height=target.height,
                orientation_id=1
            )
            pt_xcasset_path = join_paths(xcasset_folder, pt_xcasset_name + '.imageset',
                                         pt_xcasset_name + "_" + target.name + '.jpg')
            ctd.croppingInstructions.create(
                original_path=original_image_path,
                target_path=pt_xcasset_path,
                crop_start_x_pc=pt_pcs.x,
                crop_start_y_pc=pt_pcs.y,
                crop_end_x_pc=pt_pcs.x2(),
                crop_end_y_pc=pt_pcs.y2(),
                target_width=target.width,
                target_height=target.height,
                orientation_id=2
            )
            ctd.save()
            return ctd


class XCassetItem:
    def __init__(self, file_name, idiom, scale, sub_type):
        self.xcasset_name = None
        self.file_name = file_name
        self.idiom = idiom
        self.scale = scale
        self.sub_type = sub_type

    def to_json_dict(self):
        dict = {
            "filename": self.file_name,
            "idiom": self.idiom,
            "scale": self.scale
        }
        if not self.sub_type is None:
            dict["subtype"] = self.sub_type

        return dict


class XcassetBuilder(object):
    def __init__(self):
        self.xcassets = {}

    def create_xcassets(self, card_id:int) -> bool:
        xcasset_root = Config.objects.get(settingKey="xcasset_folder").settingValue
        targets = CardTargetDevice.objects.filter(card__card_id=card_id)
        items = self.collect_items(targets)
        if len(items) == 0:
            return False
        for item in items:
            self.add_xcasset_image(item)
        return self.dump_files(xcasset_root, card_id)

    def add_xcasset_image(self, xci: XCassetItem):
        item = self.xcassets.get(xci.xcasset_name, None)
        if item is None:
            item = []
            self.xcassets[xci.xcasset_name] = item
        item.append(xci)

    def dump_files(self, xcasset_root, card_id) -> bool:
        dumped = False
        for key in self.xcassets:
            dict_file = {
                "images": [],
                "info": {
                    "version": 1,
                    "author": "xcode"
                }
            }
            for image in self.xcassets[key]:
                dict_file["images"].append(image.to_json_dict())
            path = join_paths(expanduser('~'), xcasset_root, key + ".imageset", "Contents.json")
            if not os.path.exists(os.path.dirname(path)):
                os.makedirs(os.path.dirname(path))
            if os.path.exists(path):
                os.remove(path)
            with open(path, 'w') as json_file:
                simplejson.dump(dict_file, json_file, indent=True)
            db_xcasset_name = key if not "_" in key else key[:3]
            card = Card.objects.get(card_id=card_id)
            image = card.original_image
            image.xcasset = db_xcasset_name
            image.save()
            dumped = True
        return dumped

    def collect_items(self, targets: List[CardTargetDevice]) -> [XCassetItem]:

        items = []
        for target in targets:
            if target.pt_xcasset_name is None or len(target.pt_xcasset_name) == 0:
                xcasset_name = target.ls_xcasset_name
                target_device = target.target_device
                ci = target.croppingInstructions.first()
                image_file_name = target.ls_xcasset_name + "_" + target.target_device.name + ".jpg"  # TODO: Fix this
                xci = XCassetItem(image_file_name, target_device.idiom, target_device.scale, target_device.sub_type)
                xci.xcasset_name = xcasset_name
                items.append(xci)
        return items


class ImageCropper(object):

    def crop_and_create_images(self, card_id:int):

        crops = CardCropInstruction.objects.filter(card__card_id=card_id)
        script_path_setting = Config.objects.filter(settingKey='cropping_script').first()  # type:Config

        for crop in crops:
            nl = self.convert_to_csv_line(crop)
            PhotoshopScriptRunner.as_run(script_path_setting.settingValue, nl)

    def convert_to_csv_line(self, crop_ins:CardCropInstruction):

        home = expanduser('~')
        original_path = join_paths(home, crop_ins.original_path)
        target_path = join_paths(home, crop_ins.target_path)

        return "{},{},{},{},{},{},{},{}".format(original_path, target_path, crop_ins.target_width,
                                                crop_ins.target_height,
                                                crop_ins.crop_start_x_pc, crop_ins.crop_start_y_pc, crop_ins.crop_end_x_pc,
                                                crop_ins.crop_end_y_pc)


class SoundDeployer(object):

    @staticmethod
    def get_paths_for_card_sound(card_id:int):
        try:
            card = Card.objects.get(card_id=card_id)
        except:
            return None, None
        if card is not None:
            sound = card.sound
            if sound is not None:
                media_folder = Config.objects.get(settingKey="media_folder").settingValue
                sound_folder = Config.objects.get(settingKey="sound_folder").settingValue

                sound_src_path = join_paths(expanduser("~"), media_folder, sound.path)
                sound_tgt_path = join_paths(expanduser("~"), sound_folder, sound.name)

                return sound_src_path, sound_tgt_path
            else:
                return None, None

    @staticmethod
    def deploy_sound_for_card(card_id:int):

        sound_src_path, sound_tgt_path = SoundDeployer.get_paths_for_card_sound(card_id)
        result = DeploymentResult()
        if sound_src_path is None:
            result.deployed = False
            result.status = "Source sound for card id {0} not found".format(card_id)
        else:
            copyfile(sound_src_path, sound_tgt_path)
            result.deployed = True
            result.status = "Sound deployed"
        return result

    @staticmethod
    def check_sound_deployed(card_id:int):

        sound_src_path, sound_tgt_path = SoundDeployer.get_paths_for_card_sound(card_id)
        result = DeploymentResult()
        if sound_src_path is None:
            result.deployed = False
            result.status = "Source sound for card id {0} not found".format(card_id)
        else:
            if os.path.exists(sound_tgt_path):
                result.deployed = True
                result.status = "Sound has been deployed"
            else:
                result.deployed = False
                result.status = "Sound not yet deployed"
        return result

