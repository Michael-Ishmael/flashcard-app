from django.shortcuts import render

# Create your views here.
from rest_framework import serializers
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from rest_framework.decorators import permission_classes
from rest_framework_recursive.fields import RecursiveField

from fc_prod_serv.models import MediaFile
from production.business.models import Folder

@permission_classes((permissions.AllowAny, ))
class FolderView(APIView):

    def get(self, request, *args, **kw):
        # Process any get params that you may need
        # If you don't need to process get params,
        # you can skip this part
        #get_arg1 = request.GET.get('arg1', None)
        #get_arg2 = request.GET.get('arg2', None)

        # Any URL parameters get passed in **kw
        root_folder = self.get_folder_model()
        serializer = FolderSerializer(root_folder)
        response = Response(serializer.data, status=status.HTTP_200_OK)
        return response

    def get_queryset(self):
        return self.get_folder_model()

    def get_folder_model(self):
        parent = Folder("parent")
        for i in range(1,5):
            child_name = "child{0}".format(str(i))
            child = Folder(child_name, parent)
            parent.child_folders.append(child)
            for j in range(1, 3):
                grand_child_name = "grandChild{0}".format(str(j))
                grand_child = Folder(grand_child_name, child)
                child.child_folders.append(grand_child)
                for k in range (1, 4):
                    file_name = "file{0}".format(str(j * k))
                    grand_child.files = []
                    mf = MediaFile()
                    mf.name = file_name
                    grand_child.files.append(mf)
        return parent


class MediaFileField(serializers.Field):

    def to_representation(self, value):
        return value.name;

    def to_internal_value(self, data):
        mf = MediaFile()
        mf.name = data
        return mf


class FolderSerializer(serializers.Serializer):
    name = serializers.CharField()
    child_folders = serializers.ListField(child=RecursiveField())
    files = serializers.ListField(child=MediaFileField())

    # class Meta:
    #     model = Folder
    #     fields = ('name', 'child_folders')

