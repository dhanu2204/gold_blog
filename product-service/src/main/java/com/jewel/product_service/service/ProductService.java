package com.jewel.product_service.service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.jewel.product_service.model.Product;
import com.jewel.product_service.repository.ProductRepository;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    public List<Product> getAllProducts() {
        return productRepository.findAllByOrderByCreatedAtDesc();
    }

    public Product getProductId(Long id) {
        return productRepository.findById(id).orElse(null);
    }

    public Product addProduct(Product product) {
        return productRepository.save(product);
    }

    public Product updateProduct(Long id, Product updatedProduct) {
        return productRepository.findById(id).map(existing -> {
            if (updatedProduct.getName() != null)
                existing.setName(updatedProduct.getName());
            if (updatedProduct.getCategory() != null)
                existing.setCategory(updatedProduct.getCategory());
            if (updatedProduct.getKarat() > 0)
                existing.setKarat(updatedProduct.getKarat());
            if (updatedProduct.getWeightInGrams() > 0)
                existing.setWeightInGrams(updatedProduct.getWeightInGrams());
            if (updatedProduct.getImageUrl() != null)
                existing.setImageUrl(updatedProduct.getImageUrl());
            if (updatedProduct.getDescription() != null)
                existing.setDescription(updatedProduct.getDescription());
            if (updatedProduct.getMakingChargePercentage() > 0)
                existing.setMakingChargePercentage(updatedProduct.getMakingChargePercentage());
            return productRepository.save(existing);
        }).orElse(null);
    }

    @Autowired
    private S3Service s3Service;

    public void deleteProduct(Long id) {
        productRepository.deleteById(id);
    }

    private static class CategoryConfig {
        String categoryName;
        String titlePrefix;
        double baseWeight;
        String description;

        CategoryConfig(String categoryName, String titlePrefix, double baseWeight, String description) {
            this.categoryName = categoryName;
            this.titlePrefix = titlePrefix;
            this.baseWeight = baseWeight;
            this.description = description;
        }
    }

    private CategoryConfig getCategoryConfig(String folderName) {
        if (folderName.contains("bangle")) {
            return new CategoryConfig("Bangles", "Royal Filigree Gold Bangle", 24.5, "Handcrafted 22k gold bangle with intricate filigree artistry and high-polish finish.");
        } else if (folderName.contains("couples ring")) {
            return new CategoryConfig("Rings", "Eternal Couple Gold Band", 9.5, "Classic matching 22k gold wedding ring set designed for everlasting elegance.");
        } else if (folderName.contains("necklace")) {
            return new CategoryConfig("Necklaces", "Majestic Royal Gold Necklace", 42.0, "Grand traditional 22k gold necklace adorned with delicate temple and floral motifs.");
        } else if (folderName.contains("mens bracelets")) {
            return new CategoryConfig("Bracelets", "Men's Luxury Gold Bracelet", 28.0, "Substantial 22k gold bracelet for men engineered with secure locking clasp and durable links.");
        } else if (folderName.contains("neckchain")) {
            return new CategoryConfig("Chains", "Men's Sovereign Gold Chain", 30.0, "Solid 22k yellow gold curb chain designed for daily resilience and timeless prestige.");
        } else if (folderName.contains("mens pendant")) {
            return new CategoryConfig("Pendants", "Men's Sacred Gold Pendant", 10.5, "Distinguished 22k gold pendant sculpted with divine symbolism and fine laser detailing.");
        } else if (folderName.contains("mens ring")) {
            return new CategoryConfig("Rings", "Men's Regal Signet Gold Ring", 11.2, "Authoritative 22k solid gold signet ring featuring a handsome brush finish and beveled shoulders.");
        } else if (folderName.contains("womens bracelets")) {
            return new CategoryConfig("Bracelets", "Women's Graceful Gold Bracelet", 14.5, "Delicate 22k gold charm bracelet tailored with floral and geometric filigree links.");
        } else if (folderName.contains("earring")) {
            return new CategoryConfig("Earrings", "Royal Jhumki Bridal Gold Earrings", 12.8, "Traditional 22k gold jhumkas and chandeliers crowned with tiny dancing gold droplets.");
        } else if (folderName.contains("nose pin")) {
            return new CategoryConfig("Nose Pins", "Classic Floral Gold Nose Pin", 1.5, "Delicate 22-karat gold nose pin meticulously crafted with subtle petal facets and mirror shine.");
        } else if (folderName.contains("womens pendant")) {
            return new CategoryConfig("Pendants", "Women's Lotus Gold Pendant", 7.8, "Inspiring 22k gold pendant inspired by blooming lotus petals and royal heritage motifs.");
        } else if (folderName.contains("womens ring")) {
            return new CategoryConfig("Rings", "Women's Royal Solitaire Gold Ring", 6.2, "Captivating 22k gold cocktail ring crowned with sculptural carvings and brilliant polish.");
        } else {
            return new CategoryConfig("Jewelry", "Basaveshwara Luxury Gold Ornament", 15.0, "Authentic 22k hallmarked gold masterpiece crafted by master jewelers.");
        }
    }

    private java.io.File findDesignsDirectory() {
        String[] candidatePaths = {
            "../frontend/public/designs",
            "frontend/public/designs",
            "/home/ubuntu/gold_blog/frontend/public/designs",
            "C:/External/java/gold blog/frontend/public/designs"
        };
        for (String path : candidatePaths) {
            java.io.File dir = new java.io.File(path);
            if (dir.exists() && dir.isDirectory()) {
                return dir;
            }
        }
        return null;
    }

    public Map<String, Object> syncAllDesignsToS3AndDatabase() {
        java.io.File designsDir = findDesignsDirectory();
        if (designsDir == null || !designsDir.exists()) {
            throw new RuntimeException("Designs directory not found! Ensure frontend/public/designs exists.");
        }

        java.io.File[] subdirs = designsDir.listFiles(java.io.File::isDirectory);
        if (subdirs == null || subdirs.length == 0) {
            throw new RuntimeException("No category folders found in " + designsDir.getAbsolutePath());
        }

        Map<String, Integer> uploadedCountPerCategory = new java.util.LinkedHashMap<>();
        int totalSaved = 0;

        for (java.io.File catFolder : subdirs) {
            String folderName = catFolder.getName().toLowerCase().trim();
            if (folderName.equals("videos")) {
                continue;
            }

            CategoryConfig config = getCategoryConfig(folderName);
            java.io.File[] files = catFolder.listFiles((dir, name) -> {
                String lower = name.toLowerCase();
                return lower.endsWith(".jpg") || lower.endsWith(".jpeg") || lower.endsWith(".png") || lower.endsWith(".webp");
            });

            if (files == null || files.length == 0) continue;

            int catSuccess = 0;
            int itemIndex = 1;

            for (java.io.File imgFile : files) {
                try {
                    String contentType = imgFile.getName().toLowerCase().endsWith(".png") ? "image/png" : "image/jpeg";
                    String s3Url = s3Service.uploadFile(imgFile, contentType);

                    double baseWeight = config.baseWeight + (Math.round((itemIndex % 10) * 0.45 * 100.0) / 100.0);

                    Product product = new Product();
                    product.setName(config.titlePrefix + " #" + itemIndex);
                    product.setCategory(config.categoryName);
                    product.setKarat(22);
                    product.setWeightInGrams(baseWeight);
                    product.setMakingChargePercentage(12.0);
                    product.setDescription(config.description);
                    product.setImageUrl(s3Url);
                    product.setModel3dUrl("none");
                    product.setCreatedAt(java.time.LocalDateTime.now());

                    productRepository.save(product);
                    catSuccess++;
                    totalSaved++;
                    itemIndex++;
                } catch (Exception ex) {
                    System.err.println("Failed to upload " + imgFile.getName() + ": " + ex.getMessage());
                }
            }
            uploadedCountPerCategory.put(config.categoryName, catSuccess);
        }

        return Map.of(
            "status", "SUCCESS",
            "message", "Successfully uploaded designs to AWS S3 and saved into RDS MySQL!",
            "totalProductsAdded", totalSaved,
            "categoryBreakdown", uploadedCountPerCategory
        );
    }

}
