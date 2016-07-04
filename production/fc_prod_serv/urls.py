from django.conf.urls import url, include
from rest_framework import routers, serializers, viewsets

from fc_prod_serv.models import MediaFile, MediaFileType, Config


class MediaFileSerializer(serializers.HyperlinkedModelSerializer):
    media_file_type = serializers.PrimaryKeyRelatedField(many=False, queryset=MediaFileType.objects.all())

    class Meta:
        model = MediaFile
        fields = ('media_file_id', 'media_file_type', 'name', 'path')


class MediaFileViewSet(viewsets.ModelViewSet):
    queryset = MediaFile.objects.all()
    serializer_class = MediaFileSerializer


class ConfigSerializer(serializers.BaseSerializer):

    class Meta:
        model = Config
        fields = ('settingKey', 'settingValue')


class ConfigViewSet(viewsets.ModelViewSet):
    queryset = Config.objects.all()
    serializer_class = ConfigSerializer

router = routers.DefaultRouter()
router.register(r'mediafiles', MediaFileViewSet)
router.register(r'config', ConfigViewSet)

urlpatterns = router.urls

#     = [
#     url(r'^$', include(router.urls)),
#     url(r'^api-auth/', include('rest_framework.urls', namespace='rest_framework'))
# ]