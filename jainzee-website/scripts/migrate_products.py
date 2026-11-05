"""Safely apply catalogue migrations without deleting products or changing their IDs."""
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from app import init_db

if __name__ == '__main__':
    init_db()
    print('Catalogue is up to date; existing product IDs and later admin edits are retained.')
