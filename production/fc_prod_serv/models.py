# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey has `on_delete` set to the desired behavior.
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
from __future__ import unicode_literals

from django.db import models


class Config(models.Model):
    settingKey = models.CharField(primary_key=True, max_length=20,blank=False)
    settingValue = models.CharField(max_length=500, blank=False)


class AspectRatio(models.Model):
    aspect_ratio_id = models.IntegerField(primary_key=True)
    name = models.CharField(max_length=10)
    prefix = models.CharField(max_length=2)
    width_units = models.IntegerField()
    height_units = models.IntegerField()

    class Meta:
        managed = True
        db_table = 'aspect_ratio'


class Card(models.Model):
    card_id = models.IntegerField(primary_key=True)
    name = models.CharField(max_length=20)
    deck = models.ForeignKey('Deck', models.DO_NOTHING)
    display_order = models.IntegerField()
    original_image = models.ForeignKey('MediaFile', models.DO_NOTHING, blank=True, null=True,
                                       related_name="original_image_id")
    sound = models.ForeignKey('MediaFile', models.DO_NOTHING, blank=True, null=True,
                              related_name="sound_id")
    ts_ls_x = models.FloatField(blank=True, null=True)  # This field type is a guess.
    ts_ls_w = models.FloatField(blank=True, null=True)  # This field type is a guess.
    ts_ls_y = models.FloatField(blank=True, null=True)  # This field type is a guess.
    ts_ls_h = models.FloatField(blank=True, null=True)  # This field type is a guess.
    ts_pt_x = models.FloatField(blank=True, null=True)  # This field type is a guess.
    ts_pt_w = models.FloatField(blank=True, null=True)  # This field type is a guess.
    ts_pt_y = models.FloatField(blank=True, null=True)  # This field type is a guess.
    ts_pt_h = models.FloatField(blank=True, null=True)  # This field type is a guess.
    ns_ls_x = models.FloatField(blank=True, null=True)  # This field type is a guess.
    ns_ls_w = models.FloatField(blank=True, null=True)  # This field type is a guess.
    ns_ls_y = models.FloatField(blank=True, null=True)  # This field type is a guess.
    ns_ls_h = models.FloatField(blank=True, null=True)  # This field type is a guess.
    ns_pt_x = models.FloatField(blank=True, null=True)  # This field type is a guess.
    ns_pt_w = models.FloatField(blank=True, null=True)  # This field type is a guess.
    ns_pt_y = models.FloatField(blank=True, null=True)  # This field type is a guess.
    ns_pt_h = models.FloatField(blank=True, null=True)  # This field type is a guess.

    class Meta:
        managed = False
        db_table = 'card'


class CardTargetDevice(models.Model):
    card_target_device_id = models.IntegerField(primary_key=True)
    card = models.ForeignKey(Card, models.DO_NOTHING, blank=True, null=True)
    target_device = models.ForeignKey('TargetDevice', models.DO_NOTHING, blank=True, null=True)
    ls_xcasset_name = models.CharField(max_length=20)
    pt_xcasset_name = models.CharField(max_length=20)
    ls_crop_x = models.FloatField(blank=True, null=True)  # This field type is a guess.
    ls_crop_w = models.FloatField(blank=True, null=True)  # This field type is a guess.
    ls_crop_y = models.FloatField(blank=True, null=True)  # This field type is a guess.
    ls_crop_h = models.FloatField(blank=True, null=True)  # This field type is a guess.
    pt_crop_x = models.FloatField(blank=True, null=True)  # This field type is a guess.
    pt_crop_w = models.FloatField(blank=True, null=True)  # This field type is a guess.
    pt_crop_y = models.FloatField(blank=True, null=True)  # This field type is a guess.
    pt_crop_h = models.FloatField(blank=True, null=True)  # This field type is a guess.

    class Meta:
        managed = False
        db_table = 'card_target_device'


class Deck(models.Model):
    deck_id = models.AutoField(primary_key=True)
    set = models.ForeignKey('Set', models.DO_NOTHING)
    name = models.CharField(max_length=20)
    icon = models.ForeignKey('MediaFile', models.DO_NOTHING, blank=True, null=True, default=1)
    display_order = models.IntegerField()

    class Meta:
        managed = False
        db_table = 'deck'


class MediaFile(models.Model):
    media_file_id = models.AutoField(primary_key=True)
    media_file_type = models.ForeignKey('MediaFileType', models.DO_NOTHING, blank=True, null=False)
    name = models.CharField(unique=True, max_length=50)
    path = models.CharField(max_length=500)
    size = models.IntegerField(default=0)
    relative_path = models.CharField(max_length=300)

    def __str__(self):
        return self.name

    class Meta:
        managed = False
        db_table = 'media_file'


class MediaFileType(models.Model):
    media_file_type_id = models.IntegerField(primary_key=True)
    name = models.CharField(max_length=20)

    def __str__(self):
        return self.name

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
    set_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=20)
    icon = models.ForeignKey(MediaFile, models.DO_NOTHING, blank=True, null=True)
    display_order = models.IntegerField()

    def __str__(self):
        return self.name

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
