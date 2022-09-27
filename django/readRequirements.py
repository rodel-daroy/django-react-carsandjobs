import os
packages = os.popen("piprot requirements.txt").read()
f = open("libarayVersions.txt", "w+")
f.write(packages)
