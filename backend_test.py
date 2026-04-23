#!/usr/bin/env python3
"""
Backend test for Chocolicious image upload functionality
Tests ONLY the newly added image upload endpoint and file serving
"""

import requests
import io
import os
from PIL import Image

# Configuration
BASE_URL = "https://choco-api-refresh.preview.emergentagent.com"
API_BASE = f"{BASE_URL}/api"
ADMIN_EMAIL = "firstahmadthahir@gmail.com"
ADMIN_PASSWORD = "chocolicious2026"

def test_image_upload():
    """Test the complete image upload functionality"""
    print("🧪 TESTING IMAGE UPLOAD FUNCTIONALITY")
    print("=" * 50)
    
    # Test 1: Login to get Bearer token
    print("\n1️⃣ Testing admin login...")
    try:
        login_response = requests.post(f"{API_BASE}/admin/login", json={
            "email": ADMIN_EMAIL,
            "password": ADMIN_PASSWORD
        })
        
        if login_response.status_code == 200:
            token_data = login_response.json()
            bearer_token = token_data.get("token")
            print(f"✅ Login successful, token received: {bearer_token[:20]}...")
        else:
            print(f"❌ Login failed: {login_response.status_code} - {login_response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Login error: {e}")
        return False
    
    # Test 2: Upload without token (expect 401)
    print("\n2️⃣ Testing upload without token (expect 401)...")
    try:
        # Create a small test image
        test_image = Image.new('RGB', (100, 100), color='red')
        img_buffer = io.BytesIO()
        test_image.save(img_buffer, format='PNG')
        img_buffer.seek(0)
        
        files = {'file': ('test.png', img_buffer, 'image/png')}
        upload_response = requests.post(f"{API_BASE}/admin/upload", files=files)
        
        if upload_response.status_code == 401:
            print("✅ Correctly returned 401 for unauthorized upload")
        else:
            print(f"❌ Expected 401, got {upload_response.status_code}: {upload_response.text}")
            
    except Exception as e:
        print(f"❌ Upload without token test error: {e}")
    
    # Test 3: Upload valid small image with Bearer token (expect 201)
    print("\n3️⃣ Testing valid image upload with token (expect 201)...")
    try:
        # Create a small test image
        test_image = Image.new('RGB', (200, 200), color='blue')
        img_buffer = io.BytesIO()
        test_image.save(img_buffer, format='PNG')
        img_buffer.seek(0)
        
        files = {'file': ('valid_test.png', img_buffer, 'image/png')}
        headers = {'Authorization': f'Bearer {bearer_token}'}
        
        upload_response = requests.post(f"{API_BASE}/admin/upload", files=files, headers=headers)
        
        if upload_response.status_code == 201:
            upload_data = upload_response.json()
            print("✅ Image upload successful!")
            print(f"   Response: {upload_data}")
            
            # Validate response structure
            required_keys = ['ok', 'url', 'path', 'size', 'contentType']
            missing_keys = [key for key in required_keys if key not in upload_data]
            if missing_keys:
                print(f"❌ Missing response keys: {missing_keys}")
            else:
                print("✅ Response has all required keys")
                
            # Validate response values
            if upload_data.get('ok') != True:
                print(f"❌ Expected ok=true, got {upload_data.get('ok')}")
            elif not upload_data.get('url', '').startswith('/api/files/chocolicious/uploads/'):
                print(f"❌ URL doesn't start with expected prefix: {upload_data.get('url')}")
            elif upload_data.get('size', 0) <= 0:
                print(f"❌ Size should be > 0, got {upload_data.get('size')}")
            elif not upload_data.get('contentType', '').startswith('image/'):
                print(f"❌ ContentType should start with 'image/', got {upload_data.get('contentType')}")
            else:
                print("✅ All response values are valid")
                
                # Store for next test
                file_url = upload_data.get('url')
                
        else:
            print(f"❌ Expected 201, got {upload_response.status_code}: {upload_response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Valid image upload test error: {e}")
        return False
    
    # Test 4: GET the returned URL (expect 200 with correct content-type)
    print("\n4️⃣ Testing file retrieval...")
    try:
        if file_url:
            # Convert relative URL to absolute
            full_file_url = f"{BASE_URL}{file_url}"
            file_response = requests.get(full_file_url)
            
            if file_response.status_code == 200:
                content_type = file_response.headers.get('content-type', '')
                content_length = len(file_response.content)
                
                if content_type.startswith('image/'):
                    print(f"✅ File retrieved successfully!")
                    print(f"   Content-Type: {content_type}")
                    print(f"   Content-Length: {content_length} bytes")
                else:
                    print(f"❌ Expected image/* content-type, got: {content_type}")
                    
                if content_length > 0:
                    print("✅ File has content (size > 0)")
                else:
                    print("❌ File appears to be empty")
                    
            else:
                print(f"❌ File retrieval failed: {file_response.status_code}")
        else:
            print("❌ No file URL to test")
            
    except Exception as e:
        print(f"❌ File retrieval test error: {e}")
    
    # Test 5: Upload non-image file (expect 400)
    print("\n5️⃣ Testing non-image file upload (expect 400)...")
    try:
        # Create a text file
        text_content = "This is a test text file, not an image" * 2  # ~50 bytes
        text_buffer = io.BytesIO(text_content.encode('utf-8'))
        
        files = {'file': ('test.txt', text_buffer, 'text/plain')}
        headers = {'Authorization': f'Bearer {bearer_token}'}
        
        upload_response = requests.post(f"{API_BASE}/admin/upload", files=files, headers=headers)
        
        if upload_response.status_code == 400:
            response_data = upload_response.json()
            print("✅ Correctly rejected non-image file with 400")
            print(f"   Error message: {response_data.get('error', 'No error message')}")
        else:
            print(f"❌ Expected 400, got {upload_response.status_code}: {upload_response.text}")
            
    except Exception as e:
        print(f"❌ Non-image upload test error: {e}")
    
    # Test 6: Upload >5MB file (expect 413)
    print("\n6️⃣ Testing large file upload >5MB (expect 413)...")
    try:
        # Create a large image (~6MB)
        large_image = Image.new('RGB', (2000, 2000), color='green')
        img_buffer = io.BytesIO()
        large_image.save(img_buffer, format='PNG')
        img_buffer.seek(0)
        
        # Check if the image is actually > 5MB
        img_size = len(img_buffer.getvalue())
        print(f"   Generated image size: {img_size / (1024*1024):.2f} MB")
        
        if img_size <= 5 * 1024 * 1024:
            # If not large enough, create raw bytes
            large_data = b'0' * (6 * 1024 * 1024)  # 6MB of zeros
            img_buffer = io.BytesIO(large_data)
            print(f"   Using raw data size: {len(large_data) / (1024*1024):.2f} MB")
        
        files = {'file': ('large_test.png', img_buffer, 'image/png')}
        headers = {'Authorization': f'Bearer {bearer_token}'}
        
        upload_response = requests.post(f"{API_BASE}/admin/upload", files=files, headers=headers)
        
        if upload_response.status_code == 413:
            response_data = upload_response.json()
            print("✅ Correctly rejected large file with 413")
            print(f"   Error message: {response_data.get('error', 'No error message')}")
        else:
            print(f"❌ Expected 413, got {upload_response.status_code}: {upload_response.text}")
            
    except Exception as e:
        print(f"❌ Large file upload test error: {e}")
    
    # Test 7: Missing "file" field (expect 400)
    print("\n7️⃣ Testing missing file field (expect 400)...")
    try:
        headers = {'Authorization': f'Bearer {bearer_token}'}
        
        # Send multipart request with wrong field name
        files = {'wrong_field': ('test.png', io.BytesIO(b'fake image data'), 'image/png')}
        upload_response = requests.post(f"{API_BASE}/admin/upload", files=files, headers=headers)
        
        if upload_response.status_code == 400:
            response_data = upload_response.json()
            print("✅ Correctly rejected missing file field with 400")
            print(f"   Error message: {response_data.get('error', 'No error message')}")
        else:
            print(f"❌ Expected 400, got {upload_response.status_code}: {upload_response.text}")
            
    except Exception as e:
        print(f"❌ Missing file field test error: {e}")
    
    print("\n" + "=" * 50)
    print("🎉 IMAGE UPLOAD TESTING COMPLETED")
    return True

if __name__ == "__main__":
    test_image_upload()