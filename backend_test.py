#!/usr/bin/env python3
"""
Backend API Testing for Chocolicious - Product Reviews and Newsletter
Testing only the newly added features as requested.
"""

import requests
import json
import time
from datetime import datetime

# Configuration
BASE_URL = "https://choco-api-refresh.preview.emergentagent.com/api"
ADMIN_EMAIL = "firstahmadthahir@gmail.com"
ADMIN_PASSWORD = "chocolicious2026"

class TestResults:
    def __init__(self):
        self.passed = 0
        self.failed = 0
        self.results = []
    
    def add_result(self, test_name, passed, details=""):
        self.results.append({
            "test": test_name,
            "passed": passed,
            "details": details
        })
        if passed:
            self.passed += 1
            print(f"✅ {test_name}")
        else:
            self.failed += 1
            print(f"❌ {test_name}: {details}")
    
    def summary(self):
        total = self.passed + self.failed
        print(f"\n=== TEST SUMMARY ===")
        print(f"Total: {total}, Passed: {self.passed}, Failed: {self.failed}")
        return self.failed == 0

def get_admin_token():
    """Login as admin and get Bearer token"""
    try:
        response = requests.post(f"{BASE_URL}/admin/login", 
                               json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD})
        if response.status_code == 200:
            return response.json().get("token")
        else:
            print(f"Login failed: {response.status_code} - {response.text}")
            return None
    except Exception as e:
        print(f"Login error: {e}")
        return None

def test_product_reviews():
    """Test Product Reviews functionality"""
    print("\n=== TESTING PRODUCT REVIEWS ===")
    results = TestResults()
    
    # Test data
    product_slug = "cake-blackforest"
    review_data = {
        "name": "Budi",
        "comment": "Mantap",
        "rating": 5
    }
    
    review_id = None
    
    try:
        # 1. POST review (public, no token) - should create with approved=false
        print("\n1. Testing POST review (public)")
        response = requests.post(f"{BASE_URL}/products/{product_slug}/reviews", 
                               json=review_data)
        
        if response.status_code == 201:
            data = response.json()
            if (data.get("ok") and 
                data.get("data", {}).get("approved") == False and 
                "disetujui admin" in data.get("message", "")):
                review_id = data.get("data", {}).get("id")
                results.add_result("POST review creates unapproved review", True)
            else:
                results.add_result("POST review creates unapproved review", False, 
                                 f"Expected approved=false and admin message, got: {data}")
        else:
            results.add_result("POST review creates unapproved review", False, 
                             f"Expected 201, got {response.status_code}: {response.text}")
        
        # 2. GET reviews (public) - unapproved review should NOT appear
        print("\n2. Testing GET reviews (unapproved should not appear)")
        response = requests.get(f"{BASE_URL}/products/{product_slug}/reviews")
        
        if response.status_code == 200:
            data = response.json()
            if ("data" in data and "count" in data and "average" in data and
                isinstance(data["data"], list) and
                isinstance(data["count"], int) and
                isinstance(data["average"], (int, float))):
                # Check that our unapproved review is NOT in the list
                review_found = any(r.get("id") == review_id for r in data["data"])
                if not review_found:
                    results.add_result("GET reviews excludes unapproved reviews", True)
                else:
                    results.add_result("GET reviews excludes unapproved reviews", False,
                                     "Unapproved review appeared in public list")
            else:
                results.add_result("GET reviews excludes unapproved reviews", False,
                                 f"Invalid response structure: {data}")
        else:
            results.add_result("GET reviews excludes unapproved reviews", False,
                             f"Expected 200, got {response.status_code}: {response.text}")
        
        # 3. Admin login and approve review
        print("\n3. Testing admin review approval")
        token = get_admin_token()
        if token and review_id:
            headers = {"Authorization": f"Bearer {token}"}
            response = requests.put(f"{BASE_URL}/admin/reviews/{review_id}",
                                  json={"approved": True}, headers=headers)
            
            if response.status_code == 200:
                results.add_result("Admin approve review", True)
            else:
                results.add_result("Admin approve review", False,
                                 f"Expected 200, got {response.status_code}: {response.text}")
        else:
            results.add_result("Admin approve review", False, "No token or review_id")
        
        # 4. GET reviews again - approved review should now appear
        print("\n4. Testing GET reviews (approved should appear)")
        response = requests.get(f"{BASE_URL}/products/{product_slug}/reviews")
        
        if response.status_code == 200:
            data = response.json()
            if (data.get("count", 0) >= 1 and 
                isinstance(data.get("average"), (int, float)) and
                1 <= data.get("average") <= 5):
                results.add_result("GET reviews includes approved reviews", True)
            else:
                results.add_result("GET reviews includes approved reviews", False,
                                 f"Expected count>=1 and valid average, got: {data}")
        else:
            results.add_result("GET reviews includes approved reviews", False,
                             f"Expected 200, got {response.status_code}: {response.text}")
        
        # 5. Test validation - missing comment
        print("\n5. Testing validation - missing comment")
        invalid_data = {"name": "Test", "rating": 5}  # missing comment
        response = requests.post(f"{BASE_URL}/products/{product_slug}/reviews", 
                               json=invalid_data)
        
        if response.status_code == 400:
            results.add_result("Validation rejects missing comment", True)
        else:
            results.add_result("Validation rejects missing comment", False,
                             f"Expected 400, got {response.status_code}: {response.text}")
        
        # 6. Test validation - rating clamping (API clamps ratings to 1-5 range)
        print("\n6. Testing rating clamping behavior")
        invalid_data = {"name": "Test", "comment": "Test comment", "rating": 0}
        response = requests.post(f"{BASE_URL}/products/{product_slug}/reviews", 
                               json=invalid_data)
        
        if response.status_code == 201:
            data = response.json()
            if data.get("data", {}).get("rating") == 1:
                results.add_result("Rating 0 clamped to 1", True)
            else:
                results.add_result("Rating 0 clamped to 1", False,
                                 f"Expected rating=1, got: {data.get('data', {}).get('rating')}")
        else:
            results.add_result("Rating 0 clamped to 1", False,
                             f"Expected 201, got {response.status_code}: {response.text}")
        
        invalid_data = {"name": "Test", "comment": "Test comment", "rating": 6}
        response = requests.post(f"{BASE_URL}/products/{product_slug}/reviews", 
                               json=invalid_data)
        
        if response.status_code == 201:
            data = response.json()
            if data.get("data", {}).get("rating") == 5:
                results.add_result("Rating 6 clamped to 5", True)
            else:
                results.add_result("Rating 6 clamped to 5", False,
                                 f"Expected rating=5, got: {data.get('data', {}).get('rating')}")
        else:
            results.add_result("Rating 6 clamped to 5", False,
                             f"Expected 201, got {response.status_code}: {response.text}")
        
        # 7. Test non-existent product
        print("\n7. Testing non-existent product")
        response = requests.post(f"{BASE_URL}/products/slug-tidak-ada/reviews", 
                               json=review_data)
        
        if response.status_code == 404:
            results.add_result("Non-existent product returns 404", True)
        else:
            results.add_result("Non-existent product returns 404", False,
                             f"Expected 404, got {response.status_code}: {response.text}")
        
        # 8. Test DELETE without token
        print("\n8. Testing DELETE review without token")
        if review_id:
            response = requests.delete(f"{BASE_URL}/admin/reviews/{review_id}")
            
            if response.status_code == 401:
                results.add_result("DELETE review without token returns 401", True)
            else:
                results.add_result("DELETE review without token returns 401", False,
                                 f"Expected 401, got {response.status_code}: {response.text}")
        
        # 9. Test DELETE with token
        print("\n9. Testing DELETE review with token")
        if token and review_id:
            headers = {"Authorization": f"Bearer {token}"}
            response = requests.delete(f"{BASE_URL}/admin/reviews/{review_id}", headers=headers)
            
            if response.status_code == 200:
                results.add_result("DELETE review with token succeeds", True)
            else:
                results.add_result("DELETE review with token succeeds", False,
                                 f"Expected 200, got {response.status_code}: {response.text}")
        
    except Exception as e:
        results.add_result("Product Reviews Test Suite", False, f"Exception: {e}")
    
    return results

