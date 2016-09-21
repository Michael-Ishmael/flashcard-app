from enum import Enum


class Orientation(Enum):
    portrait = 1
    landscape = 2


class Bounds:
    def __init__(self, x, y, w, h):
        self.x = x
        self.y = y
        self.w = w
        self.h = h

    def __str__(self):
        return "x:{0}, y:{1}, w:{2}, h:{3}".format(self.x, self.y, self.w, self.h)

    @staticmethod
    def load_from_dict(bounds_dict):
        x = bounds_dict.get("x", 0)
        y = bounds_dict.get("y", 0)
        w = bounds_dict.get("w", 0)
        h = bounds_dict.get("h", 0)

        return Bounds(x, y, w, h)

    def x2(self):
        return self.x + self.w

    def y2(self):
        return self.y + self.h

    def is_outside_x_bounds(self, other):
        if other.x < self.x:
            return True
        if other.x2() > self.x2():
            return True
        return False

    def is_outside_y_bounds(self, other):
        if other.y < self.y:
            return True
        if other.y2() > self.y2():
            return True
        return False

    def get_adjusted(self, offset_x, offset_y):
        return Bounds(self.x + offset_x, self.y + offset_y, self.w, self.h)

    def long_side(self):
        return self.w if self.w >= self.h else self.h

    def short_side(self):
        return self.h if self.h <= self.w else self.w

    def to_bounds_pcs(self, container_width, container_height):
        bounds_pcs = Bounds(
            self.x / container_width,
            self.y / container_height,
            self.w / container_width,
            self.h / container_height)
        return bounds_pcs

    def get_combined_bounds(self, other):
        """

        :rtype: Bounds
        :type other: Bounds
        """
        x = min(self.x, other.x)
        y = min(self.y, other.y)
        x2 = max(self.x2(), other.x2())
        y2 = max(self.y2(), other.y2())

        return Bounds(x, y, x2 - x, y2 - y)

        # def to_json(self):
        #     return simplejson.dumps(self.__dict__)


class CropCruncher(object):
    @staticmethod
    def can_be_combined_rect(ls_pcs: Bounds, pt_pcs: Bounds, width: int, height: int):
        combined_rect_pcs = CropCruncher.get_combined_rect_pcs(ls_pcs, pt_pcs)

        combined_area = combined_rect_pcs.w * width * combined_rect_pcs.h * height
        individual_area = (ls_pcs.w * width * ls_pcs.h * height) + (pt_pcs.w * width * pt_pcs.h * height)
        return combined_area < individual_area

    @staticmethod
    def get_combined_rect_pcs(ls_pcs: Bounds, pt_pcs: Bounds):

        nx = min(ls_pcs.x, pt_pcs.x)
        nx2 = max(ls_pcs.x2(), pt_pcs.x2())
        ny = min(ls_pcs.y, pt_pcs.y)
        ny2 = max(ls_pcs.y2(), pt_pcs.y2())

        new_bounds_pcs = Bounds(nx, ny, nx2 - nx, ny2 - ny)
        return new_bounds_pcs



    @staticmethod
    def get_new_rect_bounds(ls_pcs, pt_pcs, long_side, short_side):

        landscape_crop = Bounds(round(long_side * ls_pcs.x, 2), round(short_side * ls_pcs.y, 2),
                                round(long_side * ls_pcs.w, 2),
                                round(short_side * ls_pcs.h, 2))

        portrait_crop = Bounds(round(short_side * pt_pcs.x, 2), round(long_side * pt_pcs.y, 2),
                               round(short_side * pt_pcs.w, 2),
                               round(long_side * pt_pcs.h, 2))

        target_crop = landscape_crop if landscape_crop.w < portrait_crop.h else portrait_crop
        alt_crop = landscape_crop if landscape_crop.w > portrait_crop.h else portrait_crop

        offset_x = max(target_crop.x - alt_crop.x, 0)
        extra_after_x = max(alt_crop.x2() - target_crop.x2(), 0)

        offset_y = max(target_crop.y - alt_crop.y, 0)
        extra_after_y = max(alt_crop.y2() - target_crop.y2(), 0)

        target_orientation = Orientation.landscape if target_crop.w > target_crop.h \
            else Orientation.portrait

        width = 0
        height = 0
        extra_x_ratio = 1
        extra_y_ratio = 1

        extra_x = offset_x + extra_after_x
        extra_y = offset_y + extra_after_y

        if target_orientation == Orientation.landscape:
            width = long_side
            height = short_side
            if extra_x > 0:
                extra_x_ratio = extra_x / target_crop.h
            if extra_y > 0:
                extra_y_ratio = extra_y / target_crop.w
        elif target_orientation == Orientation.portrait:
            width = short_side
            height = long_side
            if extra_x > 0:
                extra_x_ratio = extra_x / target_crop.w
            if extra_y > 0:
                extra_y_ratio = extra_y / target_crop.h

        if extra_x > 0:
            new_extra_x_size = width * extra_x_ratio
            width += new_extra_x_size

        if extra_y > 0:
            new_extra_y_size = height * extra_y_ratio
            height += new_extra_y_size

        return Bounds(0, 0, width, height)

    @staticmethod
    def get_combined_crops(ls_pcs, pt_pcs):

        cb_pcs = CropCruncher.get_combined_rect_pcs(ls_pcs, pt_pcs)
        landscape_crop = CropCruncher.get_item_bounds_as_relation_to_combined(ls_pcs, cb_pcs)
        portrait_crop = CropCruncher.get_item_bounds_as_relation_to_combined(pt_pcs, cb_pcs)

        return landscape_crop, portrait_crop

    @staticmethod
    def get_item_bounds_as_relation_to_combined(i_pcs:Bounds, c_pcs:Bounds):
        x = round((i_pcs.x - c_pcs.x) / c_pcs.w, 2)
        y = round((i_pcs.y - c_pcs.y) / c_pcs.h, 2)
        w = round(i_pcs.w / c_pcs.w, 2)
        h = round(i_pcs.h / c_pcs.h, 2)

        return Bounds(x, y, w, h)