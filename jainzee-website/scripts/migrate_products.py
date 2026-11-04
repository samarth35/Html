"""
Migration script: Replace old products with correct 12 products
having 1kg and 500g variants with correct pricing.
"""
import sqlite3
import json
import os
import sys

DB_PATH = os.path.join(os.path.dirname(__file__), '..', 'jainzee.db')
UPLOADS_DIR = os.path.join(os.path.dirname(__file__), '..', 'static', 'uploads')

conn = sqlite3.connect(DB_PATH)
cur = conn.cursor()

# 1) Delete all existing products (clean slate)
cur.execute("DELETE FROM products")
print("Deleted all existing products.")

# 2) Insert 12 correct products
products = [
    {
        "name_en": "Cashew W400",
        "name_hi": "काजू W400",
        "sku": "CW400",
        "price": 879,
        "old_price": 950,
        "weight": "1kg / 500g",
        "stock": 100,
        "is_active": 1,
        "image_url": "/static/uploads/cashew.jpg",
        "description_en": "Premium quality W400 grade cashews, lightly salted and freshly processed.",
        "description_hi": "उच्च गुणवत्ता W400 श्रेणी के काजू।",
        "category": "cashews",
        "grades": json.dumps([
            {"name": "1kg", "price": "879"},
            {"name": "500g", "price": "499"}
        ])
    },
    {
        "name_en": "Cashew Wmix",
        "name_hi": "काजू Wmix",
        "sku": "CWMIX",
        "price": 899,
        "old_price": 980,
        "weight": "1kg / 500g",
        "stock": 100,
        "is_active": 1,
        "image_url": "/static/uploads/cashew.jpg",
        "description_en": "Mixed grade premium cashews, carefully selected for quality.",
        "description_hi": "मिश्रित श्रेणी के प्रीमियम काजू।",
        "category": "cashews",
        "grades": json.dumps([
            {"name": "1kg", "price": "899"},
            {"name": "500g", "price": "455"}
        ])
    },
    {
        "name_en": "Cashew W320",
        "name_hi": "काजू W320",
        "sku": "CW320",
        "price": 949,
        "old_price": 1050,
        "weight": "1kg / 500g",
        "stock": 100,
        "is_active": 1,
        "image_url": "/static/uploads/cashew.jpg",
        "description_en": "W320 grade cashews — medium sized, perfect for daily snacking.",
        "description_hi": "W320 श्रेणी के काजू — मध्यम आकार।",
        "category": "cashews",
        "grades": json.dumps([
            {"name": "1kg", "price": "949"},
            {"name": "500g", "price": "479"}
        ])
    },
    {
        "name_en": "Cashew W260",
        "name_hi": "काजू W260",
        "sku": "CW260",
        "price": 999,
        "old_price": 1100,
        "weight": "1kg / 500g",
        "stock": 100,
        "is_active": 1,
        "image_url": "/static/uploads/cashew.jpg",
        "description_en": "W260 grade cashews — larger sized, premium whole cashews.",
        "description_hi": "W260 श्रेणी के काजू — बड़े आकार के प्रीमियम काजू।",
        "category": "cashews",
        "grades": json.dumps([
            {"name": "1kg", "price": "999"},
            {"name": "500g", "price": "501"}
        ])
    },
    {
        "name_en": "Cashew W240",
        "name_hi": "काजू W240",
        "sku": "CW240",
        "price": 1030,
        "old_price": 1150,
        "weight": "1kg / 500g",
        "stock": 100,
        "is_active": 1,
        "image_url": "/static/uploads/cashew.jpg",
        "description_en": "W240 grade cashews — extra large premium quality cashews.",
        "description_hi": "W240 श्रेणी के काजू — अतिरिक्त बड़े प्रीमियम काजू।",
        "category": "cashews",
        "grades": json.dumps([
            {"name": "1kg", "price": "1030"},
            {"name": "500g", "price": "519"}
        ])
    },
    {
        "name_en": "Cashew W210",
        "name_hi": "काजू W210",
        "sku": "CW210",
        "price": 1099,
        "old_price": 1250,
        "weight": "1kg / 500g",
        "stock": 100,
        "is_active": 1,
        "image_url": "/static/uploads/cashew.jpg",
        "description_en": "W210 grade cashews — jumbo sized, the finest premium cashews.",
        "description_hi": "W210 श्रेणी के काजू — जम्बो आकार, सर्वोत्तम काजू।",
        "category": "cashews",
        "grades": json.dumps([
            {"name": "1kg", "price": "1099"},
            {"name": "500g", "price": "499"}
        ])
    },
    {
        "name_en": "Cashew Jk",
        "name_hi": "काजू Jk",
        "sku": "CJK",
        "price": 879,
        "old_price": 950,
        "weight": "1kg / 500g",
        "stock": 100,
        "is_active": 1,
        "image_url": "/static/uploads/cashew.jpg",
        "description_en": "JK grade cashews, premium quality from Jainzee Food Processing Industries.",
        "description_hi": "JK श्रेणी के काजू, जैनजी फूड प्रोसेसिंग इंडस्ट्रीज से।",
        "category": "cashews",
        "grades": json.dumps([
            {"name": "1kg", "price": "879"},
            {"name": "500g", "price": "449"}
        ])
    },
    {
        "name_en": "Cashew Jh",
        "name_hi": "काजू Jh",
        "sku": "CJH",
        "price": 920,
        "old_price": 1000,
        "weight": "1kg / 500g",
        "stock": 100,
        "is_active": 1,
        "image_url": "/static/uploads/cashew.jpg",
        "description_en": "JH grade cashews, hand-picked and freshly processed for best taste.",
        "description_hi": "JH श्रेणी के काजू, हाथ से चुने और ताज़े प्रसंस्कृत।",
        "category": "cashews",
        "grades": json.dumps([
            {"name": "1kg", "price": "920"},
            {"name": "500g", "price": "469"}
        ])
    },
    {
        "name_en": "Makhana",
        "name_hi": "मखाना",
        "sku": "MAKH",
        "price": 1349,
        "old_price": 1500,
        "weight": "1kg / 500g",
        "stock": 100,
        "is_active": 1,
        "image_url": "/static/uploads/Gemini_Generated_Image_6qjj8c6qjj8c6qjj.png",
        "description_en": "Premium quality Makhana (Fox Nuts) — crispy, healthy and delicious. 100% natural.",
        "description_hi": "उच्च गुणवत्ता मखाना — कुरकुरा, स्वस्थ और स्वादिष्ट। 100% प्राकृतिक।",
        "category": "dryfruits",
        "grades": json.dumps([
            {"name": "1kg", "price": "1349"},
            {"name": "500g", "price": "679"}
        ])
    },
    {
        "name_en": "Kishmish",
        "name_hi": "किशमिश",
        "sku": "KISH",
        "price": 549,
        "old_price": 650,
        "weight": "1kg / 500g",
        "stock": 100,
        "is_active": 1,
        "image_url": "/static/uploads/raisins.jpg",
        "description_en": "Premium quality raisins (Kishmish) — naturally sweet and healthy.",
        "description_hi": "उच्च गुणवत्ता किशमिश — प्राकृतिक रूप से मीठी और स्वस्थ।",
        "category": "dryfruits",
        "grades": json.dumps([
            {"name": "1kg", "price": "549"},
            {"name": "500g", "price": "279"}
        ])
    },
    {
        "name_en": "Badam",
        "name_hi": "बादाम",
        "sku": "BADM",
        "price": 1249,
        "old_price": 1400,
        "weight": "1kg / 500g",
        "stock": 100,
        "is_active": 1,
        "image_url": "/static/uploads/almonds.jpg",
        "description_en": "Premium California Almonds (Badam) — rich in nutrients and freshness guaranteed.",
        "description_hi": "प्रीमियम कैलिफोर्निया बादाम — पोषक तत्वों से भरपूर।",
        "category": "dryfruits",
        "grades": json.dumps([
            {"name": "1kg", "price": "1249"},
            {"name": "500g", "price": "629"}
        ])
    },
    {
        "name_en": "Akhrot",
        "name_hi": "अखरोट",
        "sku": "AKHR",
        "price": 899,
        "old_price": 1000,
        "weight": "1kg / 500g",
        "stock": 100,
        "is_active": 1,
        "image_url": "/static/uploads/walnuts.jpg",
        "description_en": "Premium quality Walnuts (Akhrot). ⚠️ Note: 500g price (₹949) is higher than 1kg price (₹899) as per pricing instructions.",
        "description_hi": "उच्च गुणवत्ता अखरोट।",
        "category": "dryfruits",
        "grades": json.dumps([
            {"name": "1kg", "price": "899"},
            {"name": "500g", "price": "949"}
        ])
    },
]

# Check which columns exist in the products table
cur.execute("PRAGMA table_info(products)")
cols = {row[1] for row in cur.fetchall()}
print(f"Products table columns: {cols}")

for p in products:
    # Build insert based on available columns
    fields = []
    vals = []

    field_map = {
        "name_en": p["name_en"],
        "name_hi": p["name_hi"],
        "sku": p["sku"],
        "price": p["price"],
        "old_price": p["old_price"],
        "weight": p["weight"],
        "stock": p["stock"],
        "is_active": p["is_active"],
        "image_url": p["image_url"],
        "description_en": p["description_en"],
        "description_hi": p["description_hi"],
        "category": p["category"],
        "grades": p["grades"],
    }

    for f, v in field_map.items():
        if f in cols:
            fields.append(f)
            vals.append(v)

    placeholders = ",".join(["?" for _ in fields])
    sql = f"INSERT INTO products ({','.join(fields)}) VALUES ({placeholders})"
    cur.execute(sql, vals)
    print(f"  Inserted: {p['name_en']}")

conn.commit()
conn.close()
print("\n✅ Migration complete! 12 products inserted successfully.")
print("\n⚠️  FLAG: Akhrot 500g price (₹949) > 1kg price (₹899) — implemented exactly as instructed.")
