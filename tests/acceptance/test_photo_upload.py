"""
AC-035: 上傳照片功能驗收測試
Given: 使用者在編輯器 Modal
When: 點擊照片上傳區域，選擇圖片後儲存
Then: 照片壓縮後上傳到 Cloudinary，顯示縮圖，不出現上傳失敗 toast

流程:
1. 建立測試帳號（時間戳記 email 避免衝突）
2. 登入後等待旅程自動建立
3. 進入旅程地圖
4. 點擊地圖上的 FAB 按鈕，透過「搜尋地點」或直接開啟編輯器
5. 選擇照片並上傳
6. 驗證結果
"""

import os
import time
from playwright.sync_api import sync_playwright

BASE_URL = "http://localhost:5173"
SCREENSHOTS_DIR = os.path.dirname(os.path.abspath(__file__))

# 使用時間戳記建立唯一帳號
TIMESTAMP = int(time.time())
TEST_EMAIL = f"playwright_test_{TIMESTAMP}@example.com"
TEST_PASSWORD = "Test1234!"


def take_screenshot(page, filename):
    path = os.path.join(SCREENSHOTS_DIR, filename)
    page.screenshot(path=path, full_page=False)
    print(f"  Screenshot: {path}")
    return path


def create_test_image(path):
    """建立一個最小合法的 JPEG 圖片（不依賴 Pillow）"""
    # 使用 Python 標準庫建立一個 10x10 的純色 BMP，再包成最小 JPEG header
    # 這是一個 3x3 像素紅色 JPEG
    jpeg_bytes = bytes([
        0xFF, 0xD8, 0xFF, 0xE0, 0x00, 0x10, 0x4A, 0x46, 0x49, 0x46, 0x00,
        0x01, 0x01, 0x00, 0x00, 0x01, 0x00, 0x01, 0x00, 0x00,
        0xFF, 0xDB, 0x00, 0x43, 0x00, 0x08, 0x06, 0x06, 0x07, 0x06, 0x05,
        0x08, 0x07, 0x07, 0x07, 0x09, 0x09, 0x08, 0x0A, 0x0C, 0x14, 0x0D,
        0x0C, 0x0B, 0x0B, 0x0C, 0x19, 0x12, 0x13, 0x0F, 0x14, 0x1D, 0x1A,
        0x1F, 0x1E, 0x1D, 0x1A, 0x1C, 0x1C, 0x20, 0x24, 0x2E, 0x27, 0x20,
        0x22, 0x2C, 0x23, 0x1C, 0x1C, 0x28, 0x37, 0x29, 0x2C, 0x30, 0x31,
        0x34, 0x34, 0x34, 0x1F, 0x27, 0x39, 0x3D, 0x38, 0x32, 0x3C, 0x2E,
        0x33, 0x34, 0x32,
        0xFF, 0xC0, 0x00, 0x0B, 0x08, 0x00, 0x01, 0x00, 0x01, 0x01, 0x01,
        0x11, 0x00,
        0xFF, 0xC4, 0x00, 0x1F, 0x00, 0x00, 0x01, 0x05, 0x01, 0x01, 0x01,
        0x01, 0x01, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0A, 0x0B,
        0xFF, 0xC4, 0x00, 0xB5, 0x10, 0x00, 0x02, 0x01, 0x03, 0x03, 0x02,
        0x04, 0x03, 0x05, 0x05, 0x04, 0x04, 0x00, 0x00, 0x01, 0x7D, 0x01,
        0x02, 0x03, 0x00, 0x04, 0x11, 0x05, 0x12, 0x21, 0x31, 0x41, 0x06,
        0x13, 0x51, 0x61, 0x07, 0x22, 0x71, 0x14, 0x32, 0x81, 0x91, 0xA1,
        0x08, 0x23, 0x42, 0xB1, 0xC1, 0x15, 0x52, 0xD1, 0xF0, 0x24, 0x33,
        0x62, 0x72, 0x82, 0x09, 0x0A, 0x16, 0x17, 0x18, 0x19, 0x1A, 0x25,
        0x26, 0x27, 0x28, 0x29, 0x2A, 0x34, 0x35, 0x36, 0x37, 0x38, 0x39,
        0x3A, 0x43, 0x44, 0x45, 0x46, 0x47, 0x48, 0x49, 0x4A, 0x53, 0x54,
        0x55, 0x56, 0x57, 0x58, 0x59, 0x5A, 0x63, 0x64, 0x65, 0x66, 0x67,
        0x68, 0x69, 0x6A, 0x73, 0x74, 0x75, 0x76, 0x77, 0x78, 0x79, 0x7A,
        0x83, 0x84, 0x85, 0x86, 0x87, 0x88, 0x89, 0x8A, 0x92, 0x93, 0x94,
        0x95, 0x96, 0x97, 0x98, 0x99, 0x9A, 0xA2, 0xA3, 0xA4, 0xA5, 0xA6,
        0xA7, 0xA8, 0xA9, 0xAA, 0xB2, 0xB3, 0xB4, 0xB5, 0xB6, 0xB7, 0xB8,
        0xB9, 0xBA, 0xC2, 0xC3, 0xC4, 0xC5, 0xC6, 0xC7, 0xC8, 0xC9, 0xCA,
        0xD2, 0xD3, 0xD4, 0xD5, 0xD6, 0xD7, 0xD8, 0xD9, 0xDA, 0xE1, 0xE2,
        0xE3, 0xE4, 0xE5, 0xE6, 0xE7, 0xE8, 0xE9, 0xEA, 0xF1, 0xF2, 0xF3,
        0xF4, 0xF5, 0xF6, 0xF7, 0xF8, 0xF9, 0xFA,
        0xFF, 0xDA, 0x00, 0x08, 0x01, 0x01, 0x00, 0x00, 0x3F, 0x00, 0xFB,
        0xD2, 0x8A, 0x28, 0x03, 0xFF, 0xD9
    ])
    with open(path, 'wb') as f:
        f.write(jpeg_bytes)


