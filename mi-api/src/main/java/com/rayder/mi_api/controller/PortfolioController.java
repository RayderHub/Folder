package com.rayder.mi_api.controller;

import com.rayder.mi_api.model.PortfolioData;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Arrays;

@RestController
@RequestMapping("/api/portfolio")
public class PortfolioController {

    @GetMapping("/data")
    public PortfolioData getPortfolioData() {
        // Dummy data para el portafolio (simulando que viene de una BD o repositorio en
        // el futuro)
        return new PortfolioData(
                "Job de la Vega",
                "Editor de Video",
                Arrays.asList("Freelance Video Editor (2020-Presente)", "Editor en Agencia Creativa (2018-2020)"),
                Arrays.asList("Edición estilo YouTube/Twitch", "Montaje de Cortometrajes", "AMV y Edición estilo Anime",
                        "Videos Corporativos Animados"),
                Arrays.asList("Licenciatura en Comunicación Audiovisual", "Diplomado en Artes Visuales"),
                Arrays.asList("Curso Avanzado de Premiere Pro", "After Effects Masterclass: Motion Graphics",
                        "Técnicas de Colorización en DaVinci Resolve"));
    }
}
