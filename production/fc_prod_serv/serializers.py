from django.db.models import Q
from rest_framework import serializers
from rest_framework_recursive.fields import RecursiveField

from fc_prod_serv.models import MediaFile, MediaFileType, Config, Set, Deck, Card
from production.business.models import Folder, File


class MediaFileSerializer(serializers.HyperlinkedModelSerializer):
    media_file_type = serializers.PrimaryKeyRelatedField(many=False, queryset=MediaFileType.objects.all())
    relativePath = serializers.CharField(source="relative_path")

    class Meta:
        model = MediaFile
        fields = ('media_file_id', 'media_file_type', 'name', 'path', 'relativePath', 'size')


class ConfigSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Config
        fields = ('settingKey', 'settingValue')


class SetSerializer(serializers.HyperlinkedModelSerializer):
    icon = serializers.SlugRelatedField(many=False, queryset=MediaFile.objects.filter(media_file_type=2),
                                        slug_field="relative_path")

    class Meta:
        model = Set
        fields = ('set_id', 'name', 'icon', 'display_order')


class DeckSerializer(serializers.HyperlinkedModelSerializer):
    set_id = serializers.PrimaryKeyRelatedField(many=False, queryset=Set.objects.all(), source='set')
    default_media_file = MediaFile.objects.get(media_file_id=1)
    icon = serializers.SlugRelatedField(many=False, queryset=MediaFile.objects.filter(media_file_type=2),
                                        slug_field="relative_path")

    class Meta:
        model = Deck
        fields = ('deck_id', 'name', 'set_id', 'icon', 'display_order')


class CardSerializer(serializers.HyperlinkedModelSerializer):
    deck_id = serializers.PrimaryKeyRelatedField(many=False, queryset=Deck.objects.all(), source='deck')
    image = serializers.SlugRelatedField(many=False, source="original_image",
                                         queryset=MediaFile.objects.filter(media_file_type=1),
                                         slug_field="relative_path")

    class Meta:
        model = Card
        fields = ('card_id', 'name', 'deck_id', 'display_order', 'sound', 'image')

class MediaFileField(serializers.Field):

    def to_representation(self, value:MediaFile):
        return {"id" : value.media_file_id, "name" : value.name, "path" : value.path, "size": value.size, 'relativePath': value.relative_path}

    def to_internal_value(self, data):
        mf = MediaFile()
        mf.name = data
        return mf


class FolderSerializer(serializers.Serializer):
    name = serializers.CharField()
    childFolders = serializers.ListField(source="child_folders", child=RecursiveField())
    files = serializers.ListField(child=MediaFileField())
    expanded = serializers.BooleanField()

    class Meta:
        model = Folder
        depth = 2


class FileSerializer(serializers.Serializer):
    name = serializers.CharField()
    path = serializers.CharField()
    size = serializers.IntegerField(required=False)
    relativePath = serializers.CharField(required=False, source="relative_path")

    class Meta:
        model = File

