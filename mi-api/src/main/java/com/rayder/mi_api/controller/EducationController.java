package com.rayder.mi_api.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class EducationController {

    @GetMapping("/education")
    public String education(Model model) {
        model.addAttribute("content", "education");
        return "index";
    }
}
