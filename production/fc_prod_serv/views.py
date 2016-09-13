import os
from os.path import expanduser
from typing import Dict

from django.http import Http404
from django.shortcuts import render

# Create your views here.
from rest_framework import serializers, viewsets, filters
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from rest_framework.decorators import permission_classes
from rest_framework_recursive.fields import RecursiveField

from fc_prod_serv.models import MediaFile, MediaFileType, Config, Deck, Set, Card, Crop
from fc_prod_serv.serializers import MediaFileSerializer, ConfigSerializer, SetSerializer, DeckSerializer, \
    FolderSerializer, FileSerializer, CardSerializer, CardDetailSerializer, CropSerializer, CardCropCollectionSerializer
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
    filter_fields = ('deck_id', 'complete')


class CardDetailViewSet(viewsets.ModelViewSet):
    queryset = Card.objects.all()
    serializer_class = CardDetailSerializer
    filter_backends = (filters.DjangoFilterBackend,)
    filter_fields = ('deck_id', 'complete')


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

class SetViewSet(viewsets.ModelViewSet):
    queryset = Set.objects.all()
    serializer_class = SetSerializer

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
        target = join_paths(media_path,"img", file_dict["name"])

        PhotoshopScriptRunner.as_run(script_path_setting.settingValue, source, target, 800, 600)

        if not os.path.exists(target):
            data = {"errorMessage": "File not created, not sure why"}
            response = Response(data, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            return response

        stats = os.stat(target)
        root_path = join_paths(expanduser("~"), media_path_setting.settingValue)
        rel_path = target.replace(root_path, "media")

        return_file = File(name=file_dict["name"], path=file_dict["path"], size=stats.st_size, relative_path=rel_path)
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

class CardCropCollectionView(APIView):
    def __init__(self, **kwargs):
        super().__init__(**kwargs)

    def get_object(self, pk):
        try:
            crop_set = Crop.objects.filter(card__card_id=pk)
            collection = CardCropCollection()
            for crop in crop_set:
                collection.crops.append(crop)
            return collection
        except Crop.DoesNotExist:
            raise Http404

    def get(self, request, pk, *args, **kwargs):

        cardCropCol = self.get_object(pk)
        serializer = CardCropCollectionSerializer(cardCropCol)
        response = Response(serializer.data, status=status.HTTP_200_OK)
        return response


@permission_classes((permissions.AllowAny, ))
class FolderView(APIView):
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.media_file_types = {}  # type:Dict[int, MediaFileType]

    def get(self, request, *args, **kwargs):
        # Process any get params that you may need
        # If you don't need to process get params,
        # you can skip this part
        #get_arg1 = request.GET.get('arg1', None)
        #get_arg2 = request.GET.get('arg2', None)

        # Any URL parameters get passed in **kw
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

        root_folder = self.get_folder_model(root_folder.settingValue, preview_folder_setting.settingValue)
        serializer = FolderSerializer(root_folder)
        response = Response(serializer.data, status=status.HTTP_200_OK)
        return response

    def get_queryset(self):
        return self.get_folder_model()

    def get_folder_model(self, path, preview_path):
        mfw = MediaFileWatcher()
        root_folder_path = join_paths(expanduser('~'), path)
        preview_path = join_paths(expanduser('~'), preview_path)
        root_folder = mfw.load_files(root_folder_path, ["jpg", "png", "gif", "mp3"])
        mfts = MediaFileType.objects.all()
        for mft in mfts:
            self.media_file_types[mft.media_file_type_id] = mft
        self.replace_files(root_folder, root_folder_path, preview_path)
        return root_folder

    def replace_files(self, folder: Folder, root_path: str, preview_path: str):
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
                    mf.media_file_type_id = 3 if file.name.endswith(".mp3") else 1 if file.name.endswith(".jpg") else 2
                if mf.relative_path is None or len(mf.relative_path) == 0:
                    test_path = join_paths(preview_path, file.name)
                    if os.path.exists(test_path):
                        mf.relative_path = test_path.replace(root_path, 'media')
                        stats = os.stat(test_path)
                        mf.size = stats.st_size
                    else:
                        mf.relative_path = "media" + file.path  # .replace(root_path, 'media')
                media_files.append(mf)
            folder.files = media_files
        else:
            folder.expanded = True
        for sub_folder in folder.child_folders:
            self.replace_files(sub_folder, root_path, preview_path)





