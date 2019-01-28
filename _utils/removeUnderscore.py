import os
import argparse

parser = argparse.ArgumentParser()
parser.add_argument('--dir', '-d', required=True)

args = parser.parse_args()
path = args.dir

for root, dirs, files in os.walk(path):
    os.chdir(root)
    for f in files:
        if f.startswith('_'):
            os.rename(f, f[1:])
