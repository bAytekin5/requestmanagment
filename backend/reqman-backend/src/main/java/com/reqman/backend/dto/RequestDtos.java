package com.reqman.backend.dto;

import com.reqman.backend.domain.enums.RequestPriority;
import com.reqman.backend.domain.enums.RequestStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.Instant;

public class RequestDtos {

    private RequestDtos() {
    }

    public record CreateRequest(
            @NotBlank @Size(max = 150) String title,
            @NotBlank String description,
            @NotNull RequestPriority priority,
            @Size(max = 100) String category,
            @Size(max = 500) String attachmentUrl
    ) {
    }

    public record UpdateStatus(
            @NotNull RequestStatus status,
            @Size(max = 500) String resolutionNote,
            Long assigneeId
    ) {
    }

    public record RequestResponse(
            Long id,
            String title,
            String description,
            RequestPriority priority,
            RequestStatus status,
            String category,
            String attachmentUrl,
            String resolutionNote,
            Instant createdAt,
            Instant updatedAt,
            Long requesterId,
            String requesterName,
            Long assigneeId,
            String assigneeName
    ) {
    }

    public record UserSummary(Long id, String fullName, String email) {
    }

    public record RequestSummary(long total, long open, long inProgress, long resolved, long closed, long last7Days) {
    }
}

