from django.conf.urls import url
from rest_framework import routers, viewsets
from fc_prod_serv.views import FolderView, MediaFileViewSet, ConfigViewSet, SetViewSet, DeckViewSet, FilePreviewView

router = routers.DefaultRouter()
router.register(r'mediafiles', MediaFileViewSet)
router.register(r'config', ConfigViewSet)
router.register(r'sets', SetViewSet)
router.register(r'decks', DeckViewSet)

urlpatterns = router.urls

urlpatterns += [
    url(r'^folders', FolderView.as_view(), name='folder_view'),
    url(r'^files/previews', FilePreviewView.as_view(), name='file_view')
                ]


#     = [
#     url(r'^$', include(router.urls)),
#     url(r'^api-auth/', include('rest_framework.urls', namespace='rest_framework'))
# ]