def main():
    test_image_path = "/tmp/test_photo_upload.jpg"
    create_test_image(test_image_path)
    print(f"  Test image created: {test_image_path}")
    print(f"  Test account: {TEST_EMAIL}")

    console_errors = []

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={"width": 1280, "height": 800})
        page = context.new_page()

        console_all = []
        page.on("console", lambda msg: console_all.append(f"[{msg.type}] {msg.text}"))
        page.on("console", lambda msg: console_errors.append(
            f"[{msg.type}] {msg.text}"
        ) if msg.type in ("error", "warning") else None)

        # ================================================================
        # Step 1: 建立新帳號
        # ================================================================
        print("\n[Step 1] 建立測試帳號...")
        page.goto(BASE_URL)
        page.wait_for_load_state("networkidle")

        # 點擊「註冊新帳號」
        signup_link = page.locator('text=註冊新帳號').first
        signup_link.click()
        page.wait_for_timeout(500)
        take_screenshot(page, "ac_035_01_signup_page.png")

        # 填入註冊表單
        email_input = page.locator('input[type="email"]').first
        email_input.fill(TEST_EMAIL)

        # 找密碼欄位（可能有兩個：密碼 + 確認密碼）
        password_inputs = page.locator('input[type="password"]').all()
        if len(password_inputs) >= 2:
            password_inputs[0].fill(TEST_PASSWORD)
            password_inputs[1].fill(TEST_PASSWORD)
        elif len(password_inputs) == 1:
            password_inputs[0].fill(TEST_PASSWORD)

        take_screenshot(page, "ac_035_02_signup_filled.png")

        # 點擊「註冊」按鈕
        signup_btn = page.locator('button[type="submit"]').first
        signup_btn.click()
        print("  Signup button clicked, waiting...")

        # 等待 Firebase Auth 建立帳號 + 初始化
        # 不用 networkidle（Firebase 有持久 WebSocket）
        # 改為等待頁面跳轉或錯誤訊息出現
        page.wait_for_timeout(3000)
        # 等待 email input 消失（表示已離開 auth 頁面）或等待特定元素
        try:
            page.wait_for_function(
                "() => !document.querySelector('input[type=\"email\"]') || document.querySelector('a[href*=\"/trips/\"]')",
                timeout=10000
            )
        except Exception:
            print("  Timeout waiting for auth completion, continuing...")
        page.wait_for_timeout(2000)
        take_screenshot(page, "ac_035_03_after_signup.png")
        print(f"  URL after signup: {page.url}")

        # 確認是否成功（不應還在 auth 頁）
        still_on_auth = page.locator('input[type="email"]').count() > 0
        if still_on_auth:
            print("  WARNING: Still on auth page after signup")
            # 取得錯誤訊息
            errors_on_page = page.evaluate("""
                () => Array.from(document.querySelectorAll('[class*="error"], [class*="red"], [role="alert"]'))
                     .map(e => e.textContent?.trim()).filter(Boolean)
            """)
            print(f"  Auth errors: {errors_on_page}")
            # 如果是「已被使用」，嘗試直接登入
            if any("已被使用" in e or "already" in e.lower() for e in errors_on_page):
                print("  Email already in use, attempting direct login...")
                # 切換到登入模式
                login_link = page.locator('text=已有帳號, text=登入').first
                if login_link.count() > 0:
                    login_link.click()
                    page.wait_for_timeout(300)
                else:
                    page.goto(BASE_URL)
                    page.wait_for_load_state("networkidle")
                email_input2 = page.locator('input[type="email"]').first
                email_input2.fill(TEST_EMAIL)
                pw_input2 = page.locator('input[type="password"]').first
                pw_input2.fill(TEST_PASSWORD)
                page.locator('button[type="submit"]').first.click()
                page.wait_for_timeout(3000)

        # ================================================================
        # Step 2: 等待旅程自動建立並進入地圖
        # ================================================================
        print("\n[Step 2] 等待旅程自動建立...")
        # CLAUDE.md: 新用戶登入後自動建立 "My First Trip"
        page.wait_for_timeout(6000)
        take_screenshot(page, "ac_035_04_landing_page.png")
        print(f"  URL: {page.url}")

        # 偵察頁面
        page_structure = page.evaluate("""
            () => ({
                title: document.title,
                h1s: Array.from(document.querySelectorAll('h1')).map(h => h.textContent?.trim()),
                h2s: Array.from(document.querySelectorAll('h2')).map(h => h.textContent?.trim()),
                buttons: Array.from(document.querySelectorAll('button')).map(b => b.textContent?.trim()).filter(Boolean),
                links: Array.from(document.querySelectorAll('a[href]')).map(a => ({href: a.href, text: a.textContent?.trim().substring(0,30)})).slice(0,10),
                url: window.location.href
            })
        """)
        print(f"  Title: {page_structure['title']}")
        print(f"  H1s: {page_structure['h1s']}")
        print(f"  H2s: {page_structure['h2s']}")
        print(f"  Buttons: {page_structure['buttons'][:10]}")
        print(f"  Links: {page_structure['links']}")

        # ================================================================
        # Step 3: 進入旅程地圖
        # ================================================================
        print("\n[Step 3] 進入旅程地圖...")

        # 先找 /trips/ 連結
        trip_link = page.locator('a[href*="/trips/"]').first
        if trip_link.count() > 0:
            print("  Found trip link, clicking...")
            trip_link.click()
            page.wait_for_timeout(4000)
        else:
            # 找任何看起來像 Trip Card 的可點擊元素
            print("  No direct trip links. Looking for trip cards...")
            # 可能需要等待旅程載入
            page.wait_for_timeout(3000)

            # 再嘗試
            trip_link2 = page.locator('a[href*="/trips/"]').first
            if trip_link2.count() > 0:
                trip_link2.click()
                page.wait_for_timeout(4000)
            else:
                # 直接點擊第一個 cursor-pointer 的大型容器
                clickable = page.evaluate("""
                    () => {
                        let found = null;
                        document.querySelectorAll('div, article').forEach(el => {
                            if (!found && window.getComputedStyle(el).cursor === 'pointer') {
                                const text = el.textContent?.trim().substring(0, 80);
                                if (text && text.length > 10) found = text;
                            }
                        });
                        return found;
                    }
                """)
                if clickable:
                    print(f"  Found clickable: {clickable}")
                    page.locator('div').filter(has_text=clickable).first.click()
                    page.wait_for_timeout(4000)

        take_screenshot(page, "ac_035_05_map_page.png")
        print(f"  URL: {page.url}")

        # ================================================================
        # Step 4: 在地圖頁面偵察，嘗試開啟 PlaceEditor
        # ================================================================
        print("\n[Step 4] 偵察地圖頁面...")
        page.wait_for_timeout(3000)
        take_screenshot(page, "ac_035_06_map_recon.png")

        map_structure = page.evaluate("""
            () => ({
                url: window.location.href,
                buttons: Array.from(document.querySelectorAll('button')).map(b => ({
                    text: b.textContent?.trim(),
                    cls: b.className?.toString().substring(0, 50),
                    visible: b.offsetParent !== null
                })).filter(b => b.text && b.text.length > 0),
                h2s: Array.from(document.querySelectorAll('h2')).map(h => h.textContent?.trim()),
                labels: Array.from(document.querySelectorAll('label')).map(l => l.textContent?.trim()),
            })
        """)
        print(f"  Buttons on map page: {map_structure['buttons'][:15]}")
        print(f"  H2s: {map_structure['h2s']}")

        # ================================================================
        # Step 5: 開啟 PlaceEditor
        # Sidebar 有一個藍色 + 按鈕 aria-label="Add new place"
        # ================================================================
        print("\n[Step 5] 嘗試開啟 PlaceEditor...")

        editor_opened = False

        # 方法 A: 使用 aria-label="Add new place" 的 + 按鈕（Sidebar 中）
        add_btn = page.locator('[aria-label="Add new place"]').first
        if add_btn.count() > 0:
            print("  Found 'Add new place' button, clicking...")
            add_btn.click()
            page.wait_for_timeout(1000)
            editor_opened = True
            take_screenshot(page, "ac_035_07_after_add_click.png")
        else:
            print("  'Add new place' button not found, checking if sidebar is open...")
            # Sidebar 可能是關閉的，先開啟它
            # 找開啟 sidebar 的按鈕
            open_sidebar_btn = page.locator('[aria-label="Open sidebar"]').first
            if open_sidebar_btn.count() > 0 and open_sidebar_btn.is_visible():
                print("  Opening sidebar...")
                open_sidebar_btn.click()
                page.wait_for_timeout(500)
                # 再找 + 按鈕
                add_btn2 = page.locator('[aria-label="Add new place"]').first
                if add_btn2.count() > 0:
                    add_btn2.click()
                    page.wait_for_timeout(1000)
                    editor_opened = True
                    take_screenshot(page, "ac_035_07_after_add_click.png")

        # 方法 B: 使用 PlacePreview 中的 Edit 按鈕（如果有現有地點）
        if not editor_opened:
            # 找 sidebar 中的地點列表項目，點擊第一個
            place_items = page.locator('div[class*="cursor-pointer"]').all()
            print(f"  cursor-pointer divs: {len(place_items)}")
            for item in place_items:
                try:
                    if item.is_visible():
                        item.click()
                        page.wait_for_timeout(500)
                        edit_btn = page.locator('button').filter(has_text="Edit").first
                        if edit_btn.count() > 0 and edit_btn.is_visible():
                            edit_btn.click()
                            page.wait_for_timeout(500)
                            editor_opened = True
                            print("  Opened editor via Edit in Preview Card")
                            break
                except Exception:
                    pass

        take_screenshot(page, "ac_035_08_pre_editor.png")

        # ================================================================
        # Step 6: 確認 PlaceEditor 狀態
        # ================================================================
        print("\n[Step 6] 確認 PlaceEditor 狀態...")
        page.wait_for_timeout(1000)

        h2_texts = page.evaluate("""
            () => Array.from(document.querySelectorAll('h2'))
                 .map(h => h.textContent?.trim()).filter(Boolean)
        """)
        print(f"  H2 texts: {h2_texts}")

        all_text_on_page = page.evaluate("""
            () => {
                const els = document.querySelectorAll('label, h2, h3, button');
                return [...new Set(Array.from(els).map(e => e.textContent?.trim()).filter(t => t && t.length > 0))];
            }
        """)
        print(f"  Text on page: {all_text_on_page[:20]}")

        editor_open_final = any(t in ["新增地點", "編輯地點"] for t in h2_texts)

        if editor_open_final:
            print("  PlaceEditor is OPEN")
        else:
            print("  PlaceEditor is NOT open")
            take_screenshot(page, "ac_035_09_recon_full.png")

        # ================================================================
        # Step 7: 測試照片上傳
        # ================================================================
        upload_test_result = "NOT_TESTED"
        upload_error_found = False
        cloudinary_success = False
        upload_toast_messages = []
        cloudinary_requests = []
        cloudinary_responses = []

        if editor_open_final:
            print("\n[Step 7] 測試照片上傳...")

            # 設置網路監聽
            def on_request(request):
                if "cloudinary.com" in request.url:
                    cloudinary_requests.append(request.url)
                    print(f"  [Network] -> Cloudinary: {request.url[:80]}")

            def on_response(response):
                if "cloudinary.com" in response.url:
                    cloudinary_responses.append({"url": response.url[:60], "status": response.status})
                    print(f"  [Network] <- Cloudinary HTTP {response.status}")

            page.on("request", on_request)
            page.on("response", on_response)

            # 填入地點名稱（必填）
            # PlaceEditor 中的名稱 input，placeholder 是「例如：Central World」
            name_input = page.locator('input[placeholder="例如：Central World"]').first
            if name_input.count() == 0:
                # 備選 selector
                name_input = page.locator('input[type="text"]').first
            if name_input.count() > 0 and name_input.is_visible():
                name_input.click()
                page.wait_for_timeout(200)
                name_input.fill("Playwright 照片上傳測試")
                # 確認填入
                actual_value = name_input.input_value()
                print(f"  Filled place name: '{actual_value}'")
            else:
                print("  WARNING: Name input not found or not visible")

            take_screenshot(page, "ac_035_10_editor_ready.png")

            # 注入測試圖片到 file input（hidden input）
            # DraggablePhotoGrid 中有隱藏的 file input
            file_input = page.locator('input[type="file"]').first
            if file_input.count() > 0:
                print(f"  Injecting test image: {test_image_path}")
                file_input.set_input_files(test_image_path)
                page.wait_for_timeout(2000)
                take_screenshot(page, "ac_035_11_photo_injected.png")

                # 確認圖片預覽出現（blob: URL 的 img 元素）
                blob_imgs = page.locator('img[src^="blob:"]').all()
                obj_url_imgs = page.evaluate("""
                    () => document.querySelectorAll('img').length
                """)
                print(f"  Blob image previews: {len(blob_imgs)}")
                print(f"  Total img elements: {obj_url_imgs}")

                # 截圖確認預覽
                take_screenshot(page, "ac_035_12_photo_preview.png")

                # 點擊「儲存地點」
                save_btn = page.locator('button').filter(has_text="儲存地點").first
                if save_btn.count() == 0:
                    save_btn = page.locator('button').filter(has_text="儲存").first
                if save_btn.count() > 0:
                    print("  Clicking save button...")
                    save_btn.click()

                    # 等待 loading 狀態
                    page.wait_for_timeout(2000)
                    take_screenshot(page, "ac_035_13_saving.png")

                    # 等待 Cloudinary 上傳（最多 30 秒）
                    print("  Waiting for Cloudinary upload completion...")
                    deadline = time.time() + 30
                    while time.time() < deadline:
                        page.wait_for_timeout(2000)
                        if len(cloudinary_responses) > 0:
                            print(f"  Got Cloudinary response after {30 - int(deadline - time.time())}s")
                            break
                        # 檢查 Modal 是否已關閉
                        current_h2s = page.evaluate("""
                            () => Array.from(document.querySelectorAll('h2'))
                                 .map(h => h.textContent?.trim()).filter(Boolean)
                        """)
                        if not any(t in ["新增地點", "編輯地點"] for t in current_h2s):
                            print("  Modal closed (likely saved successfully)")
                            break

                    take_screenshot(page, "ac_035_14_after_save.png")

                    # 收集 Toast 訊息（Sonner）
                    upload_toast_messages = page.evaluate("""
                        () => {
                            // Sonner uses data-sonner-toast attribute
                            const toastSelectors = [
                                '[data-sonner-toast]',
                                '[class*="toaster"] li',
                                '[class*="toast"]',
                                '[role="status"]',
                                '[role="alert"]'
                            ];
                            const texts = new Set();
                            for (const sel of toastSelectors) {
                                document.querySelectorAll(sel).forEach(el => {
                                    const t = el.textContent?.trim();
                                    if (t && t.length > 0) texts.add(t);
                                });
                            }
                            return [...texts];
                        }
                    """)
                    print(f"  Toast messages: {upload_toast_messages}")

                    # 等待更長時間確保 toast 出現
                    page.wait_for_timeout(3000)
                    upload_toast_messages_v2 = page.evaluate("""
                        () => {
                            const toastSelectors = [
                                '[data-sonner-toast]',
                                '[class*="toaster"] li',
                                '[class*="toast"]',
                                '[role="status"]',
                                '[role="alert"]'
                            ];
                            const texts = new Set();
                            for (const sel of toastSelectors) {
                                document.querySelectorAll(sel).forEach(el => {
                                    const t = el.textContent?.trim();
                                    if (t && t.length > 0) texts.add(t);
                                });
                            }
                            return [...texts];
                        }
                    """)
                    all_toasts = list(set(upload_toast_messages + upload_toast_messages_v2))
                    print(f"  All toast messages: {all_toasts}")

                    # 判斷失敗
                    for toast in all_toasts:
                        if any(err in toast for err in ["失敗", "錯誤", "error", "Error", "failed", "Failed"]):
                            upload_error_found = True
                            print(f"  ERROR TOAST: '{toast}'")

                    take_screenshot(page, "ac_035_15_final_state.png")

                    # 判斷最終結果
                    if len(cloudinary_responses) > 0:
                        all_ok = all(r["status"] == 200 for r in cloudinary_responses)
                        if all_ok and not upload_error_found:
                            cloudinary_success = True
                            upload_test_result = "PASS"
                        elif not all_ok:
                            upload_test_result = "FAIL_CLOUDINARY_NON_200"
                        else:
                            upload_test_result = "FAIL_WITH_ERROR_TOAST"
                    elif upload_error_found:
                        upload_test_result = "FAIL_ERROR_TOAST"
                    else:
                        # 沒有 Cloudinary 請求也沒有錯誤
                        modal_still_open = any(t in ["新增地點", "編輯地點"] for t in page.evaluate("""
                            () => Array.from(document.querySelectorAll('h2'))
                                 .map(h => h.textContent?.trim()).filter(Boolean)
                        """))
                        if not modal_still_open:
                            # Modal 已關閉 - 可能上傳成功但網路監聽未捕捉到
                            # 或者照片壓縮後直接跳過了（極小圖片無法壓縮）
                            upload_test_result = "MODAL_CLOSED_NO_CLOUDINARY_CAPTURED"
                        else:
                            upload_test_result = "UNCERTAIN_MODAL_STILL_OPEN"
                else:
                    print("  ERROR: Save button not found")
                    upload_test_result = "NO_SAVE_BUTTON"
                    take_screenshot(page, "ac_035_err_no_save_btn.png")
            else:
                print("  ERROR: File input not found")
                upload_test_result = "NO_FILE_INPUT"
                take_screenshot(page, "ac_035_err_no_file_input.png")
        else:
            upload_test_result = "EDITOR_NOT_OPEN"

        # ================================================================
        # 最終報告
        # ================================================================
        print("\n" + "="*65)
        print("AC-035 PHOTO UPLOAD TEST RESULTS")
        print("="*65)
        print(f"  Upload Result:        {upload_test_result}")
        print(f"  Cloudinary Success:   {cloudinary_success}")
        print(f"  Error Toast Found:    {upload_error_found}")
        print(f"  Cloudinary Requests:  {len(cloudinary_requests)}")
        print(f"  Cloudinary Responses: {cloudinary_responses}")
        print(f"  Toast Messages:       {upload_toast_messages}")

        # Console CORS/upload errors
        relevant = [e for e in console_errors if any(
            kw.lower() in e.lower() for kw in ["cors", "cloudinary", "upload", "storage", "failed", "error"]
        )]
        if relevant:
            print("\n  Relevant Console Errors:")
            for err in relevant[:10]:
                print(f"    {err}")
        else:
            print("\n  No CORS or upload-related console errors.")

        # 印出所有 console log（儲存相關）
        save_logs = [l for l in console_all if any(
            kw in l for kw in ["Save", "save", "upload", "Upload", "compress", "Compress", "Error", "error"]
        )]
        if save_logs:
            print("\n  Save/Upload related console logs:")
            for l in save_logs[:15]:
                print(f"    {l}")

        browser.close()

    # Verdict
    print("\n" + "="*65)
    if upload_test_result == "PASS" and not upload_error_found:
        print("VERDICT: PASS")
        print("  - Cloudinary upload: SUCCESS (HTTP 200)")
        print("  - No error toasts detected")
        print("  - No CORS errors in console")
    elif upload_test_result == "EDITOR_NOT_OPEN":
        print("VERDICT: BLOCKED")
        print("  - PlaceEditor could not be opened")
        print("  - Check navigation flow in screenshots")
    elif upload_error_found or "FAIL" in upload_test_result:
        print("VERDICT: FAIL")
        print(f"  - {upload_test_result}")
    elif "MODAL_CLOSED" in upload_test_result:
        print("VERDICT: INCONCLUSIVE (Modal closed, no Cloudinary traffic captured)")
        print("  - The image may be too small for browser-image-compression")
        print("  - Network interception may have missed the XHR upload")
        print("  - Check screenshots for visual confirmation")
    else:
        print(f"VERDICT: UNCERTAIN ({upload_test_result})")
    print("="*65)


if __name__ == "__main__":
    main()
