from django.conf.urls import url
from rest_framework import routers, viewsets
from fc_prod_serv.views import FolderView, MediaFileViewSet, ConfigViewSet, SetViewSet, DeckViewSet, FilePreviewView, \
    CardViewSet, CardDetailViewSet, CropViewSet, CardCropsView, AspectRatioViewSet, \
    TargetDeviceViewSet, CardTargetDeviceViewSet, TargetDeviceCreationView

router = routers.DefaultRouter()
router.register(r'mediafiles', MediaFileViewSet)
router.register(r'config', ConfigViewSet)
router.register(r'sets', SetViewSet)
router.register(r'decks', DeckViewSet)
router.register(r'carddetails', CardDetailViewSet)
router.register(r'cards', CardViewSet)
router.register(r'crops', CropViewSet)
router.register(r'aspectratios', AspectRatioViewSet)
router.register(r'targetdevices', TargetDeviceViewSet)
router.register(r'cardtargetdevices', CardTargetDeviceViewSet)


urlpatterns = router.urls

urlpatterns += [
    url(r'^folders', FolderView.as_view(), name='folder_view'),
    #url(r'^cardcrops/$', CardCropsView.as_view(), name='card_crops_view'),
    #url(r'^cardcrops/(?P<pk>[0-9]+)/$', CardCropCollectionView.as_view(), name='card_crop_col_view'),
    url(r'^files/previews', FilePreviewView.as_view(), name='file_view'),
    url(r'^cardtargetdevices/creation$', TargetDeviceCreationView.as_view(), name='target_device_creation_view'),
    url(r'^cardtargetdevices/creation/(?P<pk>[0-9]+)/$', TargetDeviceCreationView.as_view(), name='target_device_creation_detail_view')
                ]

#     = [
#     url(r'^$', include(router.urls)),
#     url(r'^api-auth/', include('rest_framework.urls', namespace='rest_framework'))
# ]