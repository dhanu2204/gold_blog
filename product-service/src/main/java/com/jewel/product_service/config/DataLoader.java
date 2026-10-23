package com.jewel.product_service.config;

import java.io.File;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.jewel.product_service.model.Product;
import com.jewel.product_service.repository.ProductRepository;

@Component 
public class DataLoader implements CommandLineRunner {

    @Autowired 
    private ProductRepository productRepository;

    @Override
    public void run(String... args) throws Exception {
        if(productRepository.count() == 0)
        {
            System.out.println("Starting Automated Import from Database");
            File designdir = new File("c:/External/java/gold blog/frontend/public/designs");
            if(designdir.exists() && designdir.isDirectory())
            {
                File[] categoryFolders = designdir.listFiles(File :: isDirectory);

                for(File folder:categoryFolders)
                {
                    String foldername = folder.getName();
                    File[] images = folder.listFiles();
                    if(images != null)
                    {
                        for(File img: images)
                        {
                            Product p = new Product();
                            p.setName(foldername.toUpperCase() + "DESIGN");
                            p.setDescription("A beautiful "+ foldername+"crafted by us!");
                            p.setImageUrl("/designs/" + foldername + "/" + img.getName());
                            
                            String lowerName = foldername.toLowerCase();
                            if (lowerName.contains("earring")) p.setCategory("Earrings");
                            else if (lowerName.contains("ring")) p.setCategory("Rings");
                            else if (lowerName.contains("necklace") || lowerName.contains("neckchain")) p.setCategory("Necklaces");
                            else if (lowerName.contains("bangle")) p.setCategory("Bangles");
                            else if (lowerName.contains("bracelet")) p.setCategory("Bracelets");
                            else if (lowerName.contains("pendant")) p.setCategory("Pendants");
                            else p.setCategory("Others");
                            p.setWeightInGrams(Math.round((Math.random() * 20 + 5) * 100.0) / 100.0); 
                            p.setKarat(Math.random() > 0.5 ? 22 : 18);
                            p.setMakingChargePercentage(15.0);
                            
                            productRepository.save(p);
                        }
                    }
                }
                 System.out.println("✅ Bulk Import Complete! Loaded " + productRepository.count() + " designs!");
            }
             else {
                System.out.println("❌ Could not find designs folder at " + designdir.getAbsolutePath());
            }
        }
    }
}
