package com.prediction.backend.models;

import jakarta.persistence.*;
import lombok.Data;
import java.sql.Date;
import java.sql.Time;

@Entity
@Table(name = "doctor_diagnose")
@Data
public class DiagnoseForm {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "date")
    private Date date;

    @Column(name = "main_symptom")
    private String main_symptom;

    @Column(name = "time_appear")
    private Time time_appear;

    @Column(name = "underlying_disease")
    private String underlying_disease;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "predict", columnDefinition = "TEXT")
    private String predict;
}