def test_newsletter():
    """Test Newsletter functionality"""
    print("\n=== TESTING NEWSLETTER ===")
    results = TestResults()
    
    # Generate unique email with timestamp
    timestamp = int(time.time())
    unique_email = f"test-{timestamp}@example.com"
    newsletter_id = None
    
    try:
        # 1. POST subscribe with unique email
        print(f"\n1. Testing POST subscribe with {unique_email}")
        response = requests.post(f"{BASE_URL}/newsletter/subscribe", 
                               json={"email": unique_email})
        
        if response.status_code == 201:
            data = response.json()
            if (data.get("ok") == True and 
                ("berlangganan" in data.get("message", "") or "Terima kasih" in data.get("message", ""))):
                results.add_result("Newsletter subscribe creates new subscription", True)
            else:
                results.add_result("Newsletter subscribe creates new subscription", False,
                                 f"Expected ok=true and success message, got: {data}")
        else:
            results.add_result("Newsletter subscribe creates new subscription", False,
                             f"Expected 201, got {response.status_code}: {response.text}")
        
        # 2. POST same email again - should be idempotent
        print(f"\n2. Testing POST same email again (idempotent)")
        response = requests.post(f"{BASE_URL}/newsletter/subscribe", 
                               json={"email": unique_email})
        
        if response.status_code == 200:
            data = response.json()
            if "sudah terdaftar" in data.get("message", ""):
                results.add_result("Newsletter subscribe is idempotent", True)
            else:
                results.add_result("Newsletter subscribe is idempotent", False,
                                 f"Expected 'sudah terdaftar' message, got: {data}")
        else:
            results.add_result("Newsletter subscribe is idempotent", False,
                             f"Expected 200, got {response.status_code}: {response.text}")
        
        # 3. Test invalid email
        print("\n3. Testing invalid email")
        response = requests.post(f"{BASE_URL}/newsletter/subscribe", 
                               json={"email": "bukan-email"})
        
        if response.status_code == 400:
            data = response.json()
            if "Email tidak valid" in data.get("error", ""):
                results.add_result("Newsletter rejects invalid email", True)
            else:
                results.add_result("Newsletter rejects invalid email", False,
                                 f"Expected 'Email tidak valid' error, got: {data}")
        else:
            results.add_result("Newsletter rejects invalid email", False,
                             f"Expected 400, got {response.status_code}: {response.text}")
        
        # 4. Test empty email
        print("\n4. Testing empty email")
        response = requests.post(f"{BASE_URL}/newsletter/subscribe", 
                               json={"email": ""})
        
        if response.status_code == 400:
            results.add_result("Newsletter rejects empty email", True)
        else:
            results.add_result("Newsletter rejects empty email", False,
                             f"Expected 400, got {response.status_code}: {response.text}")
        
        # 5. Admin GET newsletter list with token
        print("\n5. Testing admin GET newsletter list")
        token = get_admin_token()
        if token:
            headers = {"Authorization": f"Bearer {token}"}
            response = requests.get(f"{BASE_URL}/admin/newsletter", headers=headers)
            
            if response.status_code == 200:
                data = response.json()
                if isinstance(data.get("data"), list):
                    # Find our email in the list
                    found_email = any(item.get("email") == unique_email for item in data["data"])
                    if found_email:
                        # Get the ID for deletion test
                        for item in data["data"]:
                            if item.get("email") == unique_email:
                                newsletter_id = item.get("id")
                                break
                        results.add_result("Admin GET newsletter includes new email", True)
                    else:
                        results.add_result("Admin GET newsletter includes new email", False,
                                         f"Email {unique_email} not found in list")
                else:
                    results.add_result("Admin GET newsletter includes new email", False,
                                     f"Expected data array, got: {data}")
            else:
                results.add_result("Admin GET newsletter includes new email", False,
                                 f"Expected 200, got {response.status_code}: {response.text}")
        else:
            results.add_result("Admin GET newsletter includes new email", False, "No admin token")
        
        # 6. GET newsletter without token
        print("\n6. Testing GET newsletter without token")
        response = requests.get(f"{BASE_URL}/admin/newsletter")
        
        if response.status_code == 401:
            results.add_result("GET newsletter without token returns 401", True)
        else:
            results.add_result("GET newsletter without token returns 401", False,
                             f"Expected 401, got {response.status_code}: {response.text}")
        
        # 7. DELETE newsletter with token
        print("\n7. Testing DELETE newsletter with token")
        if token and newsletter_id:
            headers = {"Authorization": f"Bearer {token}"}
            response = requests.delete(f"{BASE_URL}/admin/newsletter/{newsletter_id}", headers=headers)
            
            if response.status_code == 200:
                results.add_result("DELETE newsletter with token succeeds", True)
                
                # Verify it's gone from the list
                response = requests.get(f"{BASE_URL}/admin/newsletter", headers=headers)
                if response.status_code == 200:
                    data = response.json()
                    found_email = any(item.get("email") == unique_email for item in data.get("data", []))
                    if not found_email:
                        results.add_result("Deleted newsletter removed from list", True)
                    else:
                        results.add_result("Deleted newsletter removed from list", False,
                                         "Email still appears in list after deletion")
            else:
                results.add_result("DELETE newsletter with token succeeds", False,
                                 f"Expected 200, got {response.status_code}: {response.text}")
        else:
            results.add_result("DELETE newsletter with token succeeds", False, "No token or newsletter_id")
        
    except Exception as e:
        results.add_result("Newsletter Test Suite", False, f"Exception: {e}")
    
    return results

def main():
    """Run all tests"""
    print("=== CHOCOLICIOUS BACKEND API TESTING ===")
    print("Testing Product Reviews and Newsletter endpoints only")
    print(f"Base URL: {BASE_URL}")
    print(f"Admin: {ADMIN_EMAIL}")
    
    # Test Product Reviews
    review_results = test_product_reviews()
    
    # Test Newsletter
    newsletter_results = test_newsletter()
    
    # Combined summary
    total_passed = review_results.passed + newsletter_results.passed
    total_failed = review_results.failed + newsletter_results.failed
    total_tests = total_passed + total_failed
    
    print(f"\n=== FINAL SUMMARY ===")
    print(f"Product Reviews: {review_results.passed}/{review_results.passed + review_results.failed} passed")
    print(f"Newsletter: {newsletter_results.passed}/{newsletter_results.passed + newsletter_results.failed} passed")
    print(f"TOTAL: {total_passed}/{total_tests} tests passed")
    
    if total_failed == 0:
        print("🎉 ALL TESTS PASSED!")
        return True
    else:
        print(f"❌ {total_failed} tests failed")
        return False

if __name__ == "__main__":
    success = main()
    exit(0 if success else 1)