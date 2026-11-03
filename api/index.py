import os
import sys

base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
site_dir = os.path.join(base_dir, 'jainzee-website')
if site_dir not in sys.path:
    sys.path.insert(0, site_dir)

from app import app

