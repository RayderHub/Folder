package com.rayder.mi_api.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class VideosController {

    @GetMapping("/videos")
    public String videos(Model model) {
        model.addAttribute("content", "videos");
        return "index";
    }
}
