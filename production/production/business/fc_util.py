import os
from typing import List


def join_paths(*args):
    stripped = [args[0]]
    stripped = stripped + [s[1:] if s.startswith("/") else s for s in args[1:]]
    return os.path.join(*stripped)

