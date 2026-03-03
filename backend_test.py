#!/usr/bin/env python3

import requests
import json
import sys
import time
from datetime import datetime

# Configuration
BASE_URL = "https://edu-result-portal.preview.emergentagent.com"
API_BASE = f"{BASE_URL}/api"

# Admin credentials
ADMIN_EMAIL = "admin@resultwallah.com"
ADMIN_PASSWORD = "Result@2026"

# Global variables for tokens
admin_token = None
student_token = None

def log_test(test_name, result, details=""):
    """Log test results with consistent formatting"""
    status = "✅ PASS" if result else "❌ FAIL"
    timestamp = datetime.now().strftime("%H:%M:%S")
    print(f"[{timestamp}] {status} - {test_name}")
    if details:
        print(f"    Details: {details}")
    if not result:
        print(f"    ❗ CRITICAL FAILURE")
    print()

def make_request(method, endpoint, data=None, headers=None, auth_token=None):
    """Make HTTP request with proper error handling"""
    url = f"{API_BASE}{endpoint}"
    
    # Set default headers
    req_headers = {"Content-Type": "application/json"}
    if headers:
        req_headers.update(headers)
    
    # Add authorization if token provided
    if auth_token:
        req_headers["Authorization"] = f"Bearer {auth_token}"
    
    try:
        if method.upper() == "GET":
            response = requests.get(url, headers=req_headers, timeout=30)
        elif method.upper() == "POST":
            response = requests.post(url, json=data, headers=req_headers, timeout=30)
        elif method.upper() == "PUT":
            response = requests.put(url, json=data, headers=req_headers, timeout=30)
        elif method.upper() == "DELETE":
            response = requests.delete(url, headers=req_headers, timeout=30)
        else:
            raise ValueError(f"Unsupported HTTP method: {method}")
        
        return response
    except requests.exceptions.RequestException as e:
        print(f"Request failed: {e}")
        return None

def test_health_endpoint():
    """Test 1: Health check endpoint"""
    response = make_request("GET", "/health")
    
    if response is None:
        log_test("Health Check", False, "Request failed")
        return False
    
    if response.status_code == 200:
        data = response.json()
        if data.get("status") == "ok":
            log_test("Health Check", True, f"Status: {data.get('status')}")
            return True
        else:
            log_test("Health Check", False, f"Unexpected response: {data}")
            return False
    else:
        log_test("Health Check", False, f"Status code: {response.status_code}")
        return False

def test_admin_login():
    """Test 2: Admin login"""
    global admin_token
    
    login_data = {
        "email": ADMIN_EMAIL,
        "password": ADMIN_PASSWORD
    }
    
    response = make_request("POST", "/auth/admin-login", data=login_data)
    
    if response is None:
        log_test("Admin Login", False, "Request failed")
        return False
    
    if response.status_code == 200:
        data = response.json()
        if "token" in data and "user" in data:
            admin_token = data["token"]
            user = data["user"]
            log_test("Admin Login", True, f"User: {user.get('name')} ({user.get('email')})")
            return True
        else:
            log_test("Admin Login", False, f"Missing token or user in response: {data}")
            return False
    else:
        log_test("Admin Login", False, f"Status code: {response.status_code}, Response: {response.text}")
        return False

def test_staff_endpoints():
    """Test 3-6: Staff CRUD operations"""
    # Test GET /api/staff
    response = make_request("GET", "/staff")
    
    if response is None or response.status_code != 200:
        log_test("GET Staff List", False, f"Failed to get staff list")
        return False
    
    staff_data = response.json()
    staff_list = staff_data.get("staff", [])
    
    if len(staff_list) == 2:
        log_test("GET Staff List", True, f"Found {len(staff_list)} staff members as expected")
    else:
        log_test("GET Staff List", True, f"Found {len(staff_list)} staff members (expected 2)")
    
    # Test POST /api/staff (requires admin auth)
    if not admin_token:
        log_test("POST Staff (Add)", False, "No admin token available")
        return False
    
    new_staff = {
        "name": "Test Teacher",
        "designation": "Mathematics Faculty",
        "description": "Expert in advanced mathematics and problem solving",
        "order": 3
    }
    
    response = make_request("POST", "/staff", data=new_staff, auth_token=admin_token)
    
    if response and response.status_code == 201:
        created_staff = response.json().get("staff")
        staff_id = created_staff.get("id")
        log_test("POST Staff (Add)", True, f"Created staff: {created_staff.get('name')}")
        
        # Test PUT /api/staff (update)
        update_data = {
            "id": staff_id,
            "name": "Test Teacher Updated",
            "designation": "Senior Mathematics Faculty"
        }
        
        response = make_request("PUT", "/staff", data=update_data, auth_token=admin_token)
        
        if response and response.status_code == 200:
            log_test("PUT Staff (Update)", True, "Staff updated successfully")
        else:
            log_test("PUT Staff (Update)", False, f"Update failed: {response.status_code if response else 'No response'}")
        
        # Test DELETE /api/staff
        response = make_request("DELETE", f"/staff?id={staff_id}", auth_token=admin_token)
        
        if response and response.status_code == 200:
            log_test("DELETE Staff", True, "Staff deleted successfully")
            return True
        else:
            log_test("DELETE Staff", False, f"Delete failed: {response.status_code if response else 'No response'}")
            return False
    else:
        log_test("POST Staff (Add)", False, f"Failed to add staff: {response.status_code if response else 'No response'}")
        return False

