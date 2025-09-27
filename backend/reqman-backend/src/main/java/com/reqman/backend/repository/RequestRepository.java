package com.reqman.backend.repository;

import com.reqman.backend.domain.entity.Request;
import com.reqman.backend.domain.enums.RequestPriority;
import com.reqman.backend.domain.enums.RequestStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface RequestRepository extends JpaRepository<Request, Long>, JpaSpecificationExecutor<Request> {
    long countByStatus(RequestStatus status);
    long countByPriority(RequestPriority priority);
}

