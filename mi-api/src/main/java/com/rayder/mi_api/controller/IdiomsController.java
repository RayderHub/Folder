package com.rayder.mi_api.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class IdiomsController {

    @GetMapping("/idioms")
    public String idioms(Model model) {
        model.addAttribute("content", "idioms");
        return "index";
    }
}
