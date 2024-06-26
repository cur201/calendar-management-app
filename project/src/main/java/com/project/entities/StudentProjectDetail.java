package com.project.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
@Entity
@Table(name = "student_project_detail")
public class StudentProjectDetail {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "student_code", nullable = true)
    private String studentCode;

    @Column(name = "class_id", nullable = true)
    private Long classId;

    @Column(name = "course_id", nullable = true)
    private String courseId;

    @Column(name = "course_name", nullable = true)
    private String courseName;

    @Column(name = "project_name", nullable = true)
    private String projectName;

    @Column(name = "instructor_id", nullable = false)
    private Long instructorId;

    @Column(name = "visible", nullable = true)
    private Long visible;
}
