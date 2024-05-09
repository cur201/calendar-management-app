package com.project.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.context.annotation.ComponentScan;

import java.sql.Time;

@ComponentScan
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
@Entity
@Table(name = "group_tbl")
public class GroupTbl {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "meeting_plan_id", nullable = false)
    private Long meetingPlanId;

    @Column(name = "leader_id", nullable = false)
    private Long leaderId;

    @Column(name = "approve_time", nullable = false)
    private Time approveTime;

    @Column(name = "visible", nullable = false)
    private Long visible;
}
