class PhotoshopScriptRunner(object):

    def __init__(self, photoshop_root_dir):
        self.photoshop_root_dir = photoshop_root_dir

    def get_ascript(self):

        ascript = '''
        on run argv
            tell application "Adobe Photoshop CC 2015"
              set js to "#include ~/Dev/Projects/baby-flashcard-app/photoshop/singleImage.jsx" & return
              set js to js & "main(arguments);" & return
              do javascript js with arguments argv

            end tell
        end run
        '''
        return ascript

    def as_run(self, ascript, line):
        "Run the given AppleScript and return the standard output and error."
        home = expanduser("~")
        scpt_path = os.path.join(home, "Dev/Projects/baby-flashcard-app/photoshop/resize_cmd.scpt")
        osa = subprocess.call(
            ['osascript', scpt_path, line])

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