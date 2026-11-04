import os
import sys
import json
import re
import tempfile
import pytest

sys.path.insert(0, os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'jainzee-website'))

os.environ['ADMIN_PASSWORD'] = 'test-admin-pass-123'
os.environ.setdefault('SECRET_KEY', 'test-secret-key-for-pytest-only-32chars')

@pytest.fixture()
def client(monkeypatch):
    tmpdir = tempfile.mkdtemp(prefix='jainzee-req-')
    db_path = os.path.join(tmpdir, 'test.db')
    monkeypatch.setenv('JAINZEE_DB_PATH', db_path)
    import importlib
    import app as app_module
    importlib.reload(app_module)
    app_module.app.config['TESTING'] = True
    with app_module.app.test_client() as c:
        yield app_module, c
    if os.path.exists(db_path):
        try:
            os.remove(db_path)
        except Exception:
            pass

def test_cod_has_zero_discount(client):
    """Verify that COD orders receive ZERO discount even when global discount is set."""
    app, c = client
    conn = app.get_db()
    conn.execute("INSERT OR REPLACE INTO settings (key, value) VALUES ('global_discount_percent', '15')")
    conn.commit()
    conn.close()

    # Add item to cart
    r_cart = c.post('/api/cart', json={'product_id': 1, 'quantity': 1, 'grade_index': 0})
    assert r_cart.status_code == 200

    # Checkout with COD
    r = c.post('/api/checkout', json={
        'name': 'Ramesh Kumar',
        'phone': '9876543210',
        'address': 'Palasia Square, Indore',
        'payment_method': 'cod',
    })
    assert r.status_code == 200, r.get_data(as_text=True)
    data = r.get_json()
    order_id = data['order_id']

    conn = app.get_db()
    order = conn.execute('SELECT * FROM orders WHERE id=?', (order_id,)).fetchone()
    conn.close()

    # Discount amount must be 0 for COD
    assert float(order['discount_amount']) == 0.0, f"Expected 0 discount for COD, got {order['discount_amount']}"

def test_whatsapp_notification_destination(client, monkeypatch):
    """Verify WhatsApp notification triggers with recipient +91 7649848584"""
    app, c = client
    assert app.WHATSAPP_NOTIFY_NUMBER == '917649848584'

    wa_calls = []
    def fake_send(order_id, customer_name, customer_phone, customer_address, items_snapshot,
                  subtotal, discount, shipping, total, payment_method, coupon_code=''):
        wa_calls.append({
            'order_id': order_id,
            'customer_name': customer_name,
            'phone': customer_phone,
            'payment_method': payment_method,
            'total': total,
        })

    monkeypatch.setattr(app, '_send_whatsapp_order_notification', fake_send)

    r_cart = c.post('/api/cart', json={'product_id': 1, 'quantity': 1})
    assert r_cart.status_code == 200

    r = c.post('/api/checkout', json={
        'name': 'Pooja Jain',
        'phone': '9123456780',
        'address': '56 Dukan, Indore',
        'payment_method': 'cod',
    })
    assert r.status_code == 200
    assert len(wa_calls) == 1
    assert wa_calls[0]['customer_name'] == 'Pooja Jain'
    assert wa_calls[0]['payment_method'] == 'cod'

def test_cashew_has_all_8_grades_with_1kg_and_500g(client):
    """Verify Cashew is a single base product with all 8 grades selectable in 1kg and 500g."""
    app, c = client
    conn = app.get_db()
    row = conn.execute("SELECT name_en, grades FROM products WHERE name_en LIKE '%Cashew%'").fetchone()
    conn.close()

    assert row is not None
    grades = json.loads(row['grades'])
    grade_dict = {g['name']: int(float(re.sub(r'[^\d.]', '', str(g['price'])))) for g in grades}

    expected_cashew_prices = {
        'W400 (1kg)': 879,
        'W400 (500g)': 499,
        'Wmix (1kg)': 899,
        'Wmix (500g)': 455,
        'W320 (1kg)': 949,
        'W320 (500g)': 479,
        'W260 (1kg)': 999,
        'W260 (500g)': 501,
        'W240 (1kg)': 1030,
        'W240 (500g)': 519,
        'W210 Jumbo (1kg)': 1099,
        'W210 Jumbo (500g)': 499,
        'JK Grade (1kg)': 879,
        'JK Grade (500g)': 449,
        'JH Split (1kg)': 920,
        'JH Split (500g)': 469,
    }

    for name, expected_price in expected_cashew_prices.items():
        assert name in grade_dict, f"Missing cashew grade option: {name}"
        assert grade_dict[name] == expected_price, f"Wrong price for {name}: expected {expected_price}, got {grade_dict[name]}"

def test_other_products_pricing(client):
    """Verify Makhana, Badam, Akhrot, Kishmish pricing."""
    app, c = client
    conn = app.get_db()
    rows = conn.execute("SELECT name_en, grades FROM products").fetchall()
    conn.close()

    p_map = {r['name_en']: json.loads(r['grades']) for r in rows}

    # Makhana
    m_grades = {g['name']: int(float(re.sub(r'[^\d.]', '', str(g['price'])))) for g in p_map.get('Makhana', [])}
    assert m_grades.get('1kg') == 1349
    assert m_grades.get('500g') == 679

    # Badam
    b_grades = {g['name']: int(float(re.sub(r'[^\d.]', '', str(g['price'])))) for g in p_map.get('Badam', [])}
    assert b_grades.get('1kg') == 1249
    assert b_grades.get('500g') == 629

    # Akhrot
    a_grades = {g['name']: int(float(re.sub(r'[^\d.]', '', str(g['price'])))) for g in p_map.get('Akhrot', [])}
    assert a_grades.get('1kg') == 899
    assert a_grades.get('500g') == 949

    # Kishmish
    k_grades = {g['name']: int(float(re.sub(r'[^\d.]', '', str(g['price'])))) for g in p_map.get('Kishmish', [])}
    assert k_grades.get('1kg') == 549
    assert k_grades.get('500g') == 279


def test_api_products_returns_all_16_cashew_grades_and_all_7_products(client):
    """Verify public /api/products returns all 7 canonical products and Cashew has all 16 grades."""
    app, c = client
    res = c.get('/api/products')
    assert res.status_code == 200
    data = res.get_json()
    assert len(data) >= 7

    names = [p['name_en'] for p in data]
    assert any('Cashew' in n for n in names)
    assert 'Makhana' in names
    assert 'Badam' in names
    assert 'Akhrot' in names
    assert 'Kishmish' in names

    cashew = next(p for p in data if 'Cashew' in p['name_en'])
    grades = json.loads(cashew['grades']) if isinstance(cashew['grades'], str) else cashew['grades']
    assert len(grades) == 16, f"Expected 16 cashew grades, got {len(grades)}"

def test_admin_can_save_product_without_csrf_blocking(client):
    """Verify that logged-in admin can update products via PUT /admin/api/products/<id> successfully."""
    app, c = client
    with c.session_transaction() as sess:
        sess['admin_logged_in'] = True
        sess['admin_user'] = 'admin'

    conn = app.get_db()
    first_prod = conn.execute("SELECT id FROM products LIMIT 1").fetchone()
    conn.close()
    pid = first_prod['id']

    res = c.put(f'/admin/api/products/{pid}', json={
        'name_en': 'Updated Product Test',
        'name_hi': 'टेस्ट प्रोडक्ट',
        'price': '₹999',
        'stock': 123,
        'grades': [{'name': '1kg', 'price': '₹999'}]
    })
    assert res.status_code == 200
    assert res.get_json().get('success') is True