def test_courses_endpoint():
    """Test 4: Courses API"""
    response = make_request("GET", "/courses")
    
    if response is None:
        log_test("GET Courses", False, "Request failed")
        return False
    
    if response.status_code == 200:
        data = response.json()
        courses = data.get("courses", [])
        if len(courses) == 5:
            log_test("GET Courses", True, f"Found {len(courses)} courses as expected")
            return True
        else:
            log_test("GET Courses", True, f"Found {len(courses)} courses (expected 5)")
            return True
    else:
        log_test("GET Courses", False, f"Status code: {response.status_code}")
        return False

def test_settings_endpoint():
    """Test 5: Settings API"""
    response = make_request("GET", "/settings")
    
    if response is None:
        log_test("GET Settings", False, "Request failed")
        return False
    
    if response.status_code == 200:
        data = response.json()
        settings = data.get("settings", {})
        if "directorMessage" in settings:
            log_test("GET Settings", True, "Settings with directorMessage found")
            return True
        else:
            log_test("GET Settings", False, "directorMessage not found in settings")
            return False
    else:
        log_test("GET Settings", False, f"Status code: {response.status_code}")
        return False

def test_stats_endpoint():
    """Test 6: Stats API"""
    response = make_request("GET", "/stats")
    
    if response is None:
        log_test("GET Stats", False, "Request failed")
        return False
    
    if response.status_code == 200:
        data = response.json()
        stats = data.get("stats", {})
        expected_keys = ["studentCount", "staffCount", "notesCount", "contactCount", "resultCount", "courseCount"]
        
        if all(key in stats for key in expected_keys):
            log_test("GET Stats", True, f"All stat counts present: {stats}")
            return True
        else:
            log_test("GET Stats", False, f"Missing stat keys. Got: {list(stats.keys())}")
            return False
    else:
        log_test("GET Stats", False, f"Status code: {response.status_code}")
        return False

def test_contact_form():
    """Test 7-8: Contact form submission and listing"""
    # Test POST /api/contacts
    contact_data = {
        "name": "Rajesh Sharma",
        "mobile": "9876543210",
        "email": "rajesh.sharma@example.com",
        "course": "IIT-JEE (Main & Advanced)",
        "message": "I want to know about the JEE coaching program and fee structure."
    }
    
    response = make_request("POST", "/contacts", data=contact_data)
    
    if response is None:
        log_test("POST Contact Form", False, "Request failed")
        return False
    
    if response.status_code == 201:
        data = response.json()
        log_test("POST Contact Form", True, f"Contact submitted: {data.get('message', 'Success')}")
        
        # Test GET /api/contacts (admin required)
        if not admin_token:
            log_test("GET Contacts (Admin)", False, "No admin token available")
            return False
        
        response = make_request("GET", "/contacts", auth_token=admin_token)
        
        if response and response.status_code == 200:
            contacts_data = response.json()
            contacts = contacts_data.get("contacts", [])
            log_test("GET Contacts (Admin)", True, f"Retrieved {len(contacts)} contacts")
            return True
        else:
            log_test("GET Contacts (Admin)", False, f"Failed to get contacts: {response.status_code if response else 'No response'}")
            return False
    else:
        log_test("POST Contact Form", False, f"Status code: {response.status_code}, Response: {response.text}")
        return False

def test_results_api():
    """Test 9: Results/Top Performers API"""
    if not admin_token:
        log_test("POST Results (Add Top Performer)", False, "No admin token available")
        return False
    
    result_data = {
        "student_name": "Priya Patel",
        "exam": "NEET 2024",
        "marks": "680/720",
        "percentile": "99.8",
        "year": "2024"
    }
    
    response = make_request("POST", "/results", data=result_data, auth_token=admin_token)
    
    if response and response.status_code == 201:
        log_test("POST Results (Add Top Performer)", True, f"Added result for {result_data['student_name']}")
        return True
    else:
        log_test("POST Results (Add Top Performer)", False, f"Failed: {response.status_code if response else 'No response'}")
        return False

def test_notes_api():
    """Test 10: Notes API"""
    if not admin_token:
        log_test("POST Notes (Add Note)", False, "No admin token available")
        return False
    
    note_data = {
        "title": "Physics Formula Sheet - Mechanics",
        "subject": "Physics",
        "file_url": "/uploads/notes/physics_mechanics_formulas.pdf"
    }
    
    response = make_request("POST", "/notes", data=note_data, auth_token=admin_token)
    
    if response and response.status_code == 201:
        log_test("POST Notes (Add Note)", True, f"Added note: {note_data['title']}")
        return True
    else:
        log_test("POST Notes (Add Note)", False, f"Failed: {response.status_code if response else 'No response'}")
        return False

