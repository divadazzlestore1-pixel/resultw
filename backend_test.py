#!/usr/bin/env python3
"""
RESULT WALLAH Educational Institute Backend API Testing
Testing the new announcements and banners APIs plus existing functionality.
"""

import requests
import json
import sys
from typing import Dict, Any, Optional

# Base URL from environment
BASE_URL = "https://edu-result-portal.preview.emergentagent.com"
API_BASE = f"{BASE_URL}/api"

class BackendTester:
    def __init__(self):
        self.admin_token = None
        self.student_token = None
        self.test_announcement_id = None
        self.test_banner_id = None
        self.results = []

    def log_result(self, test_name: str, success: bool, details: str = ""):
        """Log test result"""
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status}: {test_name}")
        if details:
            print(f"   Details: {details}")
        self.results.append({"test": test_name, "success": success, "details": details})
        return success

    def make_request(self, method: str, endpoint: str, data: Dict[Any, Any] = None, 
                    headers: Dict[str, str] = None, params: Dict[str, str] = None) -> Optional[Dict[Any, Any]]:
        """Make HTTP request with proper error handling"""
        try:
            url = f"{API_BASE}{endpoint}"
            default_headers = {"Content-Type": "application/json"}
            if headers:
                default_headers.update(headers)
            
            kwargs = {"headers": default_headers, "timeout": 30}
            if data:
                kwargs["json"] = data
            if params:
                kwargs["params"] = params
            
            response = requests.request(method, url, **kwargs)
            
            if response.status_code == 204:
                return {"status": "success", "message": "No content"}
            
            try:
                return response.json()
            except:
                return {"status_code": response.status_code, "text": response.text}
        except Exception as e:
            print(f"Request failed: {e}")
            return None

    def get_auth_header(self, token: str) -> Dict[str, str]:
        """Get authorization header"""
        return {"Authorization": f"Bearer {token}"}

    def test_health_check(self) -> bool:
        """Test 1: GET /api/health"""
        print("\n=== Testing Health Check ===")
        response = self.make_request("GET", "/health")
        
        if response and response.get("status") == "ok":
            return self.log_result("Health Check", True, "API server is healthy")
        return self.log_result("Health Check", False, f"Unexpected response: {response}")

    def test_admin_login(self) -> bool:
        """Test 2: POST /api/auth/admin-login"""
        print("\n=== Testing Admin Login ===")
        
        login_data = {
            "email": "admin@resultwallah.com",
            "password": "Result@2026"
        }
        
        response = self.make_request("POST", "/auth/admin-login", login_data)
        
        if response and response.get("token"):
            self.admin_token = response["token"]
            user = response.get("user", {})
            return self.log_result("Admin Login", True, 
                                 f"Logged in as {user.get('name')} ({user.get('email')})")
        
        return self.log_result("Admin Login", False, f"Login failed: {response}")

    def test_staff_api(self) -> bool:
        """Test 3: GET /api/staff"""
        print("\n=== Testing Staff API ===")
        
        response = self.make_request("GET", "/staff")
        
        if response and "staff" in response:
            staff_list = response["staff"]
            staff_count = len(staff_list)
            
            # Check if we have expected staff members (should be 3 from seeding)
            if staff_count >= 3:
                # Verify staff have photo URLs
                staff_with_photos = [s for s in staff_list if s.get("photo_url")]
                return self.log_result("Staff API", True, 
                                     f"Found {staff_count} staff members, {len(staff_with_photos)} with photos")
            else:
                return self.log_result("Staff API", False, 
                                     f"Expected 3+ staff members, got {staff_count}")
        
        return self.log_result("Staff API", False, f"Failed to fetch staff: {response}")

    def test_courses_api(self) -> bool:
        """Test 4: GET /api/courses"""
        print("\n=== Testing Courses API ===")
        
        response = self.make_request("GET", "/courses")
        
        if response and "courses" in response:
            courses = response["courses"]
            course_count = len(courses)
            
            if course_count == 5:
                course_names = [c.get("name") for c in courses]
                return self.log_result("Courses API", True, 
                                     f"Found {course_count} courses: {', '.join(course_names[:3])}...")
            else:
                return self.log_result("Courses API", False, 
                                     f"Expected 5 courses, got {course_count}")
        
        return self.log_result("Courses API", False, f"Failed to fetch courses: {response}")

    def test_announcements_get(self) -> bool:
        """Test 5: GET /api/announcements"""
        print("\n=== Testing Announcements GET ===")
        
        response = self.make_request("GET", "/announcements")
        
        if response and "announcements" in response:
            announcements = response["announcements"]
            count = len(announcements)
            
            if count >= 3:
                return self.log_result("Announcements GET", True, 
                                     f"Found {count} announcements")
            else:
                return self.log_result("Announcements GET", False, 
                                     f"Expected 3+ announcements, got {count}")
        
        return self.log_result("Announcements GET", False, f"Failed to fetch: {response}")

    def test_announcements_get_active(self) -> bool:
        """Test 6: GET /api/announcements?active=true"""
        print("\n=== Testing Announcements GET Active Filter ===")
        
        response = self.make_request("GET", "/announcements", params={"active": "true"})
        
        if response and "announcements" in response:
            announcements = response["announcements"]
            active_count = len(announcements)
            
            # All seeded announcements should be active
            all_active = all(a.get("active", False) for a in announcements)
            
            if all_active:
                return self.log_result("Announcements Active Filter", True, 
                                     f"Found {active_count} active announcements")
            else:
                return self.log_result("Announcements Active Filter", False, 
                                     "Some announcements are not active")
        
        return self.log_result("Announcements Active Filter", False, f"Failed: {response}")

    def test_announcements_post(self) -> bool:
        """Test 7: POST /api/announcements (admin auth required)"""
        print("\n=== Testing Announcements POST ===")
        
        if not self.admin_token:
            return self.log_result("Announcements POST", False, "No admin token available")
        
        new_announcement = {
            "text": "Test announcement",
            "active": True,
            "priority": 4
        }
        
        headers = self.get_auth_header(self.admin_token)
        response = self.make_request("POST", "/announcements", new_announcement, headers)
        
        if response and "announcement" in response:
            announcement = response["announcement"]
            self.test_announcement_id = announcement.get("id")
            
            return self.log_result("Announcements POST", True, 
                                 f"Created announcement: {announcement.get('text')}")
        
        return self.log_result("Announcements POST", False, f"Failed to create: {response}")

    def test_announcements_put(self) -> bool:
        """Test 8: PUT /api/announcements (admin auth required)"""
        print("\n=== Testing Announcements PUT ===")
        
        if not self.admin_token or not self.test_announcement_id:
            return self.log_result("Announcements PUT", False, "No admin token or test announcement ID")
        
        update_data = {
            "id": self.test_announcement_id,
            "text": "Updated test announcement",
            "active": False
        }
        
        headers = self.get_auth_header(self.admin_token)
        response = self.make_request("PUT", "/announcements", update_data, headers)
        
        if response and "announcement" in response:
            announcement = response["announcement"]
            
            return self.log_result("Announcements PUT", True, 
                                 f"Updated announcement: {announcement.get('text')}")
        
        return self.log_result("Announcements PUT", False, f"Failed to update: {response}")

    def test_announcements_delete(self) -> bool:
        """Test 9: DELETE /api/announcements (admin auth required)"""
        print("\n=== Testing Announcements DELETE ===")
        
        if not self.admin_token or not self.test_announcement_id:
            return self.log_result("Announcements DELETE", False, "No admin token or test announcement ID")
        
        headers = self.get_auth_header(self.admin_token)
        params = {"id": self.test_announcement_id}
        response = self.make_request("DELETE", "/announcements", headers=headers, params=params)
        
        if response and response.get("message") == "Announcement deleted":
            return self.log_result("Announcements DELETE", True, "Successfully deleted test announcement")
        
        return self.log_result("Announcements DELETE", False, f"Failed to delete: {response}")

    def test_banners_get(self) -> bool:
        """Test 10: GET /api/banners"""
        print("\n=== Testing Banners GET ===")
        
        response = self.make_request("GET", "/banners")
        
        if response and "banners" in response:
            banners = response["banners"]
            count = len(banners)
            
            if count >= 1:
                return self.log_result("Banners GET", True, 
                                     f"Found {count} banners")
            else:
                return self.log_result("Banners GET", False, 
                                     f"Expected 1+ banners, got {count}")
        
        return self.log_result("Banners GET", False, f"Failed to fetch: {response}")

    def test_banners_get_active(self) -> bool:
        """Test 11: GET /api/banners?active=true"""
        print("\n=== Testing Banners GET Active Filter ===")
        
        response = self.make_request("GET", "/banners", params={"active": "true"})
        
        if response and "banners" in response:
            banners = response["banners"]
            active_count = len(banners)
            
            # Check if active banners only
            all_active = all(b.get("active", False) for b in banners)
            
            if all_active:
                return self.log_result("Banners Active Filter", True, 
                                     f"Found {active_count} active banners")
            else:
                return self.log_result("Banners Active Filter", False, 
                                     "Some banners are not active")
        
        return self.log_result("Banners Active Filter", False, f"Failed: {response}")

    def test_banners_post(self) -> bool:
        """Test 12: POST /api/banners (admin auth required)"""
        print("\n=== Testing Banners POST ===")
        
        if not self.admin_token:
            return self.log_result("Banners POST", False, "No admin token available")
        
        new_banner = {
            "title": "Test Banner",
            "description": "Test desc",
            "image_url": "/test.jpg",
            "active": True,
            "order": 2
        }
        
        headers = self.get_auth_header(self.admin_token)
        response = self.make_request("POST", "/banners", new_banner, headers)
        
        if response and "banner" in response:
            banner = response["banner"]
            self.test_banner_id = banner.get("id")
            
            return self.log_result("Banners POST", True, 
                                 f"Created banner: {banner.get('title')}")
        
        return self.log_result("Banners POST", False, f"Failed to create: {response}")

    def test_banners_put(self) -> bool:
        """Test 13: PUT /api/banners (admin auth required)"""
        print("\n=== Testing Banners PUT ===")
        
        if not self.admin_token or not self.test_banner_id:
            return self.log_result("Banners PUT", False, "No admin token or test banner ID")
        
        update_data = {
            "id": self.test_banner_id,
            "title": "Updated Banner",
            "active": False
        }
        
        headers = self.get_auth_header(self.admin_token)
        response = self.make_request("PUT", "/banners", update_data, headers)
        
        if response and "banner" in response:
            banner = response["banner"]
            
            return self.log_result("Banners PUT", True, 
                                 f"Updated banner: {banner.get('title')}")
        
        return self.log_result("Banners PUT", False, f"Failed to update: {response}")

    def test_banners_delete(self) -> bool:
        """Test 14: DELETE /api/banners (admin auth required)"""
        print("\n=== Testing Banners DELETE ===")
        
        if not self.admin_token or not self.test_banner_id:
            return self.log_result("Banners DELETE", False, "No admin token or test banner ID")
        
        headers = self.get_auth_header(self.admin_token)
        params = {"id": self.test_banner_id}
        response = self.make_request("DELETE", "/banners", headers=headers, params=params)
        
        if response and response.get("message") == "Banner deleted":
            return self.log_result("Banners DELETE", True, "Successfully deleted test banner")
        
        return self.log_result("Banners DELETE", False, f"Failed to delete: {response}")

    def test_contact_submission(self) -> bool:
        """Test 15: POST /api/contacts"""
        print("\n=== Testing Contact Form Submission ===")
        
        contact_data = {
            "name": "Arjun Sharma",
            "mobile": "9876543210",
            "email": "arjun.sharma@student.com",
            "course": "NEET",
            "message": "Interested in NEET coaching for 2025-26"
        }
        
        response = self.make_request("POST", "/contacts", contact_data)
        
        if response and response.get("message") == "Contact form submitted successfully":
            return self.log_result("Contact Submission", True, 
                                 f"Contact form submitted for {contact_data['name']}")
        
        return self.log_result("Contact Submission", False, f"Failed to submit: {response}")

    def test_student_auth_flow(self) -> bool:
        """Test 16: Student auth flow - register, send-otp, verify-otp"""
        print("\n=== Testing Student Auth Flow ===")
        
        # Step 1: Register
        register_data = {
            "name": "Priya Patel",
            "email": "priya.patel@student.com",
            "mobile": "8765432109",
            "role": "student"
        }
        
        register_response = self.make_request("POST", "/auth/register", register_data)
        
        if not register_response or "OTP sent" not in register_response.get("message", ""):
            return self.log_result("Student Auth Flow", False, f"Registration failed: {register_response}")
        
        # Extract OTP from response (for testing)
        otp_hint = register_response.get("otp_hint", "")
        if "OTP is:" not in otp_hint:
            return self.log_result("Student Auth Flow", False, "No OTP provided in response")
        
        otp = otp_hint.split("OTP is: ")[1].strip()
        
        # Step 2: Send OTP (optional, but let's test it)
        send_otp_data = {"email": register_data["email"]}
        send_otp_response = self.make_request("POST", "/auth/send-otp", send_otp_data)
        
        if send_otp_response and "OTP is:" in send_otp_response.get("otp_hint", ""):
            otp = send_otp_response.get("otp_hint", "").split("OTP is: ")[1].strip()
        
        # Step 3: Verify OTP
        verify_data = {
            "email": register_data["email"],
            "otp": otp
        }
        
        verify_response = self.make_request("POST", "/auth/verify-otp", verify_data)
        
        if verify_response and verify_response.get("token"):
            self.student_token = verify_response["token"]
            user = verify_response.get("user", {})
            return self.log_result("Student Auth Flow", True, 
                                 f"Complete auth flow successful for {user.get('name')}")
        
        return self.log_result("Student Auth Flow", False, f"OTP verification failed: {verify_response}")

    def run_all_tests(self):
        """Run all backend tests"""
        print("🚀 RESULT WALLAH Backend API Testing")
        print(f"📍 Testing against: {BASE_URL}")
        print("=" * 60)
        
        # Run all tests in sequence
        tests = [
            self.test_health_check,
            self.test_admin_login,
            self.test_staff_api,
            self.test_courses_api,
            self.test_announcements_get,
            self.test_announcements_get_active,
            self.test_announcements_post,
            self.test_announcements_put,
            self.test_announcements_delete,
            self.test_banners_get,
            self.test_banners_get_active,
            self.test_banners_post,
            self.test_banners_put,
            self.test_banners_delete,
            self.test_contact_submission,
            self.test_student_auth_flow,
        ]
        
        passed = 0
        failed = 0
        
        for test in tests:
            try:
                if test():
                    passed += 1
                else:
                    failed += 1
            except Exception as e:
                print(f"❌ FAIL: {test.__name__} - Exception: {e}")
                failed += 1
        
        # Print final summary
        print("\n" + "=" * 60)
        print(f"🎯 TEST SUMMARY")
        print(f"✅ Passed: {passed}")
        print(f"❌ Failed: {failed}")
        print(f"📊 Success Rate: {(passed/(passed+failed)*100):.1f}%")
        
        if failed == 0:
            print("🎉 ALL TESTS PASSED! Backend APIs are working perfectly.")
        else:
            print(f"⚠️  {failed} tests failed. Check details above.")
        
        return failed == 0

if __name__ == "__main__":
    tester = BackendTester()
    success = tester.run_all_tests()
    sys.exit(0 if success else 1)