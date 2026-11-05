"""Apply the requested catalogue once, retaining product IDs and later admin edits."""
import json

MIGRATION_KEY = 'catalog_prices_2026_11_04'


def apply_catalog_update(cur):
    if cur.execute('SELECT value FROM settings WHERE key=?', (MIGRATION_KEY,)).fetchone():
        return
    cashews = [
        ('W400', 879, 499), ('Wmix', 899, 455), ('W320', 949, 479),
        ('W260', 999, 501), ('W240', 1030, 519), ('W210 Jumbo', 1099, 499),
        ('JK Grade', 879, 449), ('JH Split', 920, 469),
    ]
    cashew_grades = [
        {'name': f'{name} ({pack})', 'price': f'₹{price}'}
        for name, kg, half in cashews for pack, price in [('1kg', kg), ('500g', half)]
    ]
    specifications = [
        (('CAS-001',), 'Premium Cashew (Kaju)', cashew_grades, None),
        (('MAK-001',), 'Makhana', [(1000, 1349), (500, 679)],
         '/static/uploads/Gemini_Generated_Image_6qjj8c6qjj8c6qjj.png'),
        (('BAD-001', 'ALM-001'), 'Badam', [(1000, 1249), (500, 629)], None),
        (('AKH-001', 'WAL-001'), 'Akhrot', [(1000, 899), (500, 449)], None),
        (('KIS-001', 'RAI-001'), 'Kishmish', [(1000, 549), (500, 279)], None),
    ]
    for skus, name, prices, image in specifications:
        grades = prices if isinstance(prices[0], dict) else [
            {'name': '1kg' if grams == 1000 else '500g', 'price': f'₹{price}'}
            for grams, price in prices
        ]
        placeholders = ','.join('?' for _ in skus)
        cur.execute(
            f'UPDATE products SET grades=?, price=? WHERE sku IN ({placeholders}) OR name_en=?',
            (json.dumps(grades, ensure_ascii=False), grades[0]['price'], *skus, name),
        )
        if image:
            cur.execute(f'UPDATE products SET image=? WHERE sku IN ({placeholders}) OR name_en=?',
                        (image, *skus, name))

    cur.execute(
        'UPDATE products SET description_en=REPLACE(description_en, ?, ?) WHERE sku IN (?, ?)',
        (' NOTE: 500g price (₹949) exceeds 1kg price (₹899) as specified.', '', 'AKH-001', 'WAL-001'),
    )

    # Repair only the broken built-in paths; retain uploaded/custom photographs.
    for old, new in [
        ('cashew.jpg', 'cashew.jpeg'), ('almonds.jpg', 'almonds.webp'),
        ('walnuts.jpg', 'walnuts.webp'), ('raisins.jpg', 'raisins.webp'),
        ('pistachio.jpg', 'pistachio.webp'), ('diwali-gift-box.jpg', 'diwali-gift-box.jpg'),
    ]:
        cur.execute('UPDATE products SET image=? WHERE image=?',
                    (f'/images/{new}', f'/static/uploads/{old}'))
    cur.execute("INSERT OR IGNORE INTO settings (key, value) VALUES (?, '1')", (MIGRATION_KEY,))
