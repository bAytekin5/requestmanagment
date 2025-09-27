package com.reqman.backend.service;

import com.reqman.backend.domain.entity.Request;
import com.reqman.backend.domain.entity.User;
import com.reqman.backend.domain.enums.RequestPriority;
import com.reqman.backend.domain.enums.RequestStatus;
import com.reqman.backend.dto.RequestDtos;
import com.reqman.backend.repository.RequestRepository;
import com.reqman.backend.service.UserService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class RequestService {

    private final RequestRepository requestRepository;
    private final UserService userService;

    @Transactional
    public RequestDtos.RequestResponse createRequest(RequestDtos.CreateRequest dto, User requester) {
        Request request = new Request();
        request.setTitle(dto.title());
        request.setDescription(dto.description());
        request.setPriority(Optional.ofNullable(dto.priority()).orElse(RequestPriority.MEDIUM));
        request.setCategory(dto.category());
        request.setAttachmentUrl(dto.attachmentUrl());
        request.setRequester(requester);
        return mapToDto(requestRepository.save(request));
    }

    @Transactional
    public RequestDtos.RequestResponse updateStatusAndMap(Long requestId, RequestDtos.UpdateStatus dto) {
        Request request = getById(requestId);
        request.setStatus(dto.status());
        request.setResolutionNote(dto.resolutionNote());
        if (dto.assigneeId() != null) {
            request.setAssignee(userService.getById(dto.assigneeId()));
        } else {
            request.setAssignee(null);
        }
        return mapToDto(requestRepository.save(request));
    }

    @Transactional(readOnly = true)
    public Page<RequestDtos.RequestResponse> searchAndMap(RequestStatus status, RequestPriority priority, Long requesterId, String query, Pageable pageable) {
        Specification<Request> spec = buildSpecification(status, priority, requesterId, query);
        return requestRepository.findAll(spec, pageable)
                .map(this::mapToDto);
    }

    @Transactional(readOnly = true)
    public RequestDtos.RequestSummary getSummary() {
        long total = requestRepository.count();
        long open = requestRepository.countByStatus(RequestStatus.OPEN);
        long inProgress = requestRepository.countByStatus(RequestStatus.IN_PROGRESS);
        long resolved = requestRepository.countByStatus(RequestStatus.RESOLVED);
        long closed = requestRepository.countByStatus(RequestStatus.CLOSED);
        Instant sevenDaysAgo = Instant.now().minus(7, ChronoUnit.DAYS);
        long last7 = requestRepository.count((root, query, cb) -> cb.greaterThanOrEqualTo(root.get("createdAt"), sevenDaysAgo));

        return new RequestDtos.RequestSummary(total, open, inProgress, resolved, closed, last7);
    }

    @Transactional(readOnly = true)
    public Request getById(Long id) {
        return requestRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Request not found"));
    }

    private Specification<Request> buildSpecification(RequestStatus status, RequestPriority priority, Long requesterId, String queryText) {
        Specification<Request> spec = Specification.where(null);

        if (status != null) {
            spec = spec.and((root, query, cb) -> cb.equal(root.get("status"), status));
        }
        if (priority != null) {
            spec = spec.and((root, query, cb) -> cb.equal(root.get("priority"), priority));
        }
        if (requesterId != null) {
            spec = spec.and((root, query, cb) -> cb.equal(root.get("requester").get("id"), requesterId));
        }
        if (queryText != null && !queryText.isBlank()) {
            String likeExpr = "%" + queryText.trim().toLowerCase() + "%";
            spec = spec.and((root, query, cb) -> cb.or(
                    cb.like(cb.lower(root.get("title")), likeExpr),
                    cb.like(cb.lower(root.get("description")), likeExpr),
                    cb.like(cb.lower(root.get("category")), likeExpr)
            ));
        }

        return spec;
    }

    private RequestDtos.RequestResponse mapToDto(Request request) {
        return new RequestDtos.RequestResponse(
                request.getId(),
                request.getTitle(),
                request.getDescription(),
                request.getPriority(),
                request.getStatus(),
                request.getCategory(),
                request.getAttachmentUrl(),
                request.getResolutionNote(),
                request.getCreatedAt(),
                request.getUpdatedAt(),
                request.getRequester() != null ? request.getRequester().getId() : null,
                request.getRequester() != null ? request.getRequester().getFullName() : null,
                request.getAssignee() != null ? request.getAssignee().getId() : null,
                request.getAssignee() != null ? request.getAssignee().getFullName() : null
        );
    }
}

