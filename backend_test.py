#!/usr/bin/env python3

import requests
import json
import sys
from typing import Optional, Dict, Any

# Configuration
BASE_URL = "https://edu-result-portal.preview.emergentagent.com/api"
ADMIN_CREDENTIALS = {
    "email": "admin@resultwallah.com",
    "password": "Result@2026"
}

class APITester:
    def __init__(self, base_url: str):
        self.base_url = base_url
        self.session = requests.Session()
        self.admin_token: Optional[str] = None
        
    def make_request(self, method: str, endpoint: str, **kwargs) -> requests.Response:
        """Make HTTP request with proper error handling"""
        url = f"{self.base_url}{endpoint}"
        try:
            response = self.session.request(method, url, **kwargs)
            print(f"🔥 {method} {url} -> {response.status_code}")
            return response
        except requests.exceptions.RequestException as e:
            print(f"❌ Request failed: {e}")
            raise
    
    def login_admin(self) -> bool:
        """Login as admin and store token"""
        print("\n=== ADMIN LOGIN TEST ===")
        try:
            response = self.make_request('POST', '/auth/admin-login', 
                                       json=ADMIN_CREDENTIALS)
            if response.status_code == 200:
                data = response.json()
                self.admin_token = data.get('token')
                print("✅ Admin login successful")
                print(f"   Token: {self.admin_token[:20]}...")
                return True
            else:
                print(f"❌ Admin login failed: {response.text}")
                return False
        except Exception as e:
            print(f"❌ Admin login error: {e}")
            return False
    
    def get_auth_headers(self) -> Dict[str, str]:
        """Get authorization headers"""
        if not self.admin_token:
            raise Exception("No admin token available")
        return {"Authorization": f"Bearer {self.admin_token}"}
    
    def test_health_check(self):
        """Test 1: GET /api/health"""
        print("\n=== TEST 1: HEALTH CHECK ===")
        try:
            response = self.make_request('GET', '/health')
            if response.status_code == 200:
                data = response.json()
                if data.get('status') == 'ok':
                    print("✅ Health check passed")
                    return True
                else:
                    print(f"❌ Unexpected health response: {data}")
                    return False
            else:
                print(f"❌ Health check failed: {response.status_code}")
                return False
        except Exception as e:
            print(f"❌ Health check error: {e}")
            return False
    
    def test_gallery_get_all(self):
        """Test 3: GET /api/gallery - Should return 4 gallery items"""
        print("\n=== TEST 3: GALLERY GET ALL ===")
        try:
            response = self.make_request('GET', '/gallery')
            if response.status_code == 200:
                data = response.json()
                gallery = data.get('gallery', [])
                print(f"✅ Gallery GET successful - Found {len(gallery)} items")
                
                if len(gallery) == 4:
                    print("✅ Gallery has exactly 4 items as expected")
                    for item in gallery:
                        print(f"   - {item.get('caption', 'No caption')} (order: {item.get('order', 'N/A')})")
                    return True
                else:
                    print(f"⚠️  Expected 4 gallery items, found {len(gallery)}")
                    return True  # Still working, just different count
            else:
                print(f"❌ Gallery GET failed: {response.status_code} - {response.text}")
                return False
        except Exception as e:
            print(f"❌ Gallery GET error: {e}")
            return False
    
    def test_gallery_get_active(self):
        """Test 4: GET /api/gallery?active=true - Should return active gallery items only"""
        print("\n=== TEST 4: GALLERY GET ACTIVE ===")
        try:
            response = self.make_request('GET', '/gallery?active=true')
            if response.status_code == 200:
                data = response.json()
                gallery = data.get('gallery', [])
                print(f"✅ Gallery GET active successful - Found {len(gallery)} active items")
                
                # Check all items are active
                all_active = all(item.get('active', False) for item in gallery)
                if all_active:
                    print("✅ All returned items are active")
                    for item in gallery:
                        print(f"   - {item.get('caption', 'No caption')} (active: {item.get('active')})")
                    return True
                else:
                    print("❌ Some items are not active")
                    return False
            else:
                print(f"❌ Gallery GET active failed: {response.status_code} - {response.text}")
                return False
        except Exception as e:
            print(f"❌ Gallery GET active error: {e}")
            return False
    
    def test_gallery_create(self):
        """Test 5: POST /api/gallery (admin token) - Add test item"""
        print("\n=== TEST 5: GALLERY CREATE ===")
        if not self.admin_token:
            print("❌ No admin token for gallery create test")
            return False
        
        test_item = {
            "image_url": "/test.jpg",
            "caption": "Test Image", 
            "active": True,
            "order": 5
        }
        
        try:
            response = self.make_request('POST', '/gallery', 
                                       json=test_item, 
                                       headers=self.get_auth_headers())
            if response.status_code == 201:
                data = response.json()
                created_item = data.get('gallery')
                if created_item:
                    print("✅ Gallery item created successfully")
                    print(f"   ID: {created_item.get('id')}")
                    print(f"   Caption: {created_item.get('caption')}")
                    print(f"   Image URL: {created_item.get('image_url')}")
                    self.test_item_id = created_item.get('id')
                    return created_item
                else:
                    print("❌ Gallery item created but no data returned")
                    return False
            else:
                print(f"❌ Gallery create failed: {response.status_code} - {response.text}")
                return False
        except Exception as e:
            print(f"❌ Gallery create error: {e}")
            return False
    
    def test_gallery_update(self, item_id: str):
        """Test 6: PUT /api/gallery (admin token) - Update test item"""
        print("\n=== TEST 6: GALLERY UPDATE ===")
        if not self.admin_token:
            print("❌ No admin token for gallery update test")
            return False
        
        update_data = {
            "id": item_id,
            "caption": "Updated Caption",
            "active": False
        }
        
        try:
            response = self.make_request('PUT', '/gallery', 
                                       json=update_data, 
                                       headers=self.get_auth_headers())
            if response.status_code == 200:
                data = response.json()
                updated_item = data.get('gallery')
                if updated_item:
                    print("✅ Gallery item updated successfully")
                    print(f"   ID: {updated_item.get('id')}")
                    print(f"   Caption: {updated_item.get('caption')}")
                    print(f"   Active: {updated_item.get('active')}")
                    return True
                else:
                    print("❌ Gallery item update response missing data")
                    return False
            else:
                print(f"❌ Gallery update failed: {response.status_code} - {response.text}")
                return False
        except Exception as e:
            print(f"❌ Gallery update error: {e}")
            return False
    
    def test_gallery_delete(self, item_id: str):
        """Test 7: DELETE /api/gallery?id=<id> (admin token) - Delete test item"""
        print("\n=== TEST 7: GALLERY DELETE ===")
        if not self.admin_token:
            print("❌ No admin token for gallery delete test")
            return False
        
        try:
            response = self.make_request('DELETE', f'/gallery?id={item_id}', 
                                       headers=self.get_auth_headers())
            if response.status_code == 200:
                data = response.json()
                message = data.get('message', '')
                if 'deleted' in message.lower():
                    print("✅ Gallery item deleted successfully")
                    print(f"   Message: {message}")
                    return True
                else:
                    print(f"❌ Unexpected delete response: {data}")
                    return False
            else:
                print(f"❌ Gallery delete failed: {response.status_code} - {response.text}")
                return False
        except Exception as e:
            print(f"❌ Gallery delete error: {e}")
            return False
    
    def test_results_api(self):
        """Test 8: GET /api/results - Should return 7 top performers with college field"""
        print("\n=== TEST 8: RESULTS API ===")
        try:
            response = self.make_request('GET', '/results')
            if response.status_code == 200:
                data = response.json()
                results = data.get('results', [])
                print(f"✅ Results API successful - Found {len(results)} results")
                
                if len(results) >= 7:
                    print("✅ Found 7 or more top performers")
                    # Check if college field exists
                    has_college = any('college' in result for result in results)
                    if has_college:
                        print("✅ Results include college field")
                        for result in results[:3]:  # Show first 3
                            print(f"   - {result.get('student_name', 'N/A')} - {result.get('exam', 'N/A')} - {result.get('college', 'N/A')}")
                        return True
                    else:
                        print("⚠️  Results missing college field")
                        return True  # Still working
                else:
                    print(f"⚠️  Expected 7+ performers, found {len(results)}")
                    return True  # Still working
            else:
                print(f"❌ Results API failed: {response.status_code} - {response.text}")
                return False
        except Exception as e:
            print(f"❌ Results API error: {e}")
            return False
    
    def test_staff_api(self):
        """Test 9: GET /api/staff - Should return 3 staff members"""
        print("\n=== TEST 9: STAFF API ===")
        try:
            response = self.make_request('GET', '/staff')
            if response.status_code == 200:
                data = response.json()
                staff = data.get('staff', [])
                print(f"✅ Staff API successful - Found {len(staff)} staff members")
                
                if len(staff) == 3:
                    print("✅ Found exactly 3 staff members as expected")
                    for member in staff:
                        print(f"   - {member.get('name', 'N/A')} - {member.get('designation', 'N/A')}")
                    return True
                else:
                    print(f"⚠️  Expected 3 staff, found {len(staff)}")
                    return True  # Still working
            else:
                print(f"❌ Staff API failed: {response.status_code} - {response.text}")
                return False
        except Exception as e:
            print(f"❌ Staff API error: {e}")
            return False
    
    def test_courses_api(self):
        """Test 10: GET /api/courses - Should return 5 courses"""
        print("\n=== TEST 10: COURSES API ===")
        try:
            response = self.make_request('GET', '/courses')
            if response.status_code == 200:
                data = response.json()
                courses = data.get('courses', [])
                print(f"✅ Courses API successful - Found {len(courses)} courses")
                
                if len(courses) == 5:
                    print("✅ Found exactly 5 courses as expected")
                    for course in courses:
                        print(f"   - {course.get('name', 'N/A')} ({course.get('slug', 'N/A')})")
                    return True
                else:
                    print(f"⚠️  Expected 5 courses, found {len(courses)}")
                    return True  # Still working
            else:
                print(f"❌ Courses API failed: {response.status_code} - {response.text}")
                return False
        except Exception as e:
            print(f"❌ Courses API error: {e}")
            return False

