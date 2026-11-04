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

def test_products_have_1kg_and_500g_variants(client):
    """Verify all products seeded in database have both 1kg and 500g selectable grades."""
    app, c = client
    conn = app.get_db()
    rows = conn.execute('SELECT name_en, grades FROM products').fetchall()
    conn.close()

    expected_prices = {
        'Cashew W400': {'1kg': 879, '500g': 499},
        'Cashew Wmix': {'1kg': 899, '500g': 455},
        'Cashew W320': {'1kg': 949, '500g': 479},
        'Cashew W260': {'1kg': 999, '500g': 501},
        'Cashew W240': {'1kg': 1030, '500g': 519},
        'Cashew W210': {'1kg': 1099, '500g': 499},
        'Cashew Jk': {'1kg': 879, '500g': 449},
        'Cashew Jh': {'1kg': 920, '500g': 469},
        'Makhana': {'1kg': 1349, '500g': 679},
        'Kishmish': {'1kg': 549, '500g': 279},
        'Badam': {'1kg': 1249, '500g': 629},
        'Akhrot': {'1kg': 899, '500g': 949},
    }

    found_names = set()
    for row in rows:
        name = row['name_en']
        if name in expected_prices:
            found_names.add(name)
            grades = json.loads(row['grades'])
            grade_dict = {g['name']: int(float(re.sub(r'[^\d.]', '', str(g['price'])))) for g in grades}
            assert '1kg' in grade_dict, f"{name} missing 1kg grade"
            assert '500g' in grade_dict, f"{name} missing 500g grade"
            assert grade_dict['1kg'] == expected_prices[name]['1kg']
            assert grade_dict['500g'] == expected_prices[name]['500g']

    assert len(found_names) == 12, f"Expected 12 products, found {len(found_names)}"
