"""
Automated Bulk Importer for Basaveshwara Jewels
This script:
1. Loops through all categories in frontend/public/designs/
2. Uploads each jewelry image to AWS S3 bucket 'jewel-catalog'
3. Sends product details to the product-service to save into RDS MySQL
"""

import os
import requests
import json
import mimetypes

# Configuration
API_URL = os.environ.get("PRODUCT_SERVICE_URL", "https://basaveshwara-jewels.duckdns.org/api/products")
DESIGNS_PATH = os.environ.get("DESIGNS_PATH", "../frontend/public/designs")

CATEGORY_MAPPING = {
    "bangles womens": {"category": "Bangles", "prefix": "Royal Filigree Gold Bangle", "weight": 24.5, "desc": "Handcrafted 22k gold bangle with intricate filigree artistry and high-polish finish."},
    "couples ring": {"category": "Rings", "prefix": "Eternal Couple Gold Band", "weight": 9.5, "desc": "Classic matching 22k gold wedding ring set designed for everlasting elegance."},
    "gold necklace": {"category": "Necklaces", "prefix": "Majestic Royal Gold Necklace", "weight": 42.0, "desc": "Grand traditional 22k gold necklace adorned with delicate temple and floral motifs."},
    "mens bracelets": {"category": "Bracelets", "prefix": "Men's Luxury Gold Bracelet", "weight": 28.0, "desc": "Substantial 22k gold bracelet for men engineered with secure locking clasp and durable links."},
    "mens neckchain": {"category": "Chains", "prefix": "Men's Sovereign Gold Chain", "weight": 30.0, "desc": "Solid 22k yellow gold curb chain designed for daily resilience and timeless prestige."},
    "mens pendant": {"category": "Pendants", "prefix": "Men's Sacred Gold Pendant", "weight": 10.5, "desc": "Distinguished 22k gold pendant sculpted with divine symbolism and fine laser detailing."},
    "mens ring": {"category": "Rings", "prefix": "Men's Regal Signet Gold Ring", "weight": 11.2, "desc": "Authoritative 22k solid gold signet ring featuring a handsome brush finish and beveled shoulders."},
    "womens bracelets": {"category": "Bracelets", "prefix": "Women's Graceful Gold Bracelet", "weight": 14.5, "desc": "Delicate 22k gold charm bracelet tailored with floral and geometric filigree links."},
    "womens earrings": {"category": "Earrings", "prefix": "Royal Jhumki Bridal Gold Earrings", "weight": 12.8, "desc": "Traditional 22k gold jhumkas and chandeliers crowned with tiny dancing gold droplets."},
    "womens nose pin": {"category": "Nose Pins", "prefix": "Classic Floral Gold Nose Pin", "weight": 1.5, "desc": "Delicate 22-karat gold nose pin meticulously crafted with subtle petal facets and mirror shine."},
    "womens pendant": {"category": "Pendants", "prefix": "Women's Lotus Gold Pendant", "weight": 7.8, "desc": "Inspiring 22k gold pendant inspired by blooming lotus petals and royal heritage motifs."},
    "womens ring": {"category": "Rings", "prefix": "Women's Royal Solitaire Gold Ring", "weight": 6.2, "desc": "Captivating 22k gold cocktail ring crowned with sculptural carvings and brilliant polish."}
}

def main():
    if not os.path.isdir(DESIGNS_PATH):
        # Try local path
        local_alt = "frontend/public/designs"
        if os.path.isdir(local_alt):
            designs_path = local_alt
        else:
            print(f"Error: Designs folder '{DESIGNS_PATH}' not found!")
            return
    else:
        designs_path = DESIGNS_PATH

    print(f"Starting bulk sync from '{designs_path}' to {API_URL}...")
    total_added = 0

    for folder_name in os.listdir(designs_path):
        folder_lower = folder_name.lower().strip()
        if folder_lower == "videos" or folder_lower not in CATEGORY_MAPPING:
            continue

        cat_info = CATEGORY_MAPPING[folder_lower]
        folder_full = os.path.join(designs_path, folder_name)
        if not os.path.isdir(folder_full):
            continue

        images = [f for f in os.listdir(folder_full) if f.lower().endswith(('.jpg', '.jpeg', '.png', '.webp'))]
        print(f"\n📂 Processing {cat_info['category']} ({len(images)} images in '{folder_name}')...")

        for idx, img_file in enumerate(images, start=1):
            img_path = os.path.join(folder_full, img_file)
            mime_type = mimetypes.guess_type(img_path)[0] or 'image/jpeg'

            # Step 1: Upload image to S3 via product-service upload endpoint
            try:
                with open(img_path, 'rb') as f:
                    upload_res = requests.post(
                        f"{API_URL}/upload",
                        files={"file": (img_file, f, mime_type)}
                    )

                if upload_res.status_code != 200:
                    print(f"  ❌ Failed to upload {img_file}: {upload_res.text}")
                    continue

                s3_url = upload_res.json().get("imageUrl")

                # Step 2: Create product in database
                weight = round(cat_info['weight'] + ((idx % 10) * 0.45), 2)
                payload = {
                    "name": f"{cat_info['prefix']} #{idx}",
                    "category": cat_info['category'],
                    "karat": 22,
                    "weightInGrams": weight,
                    "makingChargePercentage": 12.0,
                    "description": cat_info['desc'],
                    "imageUrl": s3_url,
                    "model3dUrl": "none"
                }

                save_res = requests.post(
                    f"{API_URL}/add",
                    json=payload,
                    headers={"Content-Type": "application/json"}
                )

                if save_res.status_code == 200:
                    print(f"  ✅ Saved: {payload['name']} -> {s3_url}")
                    total_added += 1
                else:
                    print(f"  ❌ Failed to save product {payload['name']}: {save_res.text}")

            except Exception as e:
                print(f"  ❌ Error processing {img_file}: {e}")

    print(f"\n🎉 Finished! Total products uploaded and added to database: {total_added}")

if __name__ == "__main__":
    main()
