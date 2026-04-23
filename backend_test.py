#!/usr/bin/env python3
"""
Chocolicious Backend API Test Suite
Tests all REST API endpoints for the Chocolicious website
"""

import requests
import json
import sys
from typing import Dict, Any, Optional

# Base URL from environment
BASE_URL = "https://choco-api-refresh.preview.emergentagent.com/api"

# Admin credentials
ADMIN_EMAIL = "firstahmadthahir@gmail.com"
ADMIN_PASSWORD = "chocolicious2026"

class ChocoliciousAPITester:
    def __init__(self):
        self.base_url = BASE_URL
        self.admin_token = None
        self.test_results = []
        self.created_items = {}  # Track created items for cleanup
        
    def log_test(self, test_name: str, success: bool, details: str = ""):
        """Log test result"""
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status} {test_name}")
        if details:
            print(f"   {details}")
        self.test_results.append({
            "test": test_name,
            "success": success,
            "details": details
        })
        
    def make_request(self, method: str, endpoint: str, data: Dict = None, headers: Dict = None) -> requests.Response:
        """Make HTTP request with error handling"""
        url = f"{self.base_url}/{endpoint.lstrip('/')}"
        default_headers = {"Content-Type": "application/json"}
        if headers:
            default_headers.update(headers)
            
        try:
            if method.upper() == "GET":
                response = requests.get(url, headers=default_headers, timeout=30)
            elif method.upper() == "POST":
                response = requests.post(url, json=data, headers=default_headers, timeout=30)
            elif method.upper() == "PUT":
                response = requests.put(url, json=data, headers=default_headers, timeout=30)
            elif method.upper() == "DELETE":
                response = requests.delete(url, headers=default_headers, timeout=30)
            else:
                raise ValueError(f"Unsupported method: {method}")
                
            return response
        except requests.exceptions.RequestException as e:
            print(f"Request failed: {e}")
            raise
            
    def test_public_endpoints(self):
        """Test all public API endpoints"""
        print("\n=== TESTING PUBLIC ENDPOINTS ===")
        
        # Health check
        try:
            response = self.make_request("GET", "/health")
            if response.status_code == 200:
                data = response.json()
                if data.get("status") == "ok":
                    self.log_test("GET /api/health", True, f"Status: {data.get('status')}")
                else:
                    self.log_test("GET /api/health", False, f"Unexpected response: {data}")
            else:
                self.log_test("GET /api/health", False, f"Status: {response.status_code}")
        except Exception as e:
            self.log_test("GET /api/health", False, f"Error: {str(e)}")
            
        # Categories
        try:
            response = self.make_request("GET", "/categories")
            if response.status_code == 200:
                data = response.json()
                categories = data.get("data", [])
                if len(categories) == 8:
                    self.log_test("GET /api/categories", True, f"Found {len(categories)} categories")
                else:
                    self.log_test("GET /api/categories", False, f"Expected 8 categories, got {len(categories)}")
            else:
                self.log_test("GET /api/categories", False, f"Status: {response.status_code}")
        except Exception as e:
            self.log_test("GET /api/categories", False, f"Error: {str(e)}")
            
        # Products
        try:
            response = self.make_request("GET", "/products")
            if response.status_code == 200:
                data = response.json()
                products = data.get("data", [])
                if len(products) > 0:
                    # Check product structure
                    product = products[0]
                    required_fields = ["id", "slug", "name", "category", "price", "image"]
                    has_all_fields = all(field in product for field in required_fields)
                    if has_all_fields:
                        self.log_test("GET /api/products", True, f"Found {len(products)} products with correct structure")
                    else:
                        missing = [f for f in required_fields if f not in product]
                        self.log_test("GET /api/products", False, f"Missing fields: {missing}")
                else:
                    self.log_test("GET /api/products", False, "No products found")
            else:
                self.log_test("GET /api/products", False, f"Status: {response.status_code}")
        except Exception as e:
            self.log_test("GET /api/products", False, f"Error: {str(e)}")
            
        # Products by category
        try:
            response = self.make_request("GET", "/products?category=cake")
            if response.status_code == 200:
                data = response.json()
                products = data.get("data", [])
                if len(products) > 0:
                    # Check all products are cake category
                    all_cake = all(p.get("category") == "cake" for p in products)
                    if all_cake:
                        self.log_test("GET /api/products?category=cake", True, f"Found {len(products)} cake products")
                    else:
                        self.log_test("GET /api/products?category=cake", False, "Some products not in cake category")
                else:
                    self.log_test("GET /api/products?category=cake", False, "No cake products found")
            else:
                self.log_test("GET /api/products?category=cake", False, f"Status: {response.status_code}")
        except Exception as e:
            self.log_test("GET /api/products?category=cake", False, f"Error: {str(e)}")
            
        # Featured products
        try:
            response = self.make_request("GET", "/products?featured=true")
            if response.status_code == 200:
                data = response.json()
                products = data.get("data", [])
                if len(products) >= 7:  # Expect around 7 featured products
                    # Check all products are featured
                    all_featured = all(p.get("featured") == True for p in products)
                    if all_featured:
                        self.log_test("GET /api/products?featured=true", True, f"Found {len(products)} featured products")
                    else:
                        self.log_test("GET /api/products?featured=true", False, "Some products not marked as featured")
                else:
                    self.log_test("GET /api/products?featured=true", False, f"Expected ~7 featured products, got {len(products)}")
            else:
                self.log_test("GET /api/products?featured=true", False, f"Status: {response.status_code}")
        except Exception as e:
            self.log_test("GET /api/products?featured=true", False, f"Error: {str(e)}")
            
        # Product by slug (existing)
        try:
            response = self.make_request("GET", "/products/cake-blackforest")
            if response.status_code == 200:
                data = response.json()
                product = data.get("data")
                if product and product.get("slug") == "cake-blackforest":
                    self.log_test("GET /api/products/cake-blackforest", True, f"Found product: {product.get('name')}")
                else:
                    self.log_test("GET /api/products/cake-blackforest", False, "Product data incorrect")
            else:
                self.log_test("GET /api/products/cake-blackforest", False, f"Status: {response.status_code}")
        except Exception as e:
            self.log_test("GET /api/products/cake-blackforest", False, f"Error: {str(e)}")
            
        # Product by slug (non-existing)
        try:
            response = self.make_request("GET", "/products/slug-tidak-ada")
            if response.status_code == 404:
                self.log_test("GET /api/products/slug-tidak-ada", True, "Correctly returned 404 for non-existing product")
            else:
                self.log_test("GET /api/products/slug-tidak-ada", False, f"Expected 404, got {response.status_code}")
        except Exception as e:
            self.log_test("GET /api/products/slug-tidak-ada", False, f"Error: {str(e)}")
            
        # Branches
        try:
            response = self.make_request("GET", "/branches")
            if response.status_code == 200:
                data = response.json()
                branches = data.get("data", [])
                if len(branches) == 7:
                    self.log_test("GET /api/branches", True, f"Found {len(branches)} branches")
                else:
                    self.log_test("GET /api/branches", False, f"Expected 7 branches, got {len(branches)}")
            else:
                self.log_test("GET /api/branches", False, f"Status: {response.status_code}")
        except Exception as e:
            self.log_test("GET /api/branches", False, f"Error: {str(e)}")
            
        # Testimonials
        try:
            response = self.make_request("GET", "/testimonials")
            if response.status_code == 200:
                data = response.json()
                testimonials = data.get("data", [])
                if len(testimonials) == 3:
                    self.log_test("GET /api/testimonials", True, f"Found {len(testimonials)} testimonials")
                else:
                    self.log_test("GET /api/testimonials", False, f"Expected 3 testimonials, got {len(testimonials)}")
            else:
                self.log_test("GET /api/testimonials", False, f"Status: {response.status_code}")
        except Exception as e:
            self.log_test("GET /api/testimonials", False, f"Error: {str(e)}")
            
        # Articles
        try:
            response = self.make_request("GET", "/articles")
            if response.status_code == 200:
                data = response.json()
                articles = data.get("data", [])
                if len(articles) == 3:
                    self.log_test("GET /api/articles", True, f"Found {len(articles)} articles")
                else:
                    self.log_test("GET /api/articles", False, f"Expected 3 articles, got {len(articles)}")
            else:
                self.log_test("GET /api/articles", False, f"Status: {response.status_code}")
        except Exception as e:
            self.log_test("GET /api/articles", False, f"Error: {str(e)}")
            
        # Article by slug
        try:
            response = self.make_request("GET", "/articles/rekomendasi-toko-kue-di-makassar")
            if response.status_code == 200:
                data = response.json()
                article = data.get("data")
                if article and article.get("slug") == "rekomendasi-toko-kue-di-makassar":
                    self.log_test("GET /api/articles/rekomendasi-toko-kue-di-makassar", True, f"Found article: {article.get('title')}")
                else:
                    self.log_test("GET /api/articles/rekomendasi-toko-kue-di-makassar", False, "Article data incorrect")
            else:
                self.log_test("GET /api/articles/rekomendasi-toko-kue-di-makassar", False, f"Status: {response.status_code}")
        except Exception as e:
            self.log_test("GET /api/articles/rekomendasi-toko-kue-di-makassar", False, f"Error: {str(e)}")
            
        # FAQs
        try:
            response = self.make_request("GET", "/faqs")
            if response.status_code == 200:
                data = response.json()
                faqs = data.get("data", [])
                if len(faqs) == 6:
                    # Check if sorted by order
                    orders = [faq.get("order", 0) for faq in faqs]
                    is_sorted = orders == sorted(orders)
                    if is_sorted:
                        self.log_test("GET /api/faqs", True, f"Found {len(faqs)} FAQs sorted by order")
                    else:
                        self.log_test("GET /api/faqs", False, f"FAQs not sorted by order: {orders}")
                else:
                    self.log_test("GET /api/faqs", False, f"Expected 6 FAQs, got {len(faqs)}")
            else:
                self.log_test("GET /api/faqs", False, f"Status: {response.status_code}")
        except Exception as e:
            self.log_test("GET /api/faqs", False, f"Error: {str(e)}")
            
    def test_auth_endpoints(self):
        """Test authentication endpoints"""
        print("\n=== TESTING AUTH ENDPOINTS ===")
        
        # Login with correct credentials
        try:
            response = self.make_request("POST", "/admin/login", {
                "email": ADMIN_EMAIL,
                "password": ADMIN_PASSWORD
            })
            if response.status_code == 200:
                data = response.json()
                token = data.get("token")
                if token:
                    self.admin_token = token
                    self.log_test("POST /api/admin/login (correct credentials)", True, "Token received")
                else:
                    self.log_test("POST /api/admin/login (correct credentials)", False, "No token in response")
            else:
                self.log_test("POST /api/admin/login (correct credentials)", False, f"Status: {response.status_code}")
        except Exception as e:
            self.log_test("POST /api/admin/login (correct credentials)", False, f"Error: {str(e)}")
            
        # Login with wrong password
        try:
            response = self.make_request("POST", "/admin/login", {
                "email": ADMIN_EMAIL,
                "password": "wrongpassword"
            })
            if response.status_code == 401:
                self.log_test("POST /api/admin/login (wrong password)", True, "Correctly returned 401")
            else:
                self.log_test("POST /api/admin/login (wrong password)", False, f"Expected 401, got {response.status_code}")
        except Exception as e:
            self.log_test("POST /api/admin/login (wrong password)", False, f"Error: {str(e)}")
            
        # Get admin profile with token
        if self.admin_token:
            try:
                response = self.make_request("GET", "/admin/me", headers={
                    "Authorization": f"Bearer {self.admin_token}"
                })
                if response.status_code == 200:
                    data = response.json()
                    if data.get("email") == ADMIN_EMAIL:
                        self.log_test("GET /api/admin/me (with token)", True, f"Email: {data.get('email')}")
                    else:
                        self.log_test("GET /api/admin/me (with token)", False, f"Wrong email: {data.get('email')}")
                else:
                    self.log_test("GET /api/admin/me (with token)", False, f"Status: {response.status_code}")
            except Exception as e:
                self.log_test("GET /api/admin/me (with token)", False, f"Error: {str(e)}")
                
        # Get admin profile without token
        try:
            response = self.make_request("GET", "/admin/me")
            if response.status_code == 401:
                self.log_test("GET /api/admin/me (without token)", True, "Correctly returned 401")
            else:
                self.log_test("GET /api/admin/me (without token)", False, f"Expected 401, got {response.status_code}")
        except Exception as e:
            self.log_test("GET /api/admin/me (without token)", False, f"Error: {str(e)}")
            
    def test_admin_crud_endpoints(self):
        """Test admin CRUD endpoints"""
        print("\n=== TESTING ADMIN CRUD ENDPOINTS ===")
        
        if not self.admin_token:
            self.log_test("Admin CRUD tests", False, "No admin token available")
            return
            
        auth_headers = {"Authorization": f"Bearer {self.admin_token}"}
        
        # Test unauthorized access
        try:
            response = self.make_request("GET", "/admin/products")
            if response.status_code == 401:
                self.log_test("GET /api/admin/products (without token)", True, "Correctly returned 401")
            else:
                self.log_test("GET /api/admin/products (without token)", False, f"Expected 401, got {response.status_code}")
        except Exception as e:
            self.log_test("GET /api/admin/products (without token)", False, f"Error: {str(e)}")
            
        # Test CRUD for products
        self._test_crud_operations("products", {
            "name": "Test Cake Premium",
            "category": "cake",
            "price": 150000,
            "image": "https://example.com/test-cake.jpg",
            "description": "Test cake for API testing",
            "featured": True
        }, {"price": 175000}, auth_headers)
        
        # Test CRUD for articles
        self._test_crud_operations("articles", {
            "title": "Test Article Premium",
            "category": "Tips",
            "content": "This is a test article content for API testing.",
            "excerpt": "Test article excerpt",
            "thumbnail": "https://example.com/test-article.jpg"
        }, {"title": "Updated Test Article"}, auth_headers)
        
        # Test CRUD for branches
        self._test_crud_operations("branches", {
            "name": "Test Branch",
            "address": "Jl. Test No. 123, Makassar",
            "hours": "08.00 - 22.00",
            "whatsapp": "6285111230286"
        }, {"hours": "09.00 - 21.00"}, auth_headers)
        
        # Test CRUD for testimonials
        self._test_crud_operations("testimonials", {
            "name": "Test Customer",
            "role": "Customer",
            "message": "Test testimonial message",
            "image": "https://example.com/test-customer.jpg"
        }, {"message": "Updated test testimonial"}, auth_headers)
        
    def _test_crud_operations(self, resource: str, create_data: Dict, update_data: Dict, auth_headers: Dict):
        """Test CRUD operations for a specific resource"""
        created_id = None
        
        # CREATE
        try:
            response = self.make_request("POST", f"/admin/{resource}", create_data, auth_headers)
            if response.status_code == 201:
                data = response.json()
                item = data.get("data")
                if item and item.get("id"):
                    created_id = item["id"]
                    self.created_items[f"{resource}_{created_id}"] = created_id
                    # Check auto-slug generation for products and articles
                    if resource in ["products", "articles"] and "slug" in item:
                        self.log_test(f"POST /api/admin/{resource}", True, f"Created with auto-slug: {item.get('slug')}")
                    else:
                        self.log_test(f"POST /api/admin/{resource}", True, f"Created with ID: {created_id}")
                else:
                    self.log_test(f"POST /api/admin/{resource}", False, "No ID in response")
            else:
                self.log_test(f"POST /api/admin/{resource}", False, f"Status: {response.status_code}")
        except Exception as e:
            self.log_test(f"POST /api/admin/{resource}", False, f"Error: {str(e)}")
            
        # UPDATE
        if created_id:
            try:
                response = self.make_request("PUT", f"/admin/{resource}/{created_id}", update_data, auth_headers)
                if response.status_code == 200:
                    data = response.json()
                    item = data.get("data")
                    if item:
                        self.log_test(f"PUT /api/admin/{resource}/:id", True, "Updated successfully")
                    else:
                        self.log_test(f"PUT /api/admin/{resource}/:id", False, "No data in response")
                else:
                    self.log_test(f"PUT /api/admin/{resource}/:id", False, f"Status: {response.status_code}")
            except Exception as e:
                self.log_test(f"PUT /api/admin/{resource}/:id", False, f"Error: {str(e)}")
                
        # DELETE
        if created_id:
            try:
                response = self.make_request("DELETE", f"/admin/{resource}/{created_id}", headers=auth_headers)
                if response.status_code == 200:
                    data = response.json()
                    if data.get("ok"):
                        self.log_test(f"DELETE /api/admin/{resource}/:id", True, "Deleted successfully")
                        # Remove from tracking
                        if f"{resource}_{created_id}" in self.created_items:
                            del self.created_items[f"{resource}_{created_id}"]
                    else:
                        self.log_test(f"DELETE /api/admin/{resource}/:id", False, "Delete not confirmed")
                else:
                    self.log_test(f"DELETE /api/admin/{resource}/:id", False, f"Status: {response.status_code}")
            except Exception as e:
                self.log_test(f"DELETE /api/admin/{resource}/:id", False, f"Error: {str(e)}")
                
    def test_seo_routes(self):
        """Test SEO routes"""
        print("\n=== TESTING SEO ROUTES ===")
        
        # Test sitemap.xml
        try:
            response = requests.get("https://choco-api-refresh.preview.emergentagent.com/sitemap.xml", timeout=30)
            if response.status_code == 200:
                content_type = response.headers.get("content-type", "")
                if "xml" in content_type.lower():
                    content = response.text
                    if "/produk" in content and "/artikel" in content:
                        self.log_test("GET /sitemap.xml", True, f"XML content with product and article URLs")
                    else:
                        self.log_test("GET /sitemap.xml", False, "Missing expected URLs")
                else:
                    self.log_test("GET /sitemap.xml", False, f"Wrong content-type: {content_type}")
            else:
                self.log_test("GET /sitemap.xml", False, f"Status: {response.status_code}")
        except Exception as e:
            self.log_test("GET /sitemap.xml", False, f"Error: {str(e)}")
            
        # Test robots.txt
        try:
            response = requests.get("https://choco-api-refresh.preview.emergentagent.com/robots.txt", timeout=30)
            if response.status_code == 200:
                content_type = response.headers.get("content-type", "")
                if "text" in content_type.lower():
                    content = response.text
                    if "Disallow: /admin" in content:
                        self.log_test("GET /robots.txt", True, "Text content with admin disallow")
                    else:
                        self.log_test("GET /robots.txt", False, "Missing admin disallow rule")
                else:
                    self.log_test("GET /robots.txt", False, f"Wrong content-type: {content_type}")
            else:
                self.log_test("GET /robots.txt", False, f"Status: {response.status_code}")
        except Exception as e:
            self.log_test("GET /robots.txt", False, f"Error: {str(e)}")
            
    def run_all_tests(self):
        """Run all test suites"""
        print(f"🧪 Starting Chocolicious API Tests")
        print(f"Base URL: {self.base_url}")
        print(f"Admin Email: {ADMIN_EMAIL}")
        
        try:
            self.test_public_endpoints()
            self.test_auth_endpoints()
            self.test_admin_crud_endpoints()
            self.test_seo_routes()
        except Exception as e:
            print(f"Test suite failed: {e}")
            
        # Summary
        print("\n" + "="*50)
        print("TEST SUMMARY")
        print("="*50)
        
        passed = sum(1 for result in self.test_results if result["success"])
        total = len(self.test_results)
        
        print(f"Total Tests: {total}")
        print(f"Passed: {passed}")
        print(f"Failed: {total - passed}")
        print(f"Success Rate: {(passed/total*100):.1f}%" if total > 0 else "0%")
        
        # List failed tests
        failed_tests = [result for result in self.test_results if not result["success"]]
        if failed_tests:
            print(f"\n❌ FAILED TESTS ({len(failed_tests)}):")
            for test in failed_tests:
                print(f"  • {test['test']}: {test['details']}")
        else:
            print(f"\n🎉 ALL TESTS PASSED!")
            
        return passed == total

if __name__ == "__main__":
    tester = ChocoliciousAPITester()
    success = tester.run_all_tests()
    sys.exit(0 if success else 1)