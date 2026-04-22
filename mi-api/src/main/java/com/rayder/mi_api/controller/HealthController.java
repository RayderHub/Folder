package com.rayder.mi_api.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HealthController {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @GetMapping("/health-db")
    public String healthDb() {
        try {
            // Esta consulta "despierta" a Supabase
            jdbcTemplate.execute("SELECT 1");
            return "DATABASE OK - Render & Supabase are awake!";
        } catch (Exception e) {
            return "ERROR: " + e.getMessage();
        }
    }
}
