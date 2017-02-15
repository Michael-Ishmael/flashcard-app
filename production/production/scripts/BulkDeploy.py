import os
import sys
from os.path import expanduser

import django
from PIL import Image

from production.business.fc_util import join_paths
from production.business.media_file_watcher import MediaFileWatcher
from production.business.models import Folder
from production.business.photoshop_script_runner import PhotoshopScriptRunner

class bcolors:
    HEADER = '\033[95m'
    OKBLUE = '\033[94m'
    OKGREEN = '\033[92m'
    WARNING = '\033[93m'
    FAIL = '\033[91m'
    ENDC = '\033[0m'
    BOLD = '\033[1m'
    UNDERLINE = '\033[4m'


def bulk_image_deploy():

	os.environ.setdefault("DJANGO_SETTINGS_MODULE", "production.settings")
	django.setup()

	from fc_prod_serv.models import Card, Config, Crop, CardTargetDevice
	from fc_prod_serv.apps import SoundDeployer, CropManager

	dep_cards = Card.objects.filter(status=2)
	i = 0
	total = dep_cards.count()
	for card in dep_cards:

		result = get_deployment_result(card)
		if result.deployed:
			result.status = "Already deployed"
			print("{}Card {} already deployed.{}".format(bcolors.OKBLUE, card.name, bcolors.ENDC))
			card.status = 3
			card.save()
			continue
		else:
			target_result = get_targets_status(card.card_id)
			if not target_result.crops_exist:
				result.status = "No crops found for card id: " + str(card.card_id) + ". Create crops first."
			else:
				targets, message = CropManager.calculate_crop_requirements(card.card_id)
				result.targets_exist = len(targets) > 0
				if len(message) > 0:
					result.status = "Could not create targets found for card id: " + str(card.card_id) + ". Create targets first."
				else:
					result = deploy_for_card(card.card_id)
					if result.deployed:
						result = get_deployment_result(card) #Double checks files exist
					else:
						SoundDeployer.deploy_sound_for_card(card.card_id)
		i += 1
		if result.deployed:
			card.status = 3
			card.save()

			print("{} of {}. {}Card {} deployed{}".format(i, total, bcolors.OKGREEN, card.name, bcolors.ENDC))
		else:
			print("{} of {}. {}Card {} not deployed. {}{}".format(i, total, bcolors.FAIL, card.name, result.status, bcolors.ENDC))

def deploy_for_card(card_id: int):
	from fc_prod_serv.apps import DeploymentResult, CardTargetDeviceCreationResult, XcassetBuilder, ImageCropper

	builder = XcassetBuilder()
	cropper = ImageCropper()


	if builder.create_xcassets(card_id):
		crop_result = cropper.crop_and_create_images(card_id)
		if not crop_result.deployed:
			return crop_result
	else:
		result = DeploymentResult()
		result.deployed = False
		result.status = "Could not create xcassets"
		return result

	result = DeploymentResult()
	result.deployed = True
	return result

def get_targets_status(card_id):
	from fc_prod_serv.models import Card, Config, Crop, CardTargetDevice
	from fc_prod_serv.apps import DeploymentResult, CardTargetDeviceCreationResult, XcassetBuilder, ImageCropper

	result = CardTargetDeviceCreationResult()
	crops = Crop.objects.filter(card__card_id=card_id)
	if not crops.count() > 0:
		result.status = "no crops found"
		result.crops_exist = False
		result.targets_exist = False
	else:
		targets = CardTargetDevice.objects.filter(card__card_id=card_id)
		if not targets.count() > 0:
			result.status = "no targets found"
			result.crops_exist = True
			result.targets_exist = False
		else:
			result.status = str(targets.count()) + " targets found"
			result.crops_exist = True
			result.targets_exist = True
	return result


def get_deployment_result(card):

	from fc_prod_serv.models import Card, Config, Crop, CardTargetDevice
	from fc_prod_serv.apps import DeploymentResult, CardTargetDeviceCreationResult, XcassetBuilder, ImageCropper

	path = Config.objects.get(settingKey='xcasset_folder').settingValue
	mfw = MediaFileWatcher()
	root_folder_path = join_paths(expanduser('~'), path)
	root_folder = mfw.load_files(root_folder_path, ["jpg", "png", "json"])
	xcasset_name = card.name.lower().replace("_", "")
	new_root = Folder("xcassets")
	for child_folder in root_folder.child_folders:
		if child_folder.name.startswith(xcasset_name):
			new_root.child_folders.append(child_folder)
			for file in child_folder.files:
				file.path = join_paths(root_folder_path, file.path)

	result = DeploymentResult()
	result.deployed = len(new_root.child_folders) > 0 and any(
		f.name.endswith("jpg") or f.name.endswith("png") for f in new_root.child_folders[0].files)
	if result.deployed:
		message = "All combined" if len(new_root.child_folders) == 1 else "Split xcassets" if len(
			new_root.child_folders) == 2 \
			else "Both split and combined xcassets" if len(
			new_root.child_folders) == 3 else "Warning: too many folders"
	else:
		message = "Not deployed"
	result.status = message
	result.xcasset_folder = new_root

	return result


bulk_image_deploy()