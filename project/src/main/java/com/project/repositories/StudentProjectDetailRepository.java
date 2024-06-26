package com.project.repositories;

import java.util.List;

import org.springframework.data.jdbc.repository.query.Query;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;

import com.project.entities.StudentProjectDetail;

public interface StudentProjectDetailRepository extends JpaRepository<StudentProjectDetail, Long>{
    @Query("SELECT spd FROM StudentProjectDetail spd WHERE spd.userId = :userId AND spd.classId = :classId AND spd.visible = 1")
    List<StudentProjectDetail> findByUserIdAndClassId(@Param("userId") Long userId, @Param("classId") Long classId);

    List<StudentProjectDetail> findByInstructorId(Long instructorId);
}
