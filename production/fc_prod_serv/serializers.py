from django.db.models import Q
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
    icon = serializers.PrimaryKeyRelatedField(many=False, queryset=MediaFile.objects.filter(media_file_type=2))

    class Meta:
        model = Set
        fields = ('set_id', 'name', 'icon', 'display_order')


class DeckSerializer(serializers.HyperlinkedModelSerializer):
    set_id = serializers.PrimaryKeyRelatedField(many=False, queryset=Set.objects.all(), source='set')
    default_media_file = MediaFile.objects.get(media_file_id=1)
    icon = serializers.PrimaryKeyRelatedField(many=False, allow_null=True, default=default_media_file, queryset=MediaFile.objects.filter(
        Q(media_file_type=2) | Q(media_file_id=1)))

    class Meta:
        model = Deck
        fields = ('deck_id', 'name', 'set_id', 'icon', 'display_order')
