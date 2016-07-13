from django.conf.urls import url
from rest_framework import routers, serializers, viewsets

from fc_prod_serv.models import MediaFile, MediaFileType, Config, Set, Deck
from fc_prod_serv.views import FolderView


class MediaFileSerializer(serializers.HyperlinkedModelSerializer):
    media_file_type = serializers.PrimaryKeyRelatedField(many=False, queryset=MediaFileType.objects.all())

    class Meta:
        model = MediaFile
        fields = ('media_file_id', 'media_file_type', 'name', 'path')


class MediaFileViewSet(viewsets.ModelViewSet):
    queryset = MediaFile.objects.all()
    serializer_class = MediaFileSerializer


class ConfigSerializer(serializers.HyperlinkedModelSerializer):

    class Meta:
        model = Config
        fields = ('settingKey', 'settingValue')


class ConfigViewSet(viewsets.ModelViewSet):
    queryset = Config.objects.all()
    serializer_class = ConfigSerializer


class SetSerializer(serializers.HyperlinkedModelSerializer):

    class Meta:
        model = Set
        fields = ('set_id', 'name', 'icon', 'display_order')


class SetViewSet(viewsets.ModelViewSet):
    queryset = Set.objects.all()
    serializer_class = SetSerializer


class DeckSerializer(serializers.HyperlinkedModelSerializer):

    class Meta:
        model = Deck
        fields = ('deck_id', 'name', 'set', 'icon', 'display_order')


class DeckViewSet(viewsets.ModelViewSet):
    queryset = Deck.objects.all()
    serializer_class = DeckSerializer



router = routers.DefaultRouter()
router.register(r'mediafiles', MediaFileViewSet)
router.register(r'config', ConfigViewSet)
router.register(r'sets', SetViewSet)
router.register(r'decks', DeckViewSet)


urlpatterns = router.urls

urlpatterns += [url(r'^folders', FolderView.as_view(), name='folder_view')]

#     = [
#     url(r'^$', include(router.urls)),
#     url(r'^api-auth/', include('rest_framework.urls', namespace='rest_framework'))
# ]