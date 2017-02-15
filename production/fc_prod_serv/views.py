import os
from os.path import expanduser
from typing import Dict

from PIL import Image
from django.http import Http404
from django.http import HttpResponse
from django.http import HttpResponseBadRequest
from django.shortcuts import render

# Create your views here.
from rest_framework import serializers, viewsets, filters
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from rest_framework.decorators import permission_classes
from rest_framework_recursive.fields import RecursiveField

from fc_prod_serv.apps import CropManager, CardTargetDeviceCreationResult, DeploymentResult, XcassetBuilder, \
	ImageCropper, SoundDeployer
from fc_prod_serv.models import MediaFile, MediaFileType, Config, Deck, Set, Card, Crop, TargetDevice, AspectRatio, \
	CardTargetDevice, DeckAssignmentStatus
from fc_prod_serv.serializers import MediaFileSerializer, ConfigSerializer, SetSerializer, DeckSerializer, \
	FolderSerializer, FileSerializer, CardSerializer, CardDetailSerializer, CropSerializer, \
	CardCropCollectionSerializer, \
	AspectRatioSerializer, TargetDeviceSerializer, CardTargetDeviceSerializer, CardTargetDeviceCreationResultSerializer, \
	MediaFolderSerializer, DeploymentResultSerializer
from production.business.fc_util import join_paths
from production.business.media_file_watcher import MediaFileWatcher
from production.business.models import Folder, File, CardCropCollection
from production.business.photoshop_script_runner import PhotoshopScriptRunner


class MediaFileViewSet(viewsets.ModelViewSet):
	queryset = MediaFile.objects.all()
	serializer_class = MediaFileSerializer

	def create(self, request, *args, **kwargs):
		serializer = MediaFileSerializer(data=request.data)

		if serializer.is_valid():
			name = serializer.validated_data["name"]
			match = MediaFile.objects.filter(name=name).first()
			if not match is None:
				serializer = MediaFileSerializer(match, request.data)
				if serializer.is_valid():
					serializer.save()
					return Response(serializer.data)
			serializer.save()
			return Response(serializer.data, status=status.HTTP_201_CREATED)
		return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ConfigViewSet(viewsets.ModelViewSet):
	queryset = Config.objects.all()
	serializer_class = ConfigSerializer


class SetViewSet(viewsets.ModelViewSet):
	queryset = Set.objects.all()
	serializer_class = SetSerializer


class CardViewSet(viewsets.ModelViewSet):
	queryset = Card.objects.all()
	serializer_class = CardSerializer
	filter_backends = (filters.DjangoFilterBackend,)
	filter_fields = ('deck_id', 'status')


class CardDetailViewSet(viewsets.ModelViewSet):
	queryset = Card.objects.all()
	serializer_class = CardDetailSerializer
	filter_backends = (filters.DjangoFilterBackend,)
	filter_fields = ('deck_id', 'complete')


class CardTargetDeviceViewSet(viewsets.ModelViewSet):
	queryset = CardTargetDevice.objects.all()
	serializer_class = CardTargetDeviceSerializer
	filter_backends = (filters.DjangoFilterBackend,)
	filter_fields = ('card_id', 'target_device')


class CropViewSet(viewsets.ModelViewSet):
	queryset = Crop.objects.all()
	serializer_class = CropSerializer
	filter_backends = (filters.DjangoFilterBackend,)
	filter_fields = ('card_id', 'aspect_ratio_id')


class DeckViewSet(viewsets.ModelViewSet):
	queryset = Deck.objects.all()
	serializer_class = DeckSerializer
	filter_backends = (filters.DjangoFilterBackend,)
	filter_fields = ('set_id',)


# def list(self, request, *args, **kwargs):
#     queryset = self.filter_queryset(self.get_queryset())
#
#     set_id_filter = request.query_params.get("set_id", "-1")
#     set_id_filter = int(set_id_filter)
#     if set_id_filter > -1:
#         queryset = queryset.filter(set_id = set_id_filter)
#
#     page = self.paginate_queryset(queryset)
#     if page is not None:
#         serializer = self.get_serializer(page, many=True)
#         return self.get_paginated_response(serializer.data)
#
#     serializer = self.get_serializer(queryset, many=True)
#     return Response(serializer.data)


