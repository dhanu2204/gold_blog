package com.jewel.price_service.service;

import org.springframework.http.HttpHeaders;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;

@Service
public class PriceService {

    @Value("${goldpricez.key}")
    private String apiKey;

    @Cacheable("goldPrice")
    public String getLivePrices() {
        try {
            RestTemplate restTemplate = new RestTemplate();
            HttpHeaders headers = new HttpHeaders();
            headers.set("X-API-KEY", apiKey);
            HttpEntity<String> entity = new HttpEntity<>(headers);
            String url = "https://goldpricez.com/api/rates/currency/inr/measure/gram";
            ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, entity, String.class);
            if (response.getBody() != null) {
                ObjectMapper mapper = new ObjectMapper();
                JsonNode root = mapper.readTree(response.getBody());
                if(root.isTextual())
                {
                    root = mapper.readTree(root.asText());
                }
                double priceInInr = root.path("gram_in_inr").asDouble();
                return String.format("%.2f", priceInInr);
            }
        } catch (Exception e) {
            System.err.println("Failed to fetch goldprice" + e.getMessage());
        }
        return "{\"error\" : \"Could not fetch live prices\"}";
    }

    @CacheEvict(value = "goldPrice", allEntries = true)
    @Scheduled(fixedRate = 3600000)
    public void clearPriceCache()
    {
        System.out.println("Cleared gold price cache. Ready to fetch fresh price!");
    }

}
