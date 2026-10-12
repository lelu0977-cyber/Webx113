import http.server
import socketserver
import json
import sqlite3
import urllib.parse
import os
import sys

# Đảm bảo in tiếng Việt không bị lỗi encoding cp1252 trên Windows console
if sys.platform == 'win32':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
        sys.stderr.reconfigure(encoding='utf-8')
    except Exception:
        pass

PORT = 8080
DB_FILE = os.path.join(os.path.dirname(__file__), 'brain.db')

# Cấu hình tài khoản Sepay của bạn
SEPAY_CONFIG = {
    "bank": "BIDV",
    "acc_number": "8852040649",
    "acc_name": "LE THANH LONG",
    "va": "96247WFVRK"
}

def get_db():
    conn = sqlite3.connect(DB_FILE)
    conn.row_factory = sqlite3.Row
    return conn

class AppHandler(http.server.SimpleHTTPRequestHandler):
    def send_json(self, data, status=200):
        self.send_response(status)
        self.send_header('Content-Type', 'application/json; charset=utf-8')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
        self.wfile.write(json.dumps(data, ensure_ascii=False).encode('utf-8'))

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

    def do_GET(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path
        query = urllib.parse.parse_qs(parsed.query)

        # 1. Route admin
        if path == '/admin' or path == '/admin/':
            self.send_response(200)
            self.send_header('Content-Type', 'text/html; charset=utf-8')
            self.end_headers()
            with open(os.path.join(os.path.dirname(__file__), 'admin.html'), 'rb') as f:
                self.wfile.write(f.read())
            return

        # 2. Route thanh toán
        if path == '/thanh-toan' or path == '/thanh-toan/' or path == '/checkout':
            self.send_response(200)
            self.send_header('Content-Type', 'text/html; charset=utf-8')
            self.end_headers()
            with open(os.path.join(os.path.dirname(__file__), 'thanh-toan.html'), 'rb') as f:
                self.wfile.write(f.read())
            return

        # 3. API Products
        if path == '/api/products':
            conn = get_db()
            cur = conn.cursor()
            cur.execute('SELECT * FROM products ORDER BY id DESC')
            products = [dict(row) for row in cur.fetchall()]
            conn.close()
            self.send_json(products)
            return

        # 4. API Customers
        if path == '/api/customers':
            conn = get_db()
            cur = conn.cursor()
            cur.execute('SELECT * FROM customers ORDER BY id DESC')
            customers = [dict(row) for row in cur.fetchall()]
            conn.close()
            self.send_json(customers)
            return

        # 5. API Orders
        if path == '/api/orders':
            conn = get_db()
            cur = conn.cursor()
            cur.execute('SELECT * FROM orders ORDER BY id DESC')
            orders = [dict(row) for row in cur.fetchall()]
            conn.close()
            self.send_json(orders)
            return

        # 6. API Check đơn hàng theo ID hoặc Payment Code (để trang checkout polling)
        if path == '/api/order-status':
            order_id = query.get('id', [None])[0]
            payment_code = query.get('code', [None])[0]
            conn = get_db()
            cur = conn.cursor()
            if order_id:
                cur.execute('SELECT * FROM orders WHERE id = ?', (order_id,))
            elif payment_code:
                cur.execute('SELECT * FROM orders WHERE payment_code = ?', (payment_code,))
            else:
                conn.close()
                self.send_json({'error': 'Missing id or code'}, 400)
                return
            row = cur.fetchone()
            conn.close()
            if row:
                self.send_json(dict(row))
            else:
                self.send_json({'error': 'Order not found'}, 404)
            return

        # Serve static file mặc định
        return super().do_GET()

    def do_POST(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path
        length = int(self.headers.get('Content-Length', 0))
        body = self.rfile.read(length).decode('utf-8') if length > 0 else '{}'
        try:
            data = json.loads(body)
        except Exception:
            data = {}

        # 1. API Tạo Sản Phẩm
        if path == '/api/products':
            conn = get_db()
            cur = conn.cursor()
            name = data.get('name', '').strip()
            p_type = data.get('type', 'service')
            price = float(data.get('price', 0))
            desc = data.get('description', '')
            stock = data.get('stock')
            if p_type != 'physical':
                stock = None
            else:
                stock = int(stock) if stock is not None else 0

            cur.execute('INSERT INTO products (name, type, price, description, stock) VALUES (?, ?, ?, ?, ?)',
                        (name, p_type, price, desc, stock))
            conn.commit()
            new_id = cur.lastrowid
            conn.close()
            self.send_json({'success': True, 'id': new_id})
            return

        # 2. API Cập nhật Sản phẩm
        if path == '/api/products/update':
            conn = get_db()
            cur = conn.cursor()
            p_id = data.get('id')
            name = data.get('name')
            p_type = data.get('type')
            price = float(data.get('price', 0))
            desc = data.get('description')
            stock = data.get('stock')
            if p_type != 'physical':
                stock = None
            else:
                stock = int(stock) if stock is not None else 0

            cur.execute('UPDATE products SET name=?, type=?, price=?, description=?, stock=? WHERE id=?',
                        (name, p_type, price, desc, stock, p_id))
            conn.commit()
            conn.close()
            self.send_json({'success': True})
            return

        # 3. API Xóa Sản phẩm
        if path == '/api/products/delete':
            p_id = data.get('id')
            conn = get_db()
            conn.execute('DELETE FROM products WHERE id=?', (p_id,))
            conn.commit()
            conn.close()
            self.send_json({'success': True})
            return

        # 4. API Tạo Khách Hàng
        if path == '/api/customers':
            conn = get_db()
            cur = conn.cursor()
            name = data.get('name', '').strip()
            phone = data.get('phone', '').strip()
            zalo = data.get('zalo', '').strip() or phone
            cur.execute('INSERT OR REPLACE INTO customers (name, phone, zalo) VALUES (?, ?, ?)',
                        (name, phone, zalo))
            conn.commit()
            new_id = cur.lastrowid
            conn.close()
            self.send_json({'success': True, 'id': new_id})
            return

        # 5. API Xóa Khách Hàng
        if path == '/api/customers/delete':
            c_id = data.get('id')
            conn = get_db()
            conn.execute('DELETE FROM customers WHERE id=?', (c_id,))
            conn.commit()
            conn.close()
            self.send_json({'success': True})
            return

        # 6. API Tạo Đơn Hàng Mới (từ Checkout hoặc từ Admin)
        if path == '/api/orders':
            conn = get_db()
            cur = conn.cursor()

            name = data.get('customer_name', '').strip()
            phone = data.get('customer_phone', '').strip()
            product_id = data.get('product_id')
            product_name = data.get('product_name')
            amount = float(data.get('amount', 0))
            status = data.get('status', 'pending')

            # Tự động lưu khách hàng vào CRM nếu chưa có
            cur.execute('INSERT OR IGNORE INTO customers (name, phone, zalo) VALUES (?, ?, ?)', (name, phone, phone))
            cur.execute('SELECT id FROM customers WHERE phone = ?', (phone,))
            cust_row = cur.fetchone()
            cust_id = cust_row['id'] if cust_row else None

            # Lấy thông tin sản phẩm và kiểm tra trừ kho
            if product_id:
                cur.execute('SELECT * FROM products WHERE id = ?', (product_id,))
                prod = cur.fetchone()
                if prod:
                    product_name = prod['name']
                    if amount <= 0:
                        amount = prod['price']
                    # QUY TẮC SOP: Chỉ tự động trừ số lượng còn lại nếu là sản phẩm vật lý (physical)
                    if prod['type'] == 'physical' and prod['stock'] is not None:
                        new_stock = max(0, prod['stock'] - 1)
                        cur.execute('UPDATE products SET stock = ? WHERE id = ?', (new_stock, prod['id']))

            # Tạo mã thanh toán duy nhất cho Sepay (ví dụ: DH1234)
            import random
            payment_code = f"DH{random.randint(10000, 99999)}"

            cur.execute('''
                INSERT INTO orders (customer_id, product_id, customer_name, customer_phone, product_name, amount, status, payment_code)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            ''', (cust_id, product_id, name, phone, product_name, amount, status, payment_code))

            order_id = cur.lastrowid
            conn.commit()
            conn.close()

            # Tạo link QR Sepay VietQR chuẩn
            # Dùng số tài khoản BIDV hoặc số VA
            account = SEPAY_CONFIG['acc_number']
            bank = SEPAY_CONFIG['bank']
            qr_url = f"https://qr.sepay.vn/img?bank={bank}&acc={account}&template=compact&amount={int(amount)}&des={payment_code}"

            self.send_json({
                'success': True,
                'order_id': order_id,
                'payment_code': payment_code,
                'amount': amount,
                'qr_url': qr_url,
                'bank': bank,
                'account': account,
                'account_name': SEPAY_CONFIG['acc_name']
            })
            return

        # 7. API Đổi Trạng Thái Đơn Hàng (Xử lý thủ công sang Success / Cancel)
        if path == '/api/orders/update-status':
            order_id = data.get('id')
            new_status = data.get('status')
            conn = get_db()
            conn.execute('UPDATE orders SET status = ? WHERE id = ?', (new_status, order_id))
            conn.commit()
            conn.close()
            self.send_json({'success': True})
            return

        # 8. API Xóa Đơn Hàng
        if path == '/api/orders/delete':
            order_id = data.get('id')
            conn = get_db()
            conn.execute('DELETE FROM orders WHERE id=?', (order_id,))
            conn.commit()
            conn.close()
            self.send_json({'success': True})
            return

        # 9. WEBHOOK NHẬN TIỀN TỰ ĐỘNG TỪ SEPAY
        if path == '/api/sepay-webhook':
            # SePay gửi dữ liệu biến động số dư dạng JSON:
            # { "content": "DH12345 ...", "transferAmount": 2000, "gateway": "BIDV", ... }
            content = data.get('content', '') or data.get('description', '')
            transfer_amount = float(data.get('transferAmount', 0) or data.get('amountIn', 0) or 0)

            print(f"[SEPAY_WEBHOOK] Nhận giao dịch: Số tiền={transfer_amount}, Nội dung={content}")

            conn = get_db()
            cur = conn.cursor()
            # Tìm xem có mã thanh toán DHxxxxx nào trong nội dung chuyển khoản không
            cur.execute("SELECT id, payment_code, amount, status FROM orders WHERE status = 'pending'")
            pending_orders = cur.fetchall()

            matched = False
            for order in pending_orders:
                code = order['payment_code']
                if code and code.upper() in content.upper():
                    # Đã khớp mã đơn hàng!
                    cur.execute("UPDATE orders SET status = 'success' WHERE id = ?", (order['id'],))
                    conn.commit()
                    print(f"==> ĐÃ KHỚP ĐƠN HÀNG #{order['id']} ({code})! Cập nhật sang SUCCESS.")
                    matched = True
                    break

            conn.close()
            self.send_json({'success': True, 'matched': matched})
            return

        self.send_json({'error': 'Not found'}, 404)

if __name__ == '__main__':
    os.chdir(os.path.dirname(__file__))
    with socketserver.TCPServer(("", PORT), AppHandler) as httpd:
        print(f"Server đang chạy tại http://localhost:{PORT}")
        print(f"Trang Admin: http://localhost:{PORT}/admin")
        print(f"Trang Thanh Toán: http://localhost:{PORT}/thanh-toan")
        httpd.serve_forever()
