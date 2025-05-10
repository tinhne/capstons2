package com.prediction.backend.controllers;

import com.prediction.backend.models.DiagnoseForm;
import com.prediction.backend.services.DiagnoseFormService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/diagnose-forms")
public class DiagnoseFormController {

    private final DiagnoseFormService diagnoseFormService;

    @Autowired
    public DiagnoseFormController(DiagnoseFormService diagnoseFormService) {
        this.diagnoseFormService = diagnoseFormService;
    }

    // Lưu thông tin mô tả bệnh từ người dùng
    @PostMapping
    public ResponseEntity<DiagnoseForm> createDiagnoseForm(@RequestBody DiagnoseForm diagnoseForm) {
        DiagnoseForm savedForm = diagnoseFormService.saveDiagnoseForm(diagnoseForm);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedForm);
    }

    // Cập nhật thông tin chẩn đoán từ bác sĩ
    @PutMapping("/{id}")
    public ResponseEntity<DiagnoseForm> updateDiagnoseForm(
            @PathVariable int id,
            @RequestParam String predict) {
        DiagnoseForm updatedForm = diagnoseFormService.updateDiagnoseForm(id, predict);
        return ResponseEntity.ok(updatedForm);
    }

    // Truy xuất thông tin để hiển thị cho người dùng
    @GetMapping("/{id}")
    public ResponseEntity<DiagnoseForm> getDiagnoseForm(@PathVariable int id) {
        Optional<DiagnoseForm> diagnoseForm = diagnoseFormService.getDiagnoseFormById(id);
        return diagnoseForm.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }
}