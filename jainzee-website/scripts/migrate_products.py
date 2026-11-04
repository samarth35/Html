import sqlite3
import json
import os

DB_PATH = os.path.join(os.path.dirname(__file__), '..', 'jainzee.db')

conn = sqlite3.connect(DB_PATH)
cur = conn.cursor()

# Clean slate for products
cur.execute("DELETE FROM products")
print("Cleaned existing products table.")

cashew_grades = [
    {"name": "W400 (1kg)", "price": "₹879"},
    {"name": "W400 (500g)", "price": "₹499"},
    {"name": "Wmix (1kg)", "price": "₹899"},
    {"name": "Wmix (500g)", "price": "₹455"},
    {"name": "W320 (1kg)", "price": "₹949"},
    {"name": "W320 (500g)", "price": "₹479"},
    {"name": "W260 (1kg)", "price": "₹999"},
    {"name": "W260 (500g)", "price": "₹501"},
    {"name": "W240 (1kg)", "price": "₹1030"},
    {"name": "W240 (500g)", "price": "₹519"},
    {"name": "W210 Jumbo (1kg)", "price": "₹1099"},
    {"name": "W210 Jumbo (500g)", "price": "₹499"},
    {"name": "JK Grade (1kg)", "price": "₹879"},
    {"name": "JK Grade (500g)", "price": "₹449"},
    {"name": "JH Split (1kg)", "price": "₹920"},
    {"name": "JH Split (500g)", "price": "₹469"},
]

products = [
    (
        "Premium Cashew (Kaju)",
        "प्रीमियम काजू",
        "₹879",
        "1kg / 500g",
        "Large, creamy and hygienically graded premium whole cashews in all 8 export & wholesale grades (W400, Wmix, W320, W260, W240, W210, JK & JH). Choose your desired grade and pack size (1kg or 500g).",
        "बड़े, क्रीमी और स्वच्छ रूप से ग्रेड किए गए प्रीमियम काजू — सभी 8 ग्रेड (W400, Wmix, W320, W260, W240, W210, JK और JH) में उपलब्ध।",
        "/static/uploads/cashew.jpg",
        200,
        "₹999",
        "CAS-001",
        json.dumps(cashew_grades),
    ),
    (
        "Makhana",
        "मखाना",
        "₹1349",
        "1kg / 500g",
        "Premium quality Makhana (Fox Nuts) — crispy, healthy and delicious. 100% natural.",
        "उच्च गुणवत्ता मखाना — कुरकुरा, स्वस्थ और स्वादिष्ट। 100% प्राकृतिक।",
        "/static/uploads/Gemini_Generated_Image_6qjj8c6qjj8c6qjj.png",
        100,
        "₹1549",
        "MAK-001",
        json.dumps([{"name": "1kg", "price": "₹1349"}, {"name": "500g", "price": "₹679"}]),
    ),
    (
        "Badam",
        "बादाम",
        "₹1249",
        "1kg / 500g",
        "Premium California Almonds (Badam) — rich in nutrients and freshness guaranteed.",
        "प्रीमियम कैलिफोर्निया बादाम — पोषक तत्वों से भरपूर।",
        "/static/uploads/almonds.jpg",
        150,
        "₹1449",
        "BAD-001",
        json.dumps([{"name": "1kg", "price": "₹1249"}, {"name": "500g", "price": "₹629"}]),
    ),
    (
        "Akhrot",
        "अखरोट",
        "₹899",
        "1kg / 500g",
        "Premium quality Walnuts (Akhrot). (Note: 500g price ₹949 is as configured).",
        "उच्च गुणवत्ता अखरोट।",
        "/static/uploads/walnuts.jpg",
        100,
        "₹1049",
        "AKH-001",
        json.dumps([{"name": "1kg", "price": "₹899"}, {"name": "500g", "price": "₹949"}]),
    ),
    (
        "Kishmish",
        "किशमिश",
        "₹549",
        "1kg / 500g",
        "Premium golden raisins (Kishmish) — naturally sweet and packed with energy.",
        "उच्च गुणवत्ता किशमिश — प्राकृतिक रूप से मीठी और ऊर्जा से भरपूर।",
        "/static/uploads/raisins.jpg",
        200,
        "₹649",
        "KIS-001",
        json.dumps([{"name": "1kg", "price": "₹549"}, {"name": "500g", "price": "₹279"}]),
    ),
    (
        "Pistachio (Pista)",
        "पिस्ता (Pista)",
        "₹899",
        "500g / 1kg",
        "Premium roasted and lightly salted Iranian pistachios.",
        "प्रीमियम रोस्टेड और नमकीन ईरानी पिस्ता।",
        "/static/uploads/pistachio.jpg",
        80,
        "₹1099",
        "PIS-001",
        json.dumps([{"name": "500g", "price": "₹899"}, {"name": "1kg", "price": "₹1699"}]),
    ),
    (
        "Diwali Special Royal 4-Jar Gift Box",
        "दिवाली स्पेशल रॉयल 4-जार गिफ्ट बॉक्स",
        "₹1350",
        "Luxury Gift Box",
        "Handcrafted Royal Peacock Palace wooden gift box with 4 airtight gold glass jars filled with Cashews, Almonds, Pistachios & Kishmish.",
        "रॉयल मयूर गिफ्ट बॉक्स (4 गोल्ड ग्लास जार के साथ)।",
        "/static/uploads/diwali-gift-box.jpg",
        50,
        "₹1699",
        "DIW-001",
        json.dumps([{"name": "Royal 4-Jar Box", "price": "₹1350"}]),
    ),
]

for p in products:
    cur.execute(
        '''INSERT INTO products (name_en, name_hi, price, weight, description_en, description_hi, image, stock, old_price, sku, grades)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)''',
        p
    )
    print(f"Inserted: {p[0]}")

conn.commit()
conn.close()
print("Migration completed successfully!")
