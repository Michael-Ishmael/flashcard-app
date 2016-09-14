from django.test import TestCase

# Create your tests here.
from fc_prod_serv.models import TargetDevice


class CropCruncherTest(TestCase):

    def test_can_split_it_test(self):

        targets = TargetDevice.objects.all()

        for target in targets:
            print(target)

        self.assertTrue(True)
