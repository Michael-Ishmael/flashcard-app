import os
import sys
from os.path import expanduser

import django
from PIL import Image

from production.business.fc_util import join_paths
from production.business.photoshop_script_runner import PhotoshopScriptRunner


def tree_walk():
	o_path = "/Users/scorpio/Dev/Projects/flashcard-app/media/media/images/"
	directory = os.path.dirname(o_path)  # get the directory of your script
	for subdir, dirs, files in os.walk(directory):
		dir_name = os.path.split(subdir)[-1]
		file_suffix_idx = 1
		done_renames = False
		rename_record = {}
		for filename in files:
			if filename.find('.jpg') > 0:
				filePath = os.path.join(subdir, filename)  # get the path to your file
				new_name = "{0}_{1}.jpg".format(dir_name, file_suffix_idx)
				file_suffix_idx += 1;
				newFilePath = join_paths(subdir, new_name)
				rename_record[new_name] = filename
				os.rename(filePath, newFilePath)  # rename your file
				done_renames = True
		if done_renames:
			with open("{0}_cat.txt".format(dir_name), "w") as f:
				for key in rename_record:
					f.writelines("{0}: {1}".format(key, rename_record[key]))


def bulk_image_process():

	os.environ.setdefault("DJANGO_SETTINGS_MODULE", "production.settings")
	django.setup()

	from fc_prod_serv.models import MediaFile, MediaFileType

	media_path = "Dev/Projects/flashcard-app/media/media"
	script_path = "Dev/Projects/flashcard-app/photoshop/resize_cmd.scpt"

	img_dir = join_paths(expanduser("~"), media_path, "/sounds/")

	directory = os.path.dirname(img_dir)  # get the directory of your script
	for subdir, dirs, files in os.walk(directory):
		dir_name = os.path.split(subdir)[-1]

		for filename in files:
			if filename.find('.mp3') > 0:
				file_path = os.path.join(subdir, filename)  # get the path to your file
				full_media_path = join_paths(expanduser('~'), media_path)
				source = file_path
				# target = join_paths(full_media_path, "img", filename)
				# if not os.path.exists(target):
				# 	PhotoshopScriptRunner.as_run(script_path, source, target, 800, 600)
				#
				# root_path = join_paths(expanduser("~"), media_path)
				# rel_path = target.replace(root_path, "media")

				target = source
				rel_path = join_paths("media", source)

				if len(filename) > 50:
					print(file_path)

				if not os.path.exists(target):
					print("Failure: {0}".format(source))
				else:
					stats = os.stat(target)
					# img = Image.open(target)
					# w, h = img.size
					# width_to_height_ratio = round(w / h, 4)
					# img.close()
					name = filename
					match = MediaFile.objects.filter(name=name).first()  #type: MediaFile
					if not match is None:
						match.relative_path = rel_path
						match.save()
					else:
						media_file = MediaFile(media_file_type_id=1, name=filename, path=source,
											   relative_path=rel_path, size=stats.st_size,
											   width_to_height_ratio=1)
						media_file.save()


def pre_fill_cards():

	os.environ.setdefault("DJANGO_SETTINGS_MODULE", "production.settings")
	django.setup()

	from fc_prod_serv.models import Set, Deck, Card

	sets = Set.objects.all()

	for set in sets:

		decks = Deck.objects.filter(set=set)

		for deck in decks:

			cards = Card.objects.filter(deck=deck)

			card_count = len(cards)

			if card_count < 5:

				for i in range(card_count + 1, 5+1):

					card_name = "{0}{1}".format(deck.name, i)
					card_label = deck.name.lower()

					new_card = Card(name=card_name, label=card_label, deck=deck, display_order= i)
					new_card.save()



pre_fill_cards()
#bulk_image_process()