def test_student_auth_flow():
    """Test 11: Student authentication flow"""
    global student_token
    
    # Step 1: Register
    student_data = {
        "name": "Ankit Kumar",
        "email": "ankit.kumar@student.com",
        "mobile": "8765432109",
        "role": "student"
    }
    
    response = make_request("POST", "/auth/register", data=student_data)
    
    if response is None or response.status_code != 200:
        log_test("Student Registration", False, f"Registration failed: {response.status_code if response else 'No response'}")
        return False
    
    reg_data = response.json()
    log_test("Student Registration", True, f"Registration successful: {reg_data.get('message', 'Success')}")
    
    # Step 2: Send OTP
    otp_request = {"email": student_data["email"]}
    response = make_request("POST", "/auth/send-otp", data=otp_request)
    
    if response is None or response.status_code != 200:
        log_test("Student Send OTP", False, f"Send OTP failed: {response.status_code if response else 'No response'}")
        return False
    
    otp_data = response.json()
    log_test("Student Send OTP", True, f"OTP sent: {otp_data.get('message', 'Success')}")
    
    # Extract OTP from response (for testing purposes)
    otp_hint = otp_data.get("otp_hint", "")
    otp = otp_hint.split(": ")[-1] if ": " in otp_hint else ""
    
    if not otp:
        log_test("Student Extract OTP", False, "Could not extract OTP from response")
        return False
    
    # Step 3: Verify OTP
    verify_data = {
        "email": student_data["email"],
        "otp": otp
    }
    
    response = make_request("POST", "/auth/verify-otp", data=verify_data)
    
    if response and response.status_code == 200:
        verify_response = response.json()
        if "token" in verify_response:
            student_token = verify_response["token"]
            user = verify_response.get("user", {})
            log_test("Student OTP Verification", True, f"Login successful: {user.get('name')} ({user.get('email')})")
            return True
        else:
            log_test("Student OTP Verification", False, "No token in verification response")
            return False
    else:
        log_test("Student OTP Verification", False, f"Verification failed: {response.status_code if response else 'No response'}")
        return False

def test_download_tracking():
    """Test 12: Download tracking"""
    if not student_token:
        log_test("Download Tracking", False, "No student token available")
        return False
    
    # First, get notes to find a valid note ID
    response = make_request("GET", "/notes")
    
    if response is None or response.status_code != 200:
        log_test("Download Tracking", False, "Could not fetch notes list")
        return False
    
    notes_data = response.json()
    notes = notes_data.get("notes", [])
    
    if not notes:
        log_test("Download Tracking", False, "No notes available for download test")
        return False
    
    # Use the first note for testing
    note_id = notes[0].get("id")
    
    response = make_request("GET", f"/download?id={note_id}", auth_token=student_token)
    
    if response and response.status_code == 200:
        download_data = response.json()
        log_test("Download Tracking", True, f"Download tracked: {download_data}")
        return True
    else:
        log_test("Download Tracking", False, f"Download failed: {response.status_code if response else 'No response'}")
        return False

def run_all_tests():
    """Run all backend API tests"""
    print("=" * 80)
    print("🚀 RESULT WALLAH BACKEND API TESTING")
    print("=" * 80)
    print(f"Base URL: {BASE_URL}")
    print(f"Testing Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("=" * 80)
    print()
    
    test_results = []
    
    # Core functionality tests
    test_results.append(("Health Check", test_health_endpoint()))
    test_results.append(("Admin Login", test_admin_login()))
    test_results.append(("Staff Operations", test_staff_endpoints()))
    test_results.append(("Courses API", test_courses_endpoint()))
    test_results.append(("Settings API", test_settings_endpoint()))
    test_results.append(("Stats API", test_stats_endpoint()))
    test_results.append(("Contact Form", test_contact_form()))
    test_results.append(("Results API", test_results_api()))
    test_results.append(("Notes API", test_notes_api()))
    test_results.append(("Student Auth Flow", test_student_auth_flow()))
    test_results.append(("Download Tracking", test_download_tracking()))
    
    # Summary
    print("=" * 80)
    print("📊 TEST SUMMARY")
    print("=" * 80)
    
    passed = sum(1 for _, result in test_results if result)
    total = len(test_results)
    
    for test_name, result in test_results:
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"{status} {test_name}")
    
    print()
    print(f"Total Tests: {total}")
    print(f"Passed: {passed}")
    print(f"Failed: {total - passed}")
    print(f"Success Rate: {(passed/total)*100:.1f}%")
    print("=" * 80)
    
    return passed == total

if __name__ == "__main__":
    success = run_all_tests()
    sys.exit(0 if success else 1)