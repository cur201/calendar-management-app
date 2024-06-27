package com.project.services;

import java.util.List;

import org.springframework.stereotype.Service;

import com.project.dto.StudentProjectDetailDto;
import com.project.entities.StudentProjectDetail;
import com.project.exceptions.UserNotFoundException;
import com.project.mappers.StudentProjectDetailMapper;
import com.project.repositories.StudentProjectDetailRepository;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class StudentProjectDetailService {
    private final StudentProjectDetailRepository studentProjectDetailRepository;
    private final StudentProjectDetailMapper studentProjectDetailMapper;

    public boolean isStudentProjectDetailExist(Long userId, Long classId) {
        List<StudentProjectDetail> studentList = studentProjectDetailRepository.findByUserIdAndClassId(userId, classId);
        return !studentList.isEmpty();
    }

    public void saveStudentProjectDetail(StudentProjectDetailDto studentProjectDetailDto) {
        StudentProjectDetail newStudentProjectDetail = studentProjectDetailMapper.toStudentProjectDetail(studentProjectDetailDto);
        studentProjectDetailRepository.save(newStudentProjectDetail);
    }

    public StudentProjectDetail getStudentProjectDetailById(Long studentProjectDetailId) throws Exception {
        return studentProjectDetailRepository.findById(studentProjectDetailId)
                                             .orElseThrow(() -> new Exception("Student Project Detail not found with ID: " + studentProjectDetailId));
    }
}
