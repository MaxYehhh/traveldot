from playwright.sync_api import sync_playwright
import time

def test_auth_flow():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        # Create a new context for a fresh session
        context = browser.new_context()
        page = context.new_page()

        print("Step 1: Navigate to Login Page")
        page.goto('http://localhost:5173/login')
        page.wait_for_load_state('networkidle')
        page.screenshot(path='tests/acceptance/1_login_page.png')

        # --- Scenario 1: Register New Account (AC-001) ---
        print("\n--- Testing AC-001: Register New Account ---")
        
        # Check if we are on login page, click "Sign up"
        # Assuming there is a link/button with text "Sign up" or similar to switch mode
        # If the UI is a toggle, we might need to find it.
        # Let's look for "Sign up" text.
        
        # Taking a screenshot to be safe for debugging
        page.screenshot(path='tests/acceptance/before_click_signup.png')
        
        # Try to find the "Sign up" toggle/link. 
        # UI Text: "註冊新帳號"
        signup_toggle = page.locator("text=註冊新帳號")
        
        if signup_toggle.is_visible():
            signup_toggle.click()
            print("Clicked '註冊新帳號' toggle")
            time.sleep(0.5)
        else:
            print("Warning: Could not find '註冊新帳號' switch. Checking if we are already on Register page...")
            heading = page.locator("h2", has_text="註冊 TravelDot")
            if not heading.is_visible():
                print("Error: Not on Register page and cannot find toggle.")
        
        print("Filling Registration Form")
        # Generate dynamic email
        timestamp = int(time.time())
        email = f"test_{timestamp}@example.com"
        password = "Test1234!"
        
        print(f"Registering with: {email}")
        
        # Fill Email
        page.fill('input[placeholder="your@email.com"]', email)
        # Fill Password (placeholder matches SignupForm)
        page.fill('input[placeholder="至少 8 個字元"]', password)
        # Fill Confirm Password
        page.fill('input[placeholder="再次輸入密碼"]', password)
        
        page.screenshot(path='tests/acceptance/2_filled_register.png')

        # Click Submit (Sign up button) - Text is "註冊"
        page.click('button[type="submit"]')
        
        print("Clicked Register, waiting for navigation...")
        
        # Expectation: Redirect to Landing Page (Root /)
        # We check for Sidebar element indicating logged in state.
        # Sidebar renders "Sign out" button and user email.
        try:
            # Wait for "Sign out" button
            page.locator("text=Sign out").wait_for(timeout=15000)
            
            # Verify user email is present
            if page.locator(f"text={email}").is_visible():
                print(f"✅ AC-001 Pass: Landing Page loaded & User Logged In ({email} visible)")
            else:
                print("⚠️ AC-001 Warning: User logged in but email not found in sidebar")
                
            print("✅ AC-001 Pass: Sidebar is visible")
        except:
             print(f"❌ AC-001 Fail: Landing Page content not found. Current URL: {page.url}")
             
             # Debug: Print visible error messages
             errors = page.locator(".text-red-500").all_text_contents()
             if errors:
                 print(f"DEBUG: Found Error Messages: {errors}")
             else:
                 print("DEBUG: No red error text found.")
                 
             # Check if we are still on Auth form
             if page.locator("text=註冊 TravelDot").is_visible():
                 print("DEBUG: Still on Registration Form.")
             
             page.screenshot(path='tests/acceptance/fail_redirect.png')

        # Check Toast
        # Looking for text "歡迎" or "Welcome"
        try:
            # Wait for any toast
            toast = page.locator("text=歡迎") 
            if not toast.is_visible():
                 toast = page.locator("text=Welcome")
            
            if toast.is_visible():
                print("✅ AC-001 Pass: Toast message verification")
                page.screenshot(path='tests/acceptance/3_register_success_toast.png')
            else:
                print("⚠️ AC-001 Warning: Toast not found")
        except:
             print("⚠️ AC-001 Warning: Toast check exception")
        
        # --- Scenario 2: Login (AC-005) ---
        print("\n--- Testing AC-005: Login with Existing Account ---")
        
        # Logout first / Clear session
        # Clear cookies AND local/session storage for Firebase
        context.clear_cookies()
        page.goto('http://localhost:5173/login')
        page.evaluate("window.localStorage.clear()")
        page.evaluate("window.sessionStorage.clear()")
        page.reload() 
        page.wait_for_load_state('networkidle')
        
        print("Filling Login Form")
        page.fill('input[type="email"]', 'test2@example.com')
        page.fill('input[type="password"]', 'test1234')
        
        page.screenshot(path='tests/acceptance/4_filled_login.png')
        
        # Click Login - Text is "登入"
        login_btn = page.locator('button[type="submit"]')
        login_btn.click()
        
        print("Clicked Login, waiting for content...")
        
        try:
            # Wait for "Sign out" button again
            page.locator("text=Sign out").wait_for(timeout=15000)
            
             # Verify user email is present
            if page.locator("text=test2@example.com").is_visible():
                print("✅ AC-005 Pass: Login Successful (Email visible)")
            else:
                 print("⚠️ AC-005 Warning: User logged in but email not found")
                 
            page.screenshot(path='tests/acceptance/5_login_success.png')
        except:
            print(f"❌ AC-005 Fail: Landing Page content not found.")
            page.screenshot(path='tests/acceptance/fail_login.png')

        browser.close()

if __name__ == "__main__":
    test_auth_flow()
