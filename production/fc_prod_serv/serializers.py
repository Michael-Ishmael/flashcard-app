from rest_framework import serializers
from fc_prod_serv.models import MediaFile, MediaFileType, Config, Set, Deck


class MediaFileSerializer(serializers.HyperlinkedModelSerializer):
    media_file_type = serializers.PrimaryKeyRelatedField(many=False, queryset=MediaFileType.objects.all())

    class Meta:
        model = MediaFile
        fields = ('media_file_id', 'media_file_type', 'name', 'path')


class ConfigSerializer(serializers.HyperlinkedModelSerializer):

    class Meta:
        model = Config
        fields = ('settingKey', 'settingValue')


class SetSerializer(serializers.HyperlinkedModelSerializer):

    class Meta:
        model = Set
        fields = ('set_id', 'name', 'icon', 'display_order')


class DeckSerializer(serializers.HyperlinkedModelSerializer):

    class Meta:
        model = Deck
        fields = ('deck_id', 'name', 'set', 'icon', 'display_order')