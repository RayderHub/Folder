package com.rayder.mi_api.model;

import java.util.List;

public class PortfolioData {
    private String name;
    private String profession;
    private List<String> experience;
    private List<String> videoTypes;
    private List<String> studies;
    private List<String> courses;

    public PortfolioData() {}

    public PortfolioData(String name, String profession, List<String> experience, List<String> videoTypes, List<String> studies, List<String> courses) {
        this.name = name;
        this.profession = profession;
        this.experience = experience;
        this.videoTypes = videoTypes;
        this.studies = studies;
        this.courses = courses;
    }

    // Getters and Setters
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getProfession() { return profession; }
    public void setProfession(String profession) { this.profession = profession; }
    public List<String> getExperience() { return experience; }
    public void setExperience(List<String> experience) { this.experience = experience; }
    public List<String> getVideoTypes() { return videoTypes; }
    public void setVideoTypes(List<String> videoTypes) { this.videoTypes = videoTypes; }
    public List<String> getStudies() { return studies; }
    public void setStudies(List<String> studies) { this.studies = studies; }
    public List<String> getCourses() { return courses; }
    public void setCourses(List<String> courses) { this.courses = courses; }
}
