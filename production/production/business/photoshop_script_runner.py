import os
from os.path import expanduser

import subprocess


class PhotoshopScriptRunner(object):

    @staticmethod
    def as_run(ascript, *args):
        "Run the given AppleScript and return the standard output and error."
        home = expanduser("~")
        scpt_path = os.path.join(home, ascript)
        call_arr = ['osascript', scpt_path]
        call_arr.extend( [str(a) for a in args] )
        osa = subprocess.call(call_arr)

        # .Popen(['osascript', line],
        #                    stdin=subprocess.PIPE,
        #                    stdout=subprocess.PIPE)
        # res = osa.communicate(ascript)[0]
        # print res, type(osa)
        return osa

    def as_quote(self, astr):
        "Return the AppleScript equivalent of the given string."

        astr = astr.replace('"', '" & quote & "')
        return '"{}"'.format(astr)