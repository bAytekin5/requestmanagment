package com.reqman.backend.controller.request;

import com.reqman.backend.domain.entity.User;
import com.reqman.backend.domain.enums.RequestPriority;
import com.reqman.backend.domain.enums.RequestStatus;
import com.reqman.backend.dto.RequestDtos;
import com.reqman.backend.service.RequestService;
import com.reqman.backend.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/requests")
@RequiredArgsConstructor
public class RequestController {

    private final RequestService requestService;
    private final UserService userService;

    @PostMapping
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<RequestDtos.RequestResponse> createRequest(@Valid @RequestBody RequestDtos.CreateRequest request) {
        RequestDtos.RequestResponse created = requestService.createRequest(request, getCurrentUser());
        return ResponseEntity.ok(created);
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<RequestDtos.RequestResponse> updateStatus(@PathVariable Long id,
                                                                    @Valid @RequestBody RequestDtos.UpdateStatus dto) {
        RequestDtos.RequestResponse updated = requestService.updateStatusAndMap(id, dto);
        return ResponseEntity.ok(updated);
    }

    @GetMapping
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    @Transactional(readOnly = true)
    public ResponseEntity<Page<RequestDtos.RequestResponse>> search(@RequestParam(required = false) RequestStatus status,
                                                                    @RequestParam(required = false) RequestPriority priority,
                                                                    @RequestParam(required = false) Long requesterId,
                                                                    @RequestParam(required = false) String q,
                                                                    Pageable pageable) {
        Page<RequestDtos.RequestResponse> page = requestService.searchAndMap(status, priority, requesterId, q, pageable);
        return ResponseEntity.ok(page);
    }

    @GetMapping("/admins")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<RequestDtos.UserSummary>> getAdmins() {
        return ResponseEntity.ok(userService.getAdmins());
    }

    @GetMapping("/summary")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<RequestDtos.RequestSummary> getSummary() {
        return ResponseEntity.ok(requestService.getSummary());
    }

    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Object principal = authentication.getPrincipal();
        if (principal instanceof UserDetails userDetails) {
            return userService.getByEmail(userDetails.getUsername());
        }
        throw new IllegalStateException("Unable to determine current user");
    }
}