class AspectRatioViewSet(viewsets.ModelViewSet):
	queryset = AspectRatio.objects.all()
	serializer_class = AspectRatioSerializer


class TargetDeviceViewSet(viewsets.ModelViewSet):
	queryset = TargetDevice.objects.all()
	serializer_class = TargetDeviceSerializer

	def get(self, request):
		return Response("test")


class FilePreviewView(APIView):
	def get(self, request, format=None):
		return Response("file")

	def post(self, request, format=None):
		serializer = FileSerializer(data=request.data)
		if not serializer.is_valid():
			return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
		file_dict = serializer.data

		script_path_setting = Config.objects.filter(settingKey='resize_script').first()  # type:Config

		if script_path_setting is None:
			data = {"errorMessage": "No script file setting found"}
			response = Response(data, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
			return response

		media_path_setting = Config.objects.filter(settingKey='media_folder').first()  # type:Config
		if media_path_setting is None:
			data = {"errorMessage": "No media folder setting found"}
			response = Response(data, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
			return response

		media_path = join_paths(expanduser('~'), media_path_setting.settingValue)
		source = join_paths(media_path, file_dict["path"])
		target = join_paths(media_path, "img", file_dict["name"].replace(".jpeg", ".jpg"))

		PhotoshopScriptRunner.as_run(script_path_setting.settingValue, source, target, 800, 600)

		if not os.path.exists(target):
			data = {"errorMessage": "File not created, not sure why"}
			response = Response(data, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
			return response

		stats = os.stat(target)
		img = Image.open(target)
		w, h = img.size
		width_to_height_ratio = round(w / h, 4)
		root_path = join_paths(expanduser("~"), media_path_setting.settingValue)
		rel_path = target.replace(root_path, "media")

		return_file = File(name=file_dict["name"], path=file_dict["path"], size=stats.st_size, relative_path=rel_path,
						   width_to_height_ratio=width_to_height_ratio)
		return_serializer = FileSerializer(return_file)

		return Response(return_serializer.data)


class CardCropsView(APIView):
	def __init__(self, **kwargs):
		super().__init__(**kwargs)

	def get(self, request, *args, **kwargs):
		cardCropCol = CardCropCollection()
		serializer = CardCropCollectionSerializer(cardCropCol)
		response = Response(serializer.data, status=status.HTTP_200_OK)
		return response


class TargetDeviceCreationView(APIView):
	def __init__(self, **kwargs):
		super().__init__(**kwargs)

	def get_object(self, card_id):
		try:
			crops = CropManager.calculate_crop_requirements(card_id)
			collection = CardCropCollection()
			collection.crops = crops
			return collection
		except Crop.DoesNotExist:
			raise Http404

	def post(self, request):
		card_id = request.data.get("cardid", None)
		if card_id is None:
			card_id = request.data.get("card_id", None)
			if card_id is None:
				return HttpResponseBadRequest("Missing cardid parameter")
		result = get_targets_status(card_id)
		if not result.crops_exist:
			result.status = "No crops found for card id: " + str(card_id) + ". Create crops first."
		else:
			verb = "updated" if result.targets_exist else "created"
			targets, message = CropManager.calculate_crop_requirements(card_id)
			result.targets_exist = len(targets) > 0
			if len(message) > 0:
				result.status = message
			else:
				result.status = "{0} targets {1}".format(len(targets), verb)
		serializer = CardTargetDeviceCreationResultSerializer(result)
		response = Response(serializer.data, status=status.HTTP_200_OK)
		return response

	def put(self, request, pk):
		result = get_targets_status(pk)
		if not result.crops_exist:
			result.status = "No crops found for card id: " + str(pk) + ". Create crops first."
		else:
			targets, message = CropManager.calculate_crop_requirements(pk)
			result.targets_exist = len(targets) > 0
			if len(message) > 0:
				result.status = message
			else:
				result.status = str(len(targets)) + " targets updated"
		serializer = CardTargetDeviceCreationResultSerializer(result)
		response = Response(serializer.data, status=status.HTTP_200_OK)
		return response

	def get(self, request, pk, *args, **kwargs):
		result = get_targets_status(pk)
		serializer = CardTargetDeviceCreationResultSerializer(result)
		response = Response(serializer.data, status=status.HTTP_200_OK)
		return response


def get_targets_status(card_id):
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


class ImageDeploymentView(APIView):
	def __init__(self, **kwargs):
		super().__init__(**kwargs)

	def get(self, request, pk):

		result = self.get_deployment_result(pk)
		serializer = DeploymentResultSerializer(result)
		response = Response(serializer.data, status=status.HTTP_200_OK)
		return response

	def post(self, request):
		card_id = request.data.get("cardid", None)
		if card_id is None:
			card_id = request.data.get("card_id", None)
			if card_id is None:
				return HttpResponseBadRequest("Missing cardid parameter")
		result = self.get_deployment_result(card_id)
		if result.deployed:
			result.status = "Already deployed"
		else:
			target_result = get_targets_status(card_id)
			if not target_result.crops_exist:
				result.status = "No crops found for card id: " + str(card_id) + ". Create crops first."
			elif not target_result.targets_exist:
				result.status = "No targets found for card id: " + str(card_id) + ". Create targets first."
			else:
				self.deploy_for_card(card_id)
				result = self.get_deployment_result(card_id)
				if not result.deployed:
					result.status = "Not deployed. Reason unknown"

		serializer = DeploymentResultSerializer(result)
		response = Response(serializer.data, status=status.HTTP_200_OK)
		return response

	def put(self, request, pk):
		card_id = pk
		result = DeploymentResult()
		target_result = get_targets_status(card_id)
		if not target_result.crops_exist:
			result.status = "No crops found for card id: " + str(card_id) + ". Create crops first."
		elif not target_result.targets_exist:
			result.status = "No targets found for card id: " + str(card_id) + ". Create targets first."
		else:
			xcasset_only = request.data.get("xcassetOnly", None)
			self.deploy_for_card(card_id, xcasset_only)
			result = self.get_deployment_result(card_id)
			if not result.deployed:
				result.status = "Not deployed. Reason unknown"

		serializer = DeploymentResultSerializer(result)
		response = Response(serializer.data, status=status.HTTP_200_OK)
		return response

	def get_deployment_result(self, card_id: int) -> DeploymentResult:
		card = Card.objects.get(card_id=card_id)
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

	def deploy_for_card(self, card_id: int, xcasset_only: bool = False):
		if xcasset_only is None:
			xcasset_only = False
		builder = XcassetBuilder()
		cropper = ImageCropper()

		if builder.create_xcassets(card_id) and not xcasset_only:
			cropper.crop_and_create_images(card_id)


class SoundDeploymentView(APIView):
	def get(self, request, pk):
		result = SoundDeployer.check_sound_deployed(pk)
		serializer = DeploymentResultSerializer(result)
		response = Response(serializer.data, status=status.HTTP_200_OK)
		return response

	def post(self, request):
		card_id = request.data.get("cardid", None)
		if card_id is None:
			card_id = request.data.get("card_id", None)
			if card_id is None:
				return HttpResponseBadRequest("Missing cardid parameter")
		result = SoundDeployer.deploy_sound_for_card(card_id)
		serializer = DeploymentResultSerializer(result)
		response = Response(serializer.data, status=status.HTTP_200_OK)
		return response


class FullCardDeploymentView(APIView):
	def get(self, request, pk):
		result = self.get_deployment_result(pk)
		serializer = DeploymentResultSerializer(result)
		response = Response(serializer.data, status=status.HTTP_200_OK)
		return response

	def post(self, request):
		card_id = request.data.get("cardid", None)
		if card_id is None:
			card_id = request.data.get("card_id", None)
			if card_id is None:
				return HttpResponseBadRequest("Missing cardid parameter")
		result = get_targets_status(card_id)
		if not result.crops_exist:
			return HttpResponseBadRequest("No crops found for card id: " + str(card_id) + ". Create crops first.")
		else:
			targets, message = CropManager.calculate_crop_requirements(card_id)
			result.targets_exist = len(targets) > 0
			if len(message) > 0:
				return HttpResponseBadRequest(message)
			else:
				self.deploy_for_card(card_id)
				result = self.get_deployment_result(card_id)
				if not result.deployed:
					return HttpResponse(status=500, message="Not deployed. Reason unknown")
				else:
					SoundDeployer.deploy_sound_for_card(card_id)

		if result.deployed:
			card = Card.objects.get(card_id = card_id)
			card.status = 3
			card.save()

		serializer = DeploymentResultSerializer(result)
		response = Response(serializer.data, status=status.HTTP_200_OK)
		return response

	def deploy_for_card(self, card_id: int, xcasset_only: bool = False) -> DeploymentResult:
		if xcasset_only is None:
			xcasset_only = False
		builder = XcassetBuilder()
		cropper = ImageCropper()

		if builder.create_xcassets(card_id) and not xcasset_only:
			crop_result = cropper.crop_and_create_images(card_id)
			if not crop_result.deployed:
				return crop_result

		result = DeploymentResult()
		result.deployed = True
		return result

	def get_deployment_result(self, card_id: int) -> DeploymentResult:
		card = Card.objects.get(card_id=card_id)
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


@permission_classes((permissions.AllowAny,))
class FolderView(APIView):
	def __init__(self, **kwargs):
		super().__init__(**kwargs)
		self.media_file_types = {}  # type:Dict[int, MediaFileType]

	def get(self, request, *args, **kwargs):

		filter = request.query_params.get("filter", None)
		set_filter = request.query_params.get("setFilter", None)

		root_folder = Config.objects.filter(settingKey='media_folder').first()
		if root_folder is None:
			data = {"errorMessage": "No media folder setting found"}
			response = Response(data, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
			return response

		preview_folder_setting = Config.objects.filter(settingKey='preview_img_folder').first()
		if preview_folder_setting is None:
			data = {"errorMessage": "No preview folder setting found"}
			response = Response(data, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
			return response

		root_folder = self.get_folder_model(root_folder.settingValue, preview_folder_setting.settingValue, filter,
											set_filter)
		serializer = MediaFolderSerializer(root_folder)
		response = Response(serializer.data, status=status.HTTP_200_OK)
		return response

	def get_queryset(self):
		return self.get_folder_model()

	def get_folder_model(self, path, preview_path, filter=None, set_filter=None):
		mfw = MediaFileWatcher()
		root_folder_path = join_paths(expanduser('~'), path)
		preview_path = join_paths(expanduser('~'), preview_path)
		root_folder = mfw.load_files(root_folder_path, ["jpg", "jpeg", "png", "gif", "mp3", "m4a"], filter, set_filter)
		mfts = MediaFileType.objects.all()
		for mft in mfts:
			self.media_file_types[mft.media_file_type_id] = mft
		self.replace_files(root_folder, root_folder_path, preview_path, filter is not None)
		root_folder.expanded = True
		return root_folder

	def replace_files(self, folder: Folder, root_path: str, preview_path: str, expand_all: bool = False):
		if folder.files is not None:
			media_files = []
			for file in folder.files:
				mf = MediaFile.objects.filter(path=file.path).first()
				if mf is None:
					mf = MediaFile()  # type:MediaFile
					mf.name = file.name
					mf.media_file_type = self.media_file_types[1]
					mf.path = file.path
					mf.size = file.size
					if file.name.endswith(".mp3") or file.name.endswith(".m4a"):
						mf.media_file_type_id = 4 if file.is_speech else 3
					else:
						mf.media_file_type_id = 1 if file.name.endswith(".jpg") or file.name.endswith(".jpeg") else 2
				has_rel_path = mf.relative_path is not None and len(mf.relative_path) != 0
				if has_rel_path:
					has_rel_path = os.path.exists(join_paths(root_path, mf.relative_path.replace('media', '')))
					if not has_rel_path:
						mf.relative_path = None
						mf.size = file.size
				if not has_rel_path:
					test_path = join_paths(preview_path, file.name)
					if os.path.exists(test_path):
						mf.relative_path = test_path.replace(root_path, 'media')
						stats = os.stat(test_path)
						mf.size = stats.st_size
					else:
						mf.relative_path = "media" + file.path  # .replace(root_path, 'media')
				media_files.append(mf)
			folder.files = media_files
			folder.expanded = expand_all
		else:
			folder.expanded = expand_all
		for sub_folder in folder.child_folders:
			self.replace_files(sub_folder, root_path, preview_path, expand_all)
