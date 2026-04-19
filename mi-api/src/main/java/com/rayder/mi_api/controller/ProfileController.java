package com.rayder.mi_api.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class ProfileController {

    @GetMapping("/")
    public String profile(Model model) {
        model.addAttribute("content", "profile");
        return "index";
    }
}
