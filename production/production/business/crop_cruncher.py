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
            self.w / container_width,
            self.y / container_height,
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
    def can_be_combined_rect(ls_pcs, pt_pcs, long_side, short_side):
        combined_rect = CropCruncher.get_new_rect_bounds(ls_pcs, pt_pcs, long_side, short_side)

        return (combined_rect.w * combined_rect.h) < (long_side * short_side * 2)

    @staticmethod
    def get_new_rect_bounds(ls_pcs, pt_pcs, long_side, short_side):

        landscape_crop = Bounds(long_side * ls_pcs.x, short_side * ls_pcs.y, long_side * ls_pcs.w,
                                short_side * ls_pcs.h)

        portrait_crop = Bounds(short_side * pt_pcs.x, long_side * pt_pcs.y, short_side * pt_pcs.w, long_side * pt_pcs.h)

        target_crop = landscape_crop if landscape_crop.w < portrait_crop.h else portrait_crop
        alt_crop = landscape_crop if landscape_crop.w > portrait_crop.h else portrait_crop

        offset_x = max(target_crop.x - alt_crop.x, 0)
        extra_after_x = max(alt_crop.x2() - target_crop.x2(), 0)

        offset_y = max(target_crop.y - alt_crop.y, 0)
        extra_after_y = max(alt_crop.y2() - target_crop.y2(), 0)

        target_orientation = Orientation.landscape if target_crop.w < target_crop.h \
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
    def get_combined_crops(ls_pcs, pt_pcs, long_side, short_side):

        landscape_crop = Bounds(long_side * ls_pcs.x, short_side * ls_pcs.y, long_side * ls_pcs.w, short_side * ls_pcs.h)
        portrait_crop = Bounds(short_side * pt_pcs.x, long_side * pt_pcs.y, short_side * pt_pcs.w, long_side * pt_pcs.h)

        if landscape_crop.x <= portrait_crop.x:
            portrait_crop.x = portrait_crop.x - landscape_crop.x
        else:
            landscape_crop.x = landscape_crop.x - portrait_crop.x

        if landscape_crop.y <= portrait_crop.y:
            portrait_crop.y = portrait_crop.y - landscape_crop.y
        else:
            landscape_crop.y = landscape_crop.y - portrait_crop.y

        return [landscape_crop.to_bounds_pcs(long_side, short_side), portrait_crop.to_bounds_pcs(short_side, long_side)]