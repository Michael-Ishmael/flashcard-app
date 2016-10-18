import os
import django
import unittest
from os.path import expanduser
from production.business.fc_util import join_paths
from PIL import Image

from production.business.crop_cruncher import Bounds, CropCruncher
from production.business.media_file_watcher import MediaFileWatcher


class MediaFileWatcherTest(unittest.TestCase):
    def can_load_folder_structure_test(self):
        mfw = MediaFileWatcher()
        root_folder_path = os.path.join(expanduser('~'), 'Dev/Projects/flashcard-app/media')
        root_folder = mfw.load_files(root_folder_path, ["jpg", "png"])

        self.assertTrue(not root_folder is None)

class DeckThumbXcassetTest(unittest.TestCase):
    def setUp(self):
        os.environ.setdefault("DJANGO_SETTINGS_MODULE", "production.settings")
        django.setup()

    def can_build_deck_xcasset_test(self):
        from fc_prod_serv.models import Deck
        from fc_prod_serv.apps import XcassetBuilder

        decks = Deck.objects.all()

        for deck in decks:
            builder = XcassetBuilder()
            builder.create_deck_xcasset(deck.deck_id)


class CropCruncherTest(unittest.TestCase):
    def setUp(self):
        os.environ.setdefault("DJANGO_SETTINGS_MODULE", "production.settings")
        django.setup()

    def can_get_crop_list_test(self):
        from fc_prod_serv.models import CardCropInstruction

        crops = CardCropInstruction.objects.filter(card__card_id=1)

        self.assertTrue(crops.count() > 0)

    def calculate_width_to_height_ratios_test(self):
        from fc_prod_serv.models import MediaFile, MediaFileType
        file_type = MediaFileType.objects.filter(media_file_type_id=1)

        media_files = MediaFile.objects.filter(media_file_type_id=1).filter(name__contains="jpg")
        root_path = "/Users/scorpio/Dev/Projects/flashcard-app/media/"
        for media_file in media_files:
            if media_file.relative_path is not None:
                test_path = join_paths(root_path, media_file.relative_path)
                if os.path.exists(test_path):
                    img = Image.open(test_path)
                    w, h = img.size
                    media_file.width_to_height_ratio = round(w / h, 4)
                    media_file.save()

        self.assertTrue(1 > 0)


    def xcasset_builder_test(self):
        from fc_prod_serv.apps import XcassetBuilder

        builder = XcassetBuilder()
        builder.create_xcassets(1)

        self.assertTrue(1 > 0)

    def image_cropper_test(self):
        from fc_prod_serv.apps import ImageCropper

        cropper = ImageCropper()
        cropper.crop_and_create_images(1)

        self.assertTrue(1 > 0)

    def can_split_it_test(self):

        from fc_prod_serv.models import TargetDevice, CardTargetDevice, CroppingInstruction, Config, Card, Crop

        card = Card.objects.get(card_id=4)

        crops = Crop.objects.filter(card__card_id=4)

        crop_dict = {}
        for crop in crops:
            or_dict = crop_dict.get(crop.aspect_ratio.name)
            if or_dict is None:
                or_dict = {}
                crop_dict[crop.aspect_ratio.name] = or_dict
            or_dict[crop.orientation.name] = crop

        targets = TargetDevice.objects.all()

        xcasset_folder = Config.objects.get(settingKey="xcasset_folder").settingValue
        media_folder = Config.objects.get(settingKey="media_folder").settingValue

        original_image_path = join_paths(media_folder, card.original_image.path)

        for target in targets:
            or_dict = crop_dict.get(target.aspect_ratio.name)
            ls_crop = or_dict.get('landscape')
            ls_pcs = Bounds(ls_crop.x, ls_crop.y, ls_crop.w, ls_crop.h)
            pt_crop = or_dict.get('portrait')
            pt_pcs = Bounds(pt_crop.x, pt_crop.y, pt_crop.w, pt_crop.h)

            combined = CropCruncher.can_be_combined_rect(ls_pcs, pt_pcs, target.width, target.height)

            print(target.name + ' - combined:' + str(combined))

            if combined:
                xcasset_name = card.name.lower().replace("_", "")

                combined_crops = CropCruncher.get_combined_crops(ls_pcs, pt_pcs, target.width, target.height)
                ls_c_crop = combined_crops[0]
                pt_c_crop = combined_crops[1]
                obj = CardTargetDevice.objects.create(
                    card=card,
                    target_device=target,
                    ls_xcasset_name=xcasset_name,
                    ls_crop_x=ls_c_crop.x,
                    ls_crop_y=ls_c_crop.y,
                    ls_crop_w=ls_c_crop.w,
                    ls_crop_h=ls_c_crop.h,
                    pt_crop_x=pt_c_crop.x,
                    pt_crop_y=pt_c_crop.y,
                    pt_crop_w=pt_c_crop.w,
                    pt_crop_h=pt_c_crop.h
                )
                xcasset_path = join_paths(xcasset_folder, xcasset_name + '.imageset',
                                          xcasset_name + "_" + target.name + '.jpg')
                target_bounds = CropCruncher.get_new_rect_bounds(ls_pcs, pt_pcs, target.width, target.height)
                merged_bounds = ls_pcs.get_combined_bounds(pt_pcs)
                crop_ins = obj.croppinginstruction_set.create(
                    original_path=original_image_path,
                    target_path=xcasset_path,
                    crop_start_x_pc=merged_bounds.x,
                    crop_start_y_pc=merged_bounds.y,
                    crop_end_x_pc=merged_bounds.x2(),
                    crop_end_y_pc=merged_bounds.y2(),
                    target_width=target_bounds.w,
                    target_height=target_bounds.h
                )
                obj.save()
            else:
                ls_xcasset_name = card.name.lower().replace("_", "") + "_ls"
                pt_xcasset_name = card.name.lower().replace("_", "") + "_pt"
                ctd = CardTargetDevice.objects.create(
                    card=card,
                    target_device=target,
                    ls_xcasset_name=ls_xcasset_name,
                    pt_xcasset_name=pt_xcasset_name
                )
                ls_xcasset_path = join_paths(xcasset_folder, ls_xcasset_name + '.imageset',
                                             ls_xcasset_name + "_" + target.name + '.jpg')
                ls_crop_ins = ctd.croppinginstruction_set.create(
                    original_path=original_image_path,
                    target_path=ls_xcasset_path,
                    crop_start_x_pc=ls_pcs.x,
                    crop_start_y_pc=ls_pcs.y,
                    crop_end_x_pc=ls_pcs.x2(),
                    crop_end_y_pc=ls_pcs.y2(),
                    target_width=target.width,
                    target_height=target.height
                )
                pt_xcasset_path = join_paths(xcasset_folder, pt_xcasset_name + '.imageset',
                                             pt_xcasset_name + "_" + target.name + '.jpg')
                pt_crop_ins = ctd.croppinginstruction_set.create(
                    original_path=original_image_path,
                    target_path=pt_xcasset_path,
                    crop_start_x_pc=pt_pcs.x,
                    crop_start_y_pc=pt_pcs.y,
                    crop_end_x_pc=pt_pcs.x2(),
                    crop_end_y_pc=pt_pcs.y2(),
                    target_width=target.width,
                    target_height=target.height
                )
        self.assertTrue(True)