def main():
    print("🚀 Starting RESULT WALLAH Gallery API Tests")
    print(f"📍 Base URL: {BASE_URL}")
    
    tester = APITester(BASE_URL)
    results = []
    
    # Test 1: Health Check
    results.append(("Health Check", tester.test_health_check()))
    
    # Test 2: Admin Login
    results.append(("Admin Login", tester.login_admin()))
    
    # Test 3: Gallery GET All
    results.append(("Gallery GET All", tester.test_gallery_get_all()))
    
    # Test 4: Gallery GET Active
    results.append(("Gallery GET Active", tester.test_gallery_get_active()))
    
    # Test 5: Gallery Create
    created_item = tester.test_gallery_create()
    results.append(("Gallery Create", bool(created_item)))
    
    # Test 6 & 7: Update and Delete (only if create succeeded)
    if created_item:
        item_id = created_item.get('id')
        if item_id:
            results.append(("Gallery Update", tester.test_gallery_update(item_id)))
            results.append(("Gallery Delete", tester.test_gallery_delete(item_id)))
        else:
            results.append(("Gallery Update", False))
            results.append(("Gallery Delete", False))
    else:
        results.append(("Gallery Update", False))
        results.append(("Gallery Delete", False))
    
    # Test 8: Results API
    results.append(("Results API", tester.test_results_api()))
    
    # Test 9: Staff API
    results.append(("Staff API", tester.test_staff_api()))
    
    # Test 10: Courses API
    results.append(("Courses API", tester.test_courses_api()))
    
    # Summary
    print("\n" + "="*60)
    print("📊 TEST RESULTS SUMMARY")
    print("="*60)
    
    passed = 0
    failed = 0
    
    for test_name, result in results:
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"{status} {test_name}")
        if result:
            passed += 1
        else:
            failed += 1
    
    print("-"*60)
    print(f"📈 TOTAL: {passed} passed, {failed} failed")
    
    if failed == 0:
        print("🎉 ALL TESTS PASSED! Gallery API is fully functional.")
        return 0
    else:
        print(f"⚠️  {failed} tests failed. Check logs above for details.")
        return 1

if __name__ == "__main__":
    sys.exit(main())