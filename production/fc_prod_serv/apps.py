from django.apps import AppConfig
from fc_prod_serv.models import TargetDevice, CardTargetDevice, CroppingInstruction, Config, Card, Crop
from production.business.crop_cruncher import Bounds, CropCruncher
from production.business.fc_util import join_paths

class FcProdServConfig(AppConfig):
    name = 'fc_prod_serv'


class CropManager(object):

    @staticmethod
    def calculate_crop_requirements(card_id):
        """

        :param card_id:Integer:
        :return:[CardTargetDevice]
        """

        card = Card.objects.get(card_id=card_id)
        crop_dict = CropManager.get_crop_dict_for_card(card)

        targets = TargetDevice.objects.all()


        media_folder = Config.objects.get(settingKey="media_folder").settingValue
        original_image_path = join_paths(media_folder, card.original_image.path)
        xcasset_folder = Config.objects.get(settingKey="xcasset_folder").settingValue
        calcs = []

        for target in targets:
            ctd = CropManager.get_ctd_for_target(target, card, crop_dict, original_image_path, xcasset_folder)
            calcs.append(ctd)

        return calcs

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
    def get_ctd_for_target(target, card, crop_dict, original_image_path, xcasset_folder):
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

        combined = CropCruncher.can_be_combined_rect(ls_pcs, pt_pcs, target.width, target.height)

        print(target.name + ' - combined:' + str(combined))

        if combined:
            xcasset_name = card.name.lower().replace("_", "")

            combined_crops = CropCruncher.get_combined_crops(ls_pcs, pt_pcs, target.width, target.height)
            ls_c_crop = combined_crops[0]
            pt_c_crop = combined_crops[1]
            combined_ctd, created = CardTargetDevice.objects.get_or_create(
                card=card,
                target_device=target,
            )
            combined_ctd.ls_xcasset_name = xcasset_name,
            combined_ctd.ls_crop_x = ls_c_crop.x,
            combined_ctd.ls_crop_y = ls_c_crop.y,
            combined_ctd.ls_crop_w = ls_c_crop.w,
            combined_ctd.ls_crop_h = ls_c_crop.h,
            combined_ctd.pt_crop_x = pt_c_crop.x,
            combined_ctd.pt_crop_y = pt_c_crop.y,
            combined_ctd.pt_crop_w = pt_c_crop.w,
            combined_ctd.pt_crop_h = pt_c_crop.h

            if not created:
                related_crop_ins = CroppingInstruction.objects.filter(card_target_device=combined_ctd)
                for c in related_crop_ins:
                    c.delete(keep_parents=True)

            xcasset_path = join_paths(xcasset_folder, xcasset_name + '.imageset',
                                      xcasset_name + "_" + target.name + '.jpg')
            target_bounds = CropCruncher.get_new_rect_bounds(ls_pcs, pt_pcs, target.width, target.height)
            merged_bounds = ls_pcs.get_combined_bounds(pt_pcs)

            combined_ctd.croppinginstruction_set.create(
                original_path=original_image_path,
                target_path=xcasset_path,
                crop_start_x_pc=merged_bounds.x,
                crop_start_y_pc=merged_bounds.y,
                crop_end_x_pc=merged_bounds.x2(),
                crop_end_y_pc=merged_bounds.y2(),
                target_width=target_bounds.w,
                target_height=target_bounds.h
            )
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
                related_crop_ins = CroppingInstruction.objects.filter(card_target_device=ctd)
                for c in related_crop_ins:
                    c.delete(keep_parents=True)

            ls_xcasset_path = join_paths(xcasset_folder, ls_xcasset_name + '.imageset',
                                         ls_xcasset_name + "_" + target.name + '.jpg')
            ctd.croppinginstruction_set.create(
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
            ctd.croppinginstruction_set.create(
                original_path=original_image_path,
                target_path=pt_xcasset_path,
                crop_start_x_pc=pt_pcs.x,
                crop_start_y_pc=pt_pcs.y,
                crop_end_x_pc=pt_pcs.x2(),
                crop_end_y_pc=pt_pcs.y2(),
                target_width=target.width,
                target_height=target.height
            )
            return ctd
