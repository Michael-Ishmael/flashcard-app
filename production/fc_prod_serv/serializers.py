from django.db.models import Q
from rest_framework import serializers
from rest_framework_recursive.fields import RecursiveField

from fc_prod_serv.apps import CardTargetDeviceCreationResult
from fc_prod_serv.models import MediaFile, MediaFileType, Config, Set, Deck, Card, Crop, AspectRatio, Orientation, \
    TargetDevice, CardCropInstruction, CardTargetDevice
from production.business.models import Folder, File, CardCropCollection


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


class AspectRatioSerializer(serializers.ModelSerializer):

    class Meta:
        model = AspectRatio


class TargetDeviceSerializer(serializers.HyperlinkedModelSerializer):
    aspect_ratio_id = serializers.PrimaryKeyRelatedField(many=False, queryset=AspectRatio.objects.all(), source='aspect_ratio')

    class Meta:
        model = TargetDevice


class CardSerializer(serializers.HyperlinkedModelSerializer):
    id = serializers.ReadOnlyField(source="card_id")
    deckId = serializers.PrimaryKeyRelatedField(many=False, queryset=Deck.objects.all(), source='deck')
    displayOrder = serializers.IntegerField(source='display_order')
    image = serializers.SlugRelatedField(many=False, source="original_image",
                                         queryset=MediaFile.objects.filter(media_file_type=1),
                                         slug_field="relative_path")
    sound = serializers.SlugRelatedField(many=False,
                                         queryset=MediaFile.objects.filter(media_file_type=3),
                                         slug_field="relative_path")
    complete = serializers.BooleanField()

    class Meta:
        model = Card
        fields = ('id', 'name', 'deckId', 'displayOrder', 'sound', 'image', 'complete')


class CropSerializer(serializers.HyperlinkedModelSerializer):
    id = serializers.ReadOnlyField(source="crop_id")
    cardId = serializers.PrimaryKeyRelatedField(many=False, queryset=Card.objects.all(), source='card')
    aspectRatioId = serializers.PrimaryKeyRelatedField(many=False, queryset=AspectRatio.objects.all()
                                                       , source='aspect_ratio')
    orientationId = serializers.PrimaryKeyRelatedField(many=False, queryset=Orientation.objects.all(),
                                                       source='orientation')

    class Meta:
        model = Crop
        fields = ('id', 'cardId', 'aspectRatioId', 'orientationId', 'x', 'y', 'w', 'h')


class CardDetailSerializer(serializers.HyperlinkedModelSerializer):
    id = serializers.ReadOnlyField(source="card_id")
    deckId = serializers.PrimaryKeyRelatedField(many=False, queryset=Deck.objects.all(), source='deck')
    displayOrder = serializers.IntegerField(source='display_order')
    image = serializers.SlugRelatedField(many=False, source="original_image",
                                         queryset=MediaFile.objects.filter(media_file_type=1),
                                         slug_field="relative_path")
    sound = serializers.SlugRelatedField(many=False,
                                         queryset=MediaFile.objects.filter(media_file_type=3),
                                         slug_field="relative_path")

    complete = serializers.BooleanField()

    class Meta:
        model = Card
        fields = ('id', 'name', 'deckId', 'displayOrder', 'sound', 'image', 'ts_ls_x', 'ts_ls_w',
                  'ts_ls_y', 'ts_ls_h', 'ts_pt_x', 'ts_pt_w', 'ts_pt_y', 'ts_pt_h', 'ns_ls_x',
                  'ns_ls_w', 'ns_ls_y', 'ns_ls_h', 'ns_pt_x', 'ns_pt_w', 'ns_pt_y', 'ns_pt_h', 'complete')


class MediaFileField(serializers.Field):
    def to_representation(self, value: MediaFile):
        return {"id": value.media_file_id, "name": value.name, "path": value.path,
                "size": value.size, 'relativePath': value.relative_path, 'media_file_type': value.media_file_type_id}

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


class CardCropInstructionSerializer(serializers.ModelSerializer):

    class Meta:
        model = CardCropInstruction


class CardTargetDeviceSerializer(serializers.ModelSerializer):
    card_id = serializers.PrimaryKeyRelatedField(many=False, queryset=Card.objects.all(), source='card')

    class Meta:
        model = CardTargetDevice
        #fields = ('card_id')


class CardCropCollectionSerializer(serializers.Serializer):
    name = serializers.CharField()
    crops = CardTargetDeviceSerializer(many=True, read_only=True)

    class Meta:
        model = CardCropCollection
        fields = ('name', 'crops')


class CardTargetDeviceCreationResultSerializer(serializers.Serializer):
    def create(self, validated_data):
        pass

    def update(self, instance, validated_data):
        pass

    status = serializers.CharField()
    targetsExist = serializers.BooleanField(source="targets_exist")
    cropsExist = serializers.BooleanField(source="crops_exist")

    class Meta:
        model = CardTargetDeviceCreationResult
        fields = ('status', 'targetsExist', 'cropsExist')


