package com.prediction.backend.services.impl;

import com.prediction.backend.models.DiagnoseForm;
import com.prediction.backend.repositories.DiagnoseFormRepository;
import com.prediction.backend.services.DiagnoseFormService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class DiagnoseFormServiceImpl implements DiagnoseFormService {

    private final DiagnoseFormRepository diagnoseFormRepository;

    @Autowired
    public DiagnoseFormServiceImpl(DiagnoseFormRepository diagnoseFormRepository) {
        this.diagnoseFormRepository = diagnoseFormRepository;
    }

    // Lưu thông tin mô tả bệnh từ người dùng
    public DiagnoseForm saveDiagnoseForm(DiagnoseForm diagnoseForm) {
        return diagnoseFormRepository.save(diagnoseForm);
    }

    // Cập nhật thông tin chẩn đoán từ bác sĩ
    public DiagnoseForm updateDiagnoseForm(int id, String predict) {
        Optional<DiagnoseForm> optionalDiagnoseForm = diagnoseFormRepository.findById(id);
        if (optionalDiagnoseForm.isPresent()) {
            DiagnoseForm diagnoseForm = optionalDiagnoseForm.get();
            diagnoseForm.setPredict(predict);
            return diagnoseFormRepository.save(diagnoseForm);
        } else {
            throw new RuntimeException("Diagnose form not found");
        }
    }

    // Truy xuất thông tin để hiển thị cho người dùng
    public Optional<DiagnoseForm> getDiagnoseFormById(int id) {
        return diagnoseFormRepository.findById(id);
    }
}