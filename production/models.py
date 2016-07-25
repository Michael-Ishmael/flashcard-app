# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey has `on_delete` set to the desired behavior.
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
from __future__ import unicode_literals

from django.db import models


class AspectRatio(models.Model):
    aspect_ratio_id = models.IntegerField(primary_key=True)
    name = models.CharField(max_length=10)
    prefix = models.CharField(max_length=2)
    width_units = models.IntegerField()
    height_units = models.IntegerField()

    class Meta:
        managed = False
        db_table = 'aspect_ratio'


class AuthGroup(models.Model):
    id = models.IntegerField(primary_key=True)  # AutoField?
    name = models.CharField(unique=True, max_length=80)

    class Meta:
        managed = False
        db_table = 'auth_group'


class AuthGroupPermissions(models.Model):
    id = models.IntegerField(primary_key=True)  # AutoField?
    group = models.ForeignKey(AuthGroup, models.DO_NOTHING)
    permission = models.ForeignKey('AuthPermission', models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'auth_group_permissions'
        unique_together = (('group', 'permission'),)


class AuthPermission(models.Model):
    id = models.IntegerField(primary_key=True)  # AutoField?
    content_type = models.ForeignKey('DjangoContentType', models.DO_NOTHING)
    codename = models.CharField(max_length=100)
    name = models.CharField(max_length=255)

    class Meta:
        managed = False
        db_table = 'auth_permission'
        unique_together = (('content_type', 'codename'),)


class AuthUser(models.Model):
    id = models.IntegerField(primary_key=True)  # AutoField?
    password = models.CharField(max_length=128)
    last_login = models.DateTimeField(blank=True, null=True)
    is_superuser = models.BooleanField()
    first_name = models.CharField(max_length=30)
    last_name = models.CharField(max_length=30)
    email = models.CharField(max_length=254)
    is_staff = models.BooleanField()
    is_active = models.BooleanField()
    date_joined = models.DateTimeField()
    username = models.CharField(unique=True, max_length=30)

    class Meta:
        managed = False
        db_table = 'auth_user'


class AuthUserGroups(models.Model):
    id = models.IntegerField(primary_key=True)  # AutoField?
    user = models.ForeignKey(AuthUser, models.DO_NOTHING)
    group = models.ForeignKey(AuthGroup, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'auth_user_groups'
        unique_together = (('user', 'group'),)


class AuthUserUserPermissions(models.Model):
    id = models.IntegerField(primary_key=True)  # AutoField?
    user = models.ForeignKey(AuthUser, models.DO_NOTHING)
    permission = models.ForeignKey(AuthPermission, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'auth_user_user_permissions'
        unique_together = (('user', 'permission'),)


class Card(models.Model):
    card_id = models.IntegerField(primary_key=True)
    name = models.CharField(max_length=20)
    deck = models.ForeignKey('Deck', models.DO_NOTHING)
    display_order = models.IntegerField()
    original_image = models.ForeignKey('MediaFile', models.DO_NOTHING, blank=True, null=True)
    sound = models.ForeignKey('MediaFile', models.DO_NOTHING, blank=True, null=True)
    ts_ls_x = models.TextField(blank=True, null=True)  # This field type is a guess.
    ts_ls_w = models.TextField(blank=True, null=True)  # This field type is a guess.
    ts_ls_y = models.TextField(blank=True, null=True)  # This field type is a guess.
    ts_ls_h = models.TextField(blank=True, null=True)  # This field type is a guess.
    ts_pt_x = models.TextField(blank=True, null=True)  # This field type is a guess.
    ts_pt_w = models.TextField(blank=True, null=True)  # This field type is a guess.
    ts_pt_y = models.TextField(blank=True, null=True)  # This field type is a guess.
    ts_pt_h = models.TextField(blank=True, null=True)  # This field type is a guess.
    ns_ls_x = models.TextField(blank=True, null=True)  # This field type is a guess.
    ns_ls_w = models.TextField(blank=True, null=True)  # This field type is a guess.
    ns_ls_y = models.TextField(blank=True, null=True)  # This field type is a guess.
    ns_ls_h = models.TextField(blank=True, null=True)  # This field type is a guess.
    ns_pt_x = models.TextField(blank=True, null=True)  # This field type is a guess.
    ns_pt_w = models.TextField(blank=True, null=True)  # This field type is a guess.
    ns_pt_y = models.TextField(blank=True, null=True)  # This field type is a guess.
    ns_pt_h = models.TextField(blank=True, null=True)  # This field type is a guess.

    class Meta:
        managed = False
        db_table = 'card'


class CardTargetDevice(models.Model):
    card_target_device_id = models.IntegerField(primary_key=True)
    card = models.ForeignKey(Card, models.DO_NOTHING, blank=True, null=True)
    target_device = models.ForeignKey('TargetDevice', models.DO_NOTHING, blank=True, null=True)
    ls_xcasset_name = models.CharField(max_length=20)
    pt_xcasset_name = models.CharField(max_length=20)
    ls_crop_x = models.TextField(blank=True, null=True)  # This field type is a guess.
    ls_crop_w = models.TextField(blank=True, null=True)  # This field type is a guess.
    ls_crop_y = models.TextField(blank=True, null=True)  # This field type is a guess.
    ls_crop_h = models.TextField(blank=True, null=True)  # This field type is a guess.
    pt_crop_x = models.TextField(blank=True, null=True)  # This field type is a guess.
    pt_crop_w = models.TextField(blank=True, null=True)  # This field type is a guess.
    pt_crop_y = models.TextField(blank=True, null=True)  # This field type is a guess.
    pt_crop_h = models.TextField(blank=True, null=True)  # This field type is a guess.

    class Meta:
        managed = False
        db_table = 'card_target_device'


class Deck(models.Model):
    deck_id = models.IntegerField(primary_key=True)
    set = models.ForeignKey('Set', models.DO_NOTHING)
    name = models.CharField(max_length=20)
    icon_id = models.IntegerField(blank=True, null=True)
    display_order = models.IntegerField()

    class Meta:
        managed = False
        db_table = 'deck'


class DjangoAdminLog(models.Model):
    id = models.IntegerField(primary_key=True)  # AutoField?
    object_id = models.TextField(blank=True, null=True)
    object_repr = models.CharField(max_length=200)
    action_flag = models.PositiveSmallIntegerField()
    change_message = models.TextField()
    content_type = models.ForeignKey('DjangoContentType', models.DO_NOTHING, blank=True, null=True)
    user = models.ForeignKey(AuthUser, models.DO_NOTHING)
    action_time = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'django_admin_log'


class DjangoContentType(models.Model):
    id = models.IntegerField(primary_key=True)  # AutoField?
    app_label = models.CharField(max_length=100)
    model = models.CharField(max_length=100)

    class Meta:
        managed = False
        db_table = 'django_content_type'
        unique_together = (('app_label', 'model'),)


class DjangoMigrations(models.Model):
    id = models.IntegerField(primary_key=True)  # AutoField?
    app = models.CharField(max_length=255)
    name = models.CharField(max_length=255)
    applied = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'django_migrations'


class DjangoSession(models.Model):
    session_key = models.CharField(primary_key=True, max_length=40)
    session_data = models.TextField()
    expire_date = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'django_session'


class FcProdServConfig(models.Model):
    settingkey = models.CharField(db_column='settingKey', primary_key=True, max_length=20)  # Field name made lowercase.
    settingvalue = models.CharField(db_column='settingValue', max_length=500)  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'fc_prod_serv_config'


class MediaFile(models.Model):
    media_file_id = models.IntegerField(primary_key=True)
    media_file_type = models.ForeignKey('MediaFileType', models.DO_NOTHING)
    name = models.CharField(unique=True, max_length=50)
    path = models.CharField(max_length=500)

    class Meta:
        managed = False
        db_table = 'media_file'


class MediaFileType(models.Model):
    media_file_type_id = models.IntegerField(primary_key=True)
    name = models.CharField(max_length=20)

    class Meta:
        managed = False
        db_table = 'media_file_type'


class Orientation(models.Model):
    orientation_id = models.IntegerField(primary_key=True)
    name = models.CharField(max_length=10)

    class Meta:
        managed = False
        db_table = 'orientation'


class Set(models.Model):
    set_id = models.IntegerField(primary_key=True)
    name = models.CharField(max_length=20)
    icon = models.ForeignKey(MediaFile, models.DO_NOTHING, blank=True, null=True)
    display_order = models.IntegerField()

    class Meta:
        managed = False
        db_table = 'set'


class TargetDevice(models.Model):
    target_device_id = models.IntegerField(primary_key=True)
    name = models.CharField(max_length=20)
    aspect_ratio = models.ForeignKey(AspectRatio, models.DO_NOTHING)
    width = models.IntegerField()
    height = models.IntegerField()
    idiom = models.CharField(max_length=20)
    scale = models.CharField(max_length=2)
    sub_type = models.CharField(max_length=10, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'target_device'
