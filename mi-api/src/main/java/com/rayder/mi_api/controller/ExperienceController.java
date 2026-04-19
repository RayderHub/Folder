package com.rayder.mi_api.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class ExperienceController {

    @GetMapping("/experience")
    public String experience(Model model) {
        model.addAttribute("content", "experience");
        return "index";
    }
}
