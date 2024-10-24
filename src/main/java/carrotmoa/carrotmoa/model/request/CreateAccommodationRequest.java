package carrotmoa.carrotmoa.model.request;

import carrotmoa.carrotmoa.entity.Accommodation;
import carrotmoa.carrotmoa.entity.AccommodationSpace;
import carrotmoa.carrotmoa.entity.Post;
import jakarta.validation.constraints.*;
import lombok.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Getter
@Setter
@Slf4j
public class CreateAccommodationRequest {
    private static final Long SERVICE_ID = 8L;

    private Long userId; //호스트 ID

    @NotBlank(message = "숙소 이름은 필수 입력입니다.")
    private String title; // 숙소 이름

    @NotNull(message = "총 면적은 필수 입력입니다.")
    private Integer totalArea;

    @NotBlank(message = "도로명 주소는 필수 입력입니다.")
    private String roadAddress;

    @NotBlank(message = "지번 주소는 필수 입력입니다.")
    private String lotAddress;

    @NotBlank(message = "상세 주소는 필수 입력입니다.")
    private String detailAddress;

    @NotNull(message = "층 수는 필수 입력입니다.")
    @Min(value = 0, message = "층 수는 0 이상이어야 합니다.")
    private Integer floor;

    @NotNull(message = "총 층 수는 필수 입력입니다.")
    @Min(value = 1, message = "총 층 수는 1 이상이어야 합니다.")
    private Integer totalFloor;

    @NotNull(message = "가격은 필수 입력입니다.")
    private BigDecimal price;

    @NotBlank(message = "상세 설명은 필수 입력입니다.")
    private String content;

    @NotBlank(message = "교통 정보는 필수 입력입니다.")
    private String transportationInfo;


    // 관계 테이블 리스트 (Space 테이블에 방, 화장실, 거실, 주방 순서로 담겨 있어야)
    private List<AccommodationSpaceRequest> accommodationSpaces = new ArrayList<>(); // 초기화

    @Size(min = 1, message = "최소 하나 이상의 편의 시설을 선택해야 합니다.")
    private List<Long> amenityIds = new ArrayList<>();

    @Size(min = 4, max = 20, message = "이미지는 최소 4개, 최대 20개까지 업로드할 수 있습니다.")
    private List<MultipartFile> images; // 업로드된 이미지 파일들

    public Accommodation toAccommodationEntity() {
        return Accommodation.builder()
                .totalArea(totalArea)
                .roadAddress(roadAddress)
                .lotAddress(lotAddress)
                .detailAddress(detailAddress)
                .floor(floor)
                .totalFloor(totalFloor)
                .price(price)
                .transportationInfo(transportationInfo)
                .build();
    }

    public Post toPostEntity() {
        return Post.builder()
                .serviceId(SERVICE_ID)
                .userId(userId)
                .title(title)
                .content(content)
                .build();
    }

    public List<AccommodationSpace> toAccommodationSpaceEntities() {
        return accommodationSpaces.stream()
                .map(accommodationSpaceRequest -> {
                    AccommodationSpace accommodationSpace = new AccommodationSpace();
                    accommodationSpace.setAccommodationId(accommodationSpaceRequest.getAccommodationId());
                    accommodationSpace.setSpaceId(accommodationSpaceRequest.getSpaceId());
                    accommodationSpace.setCount(accommodationSpaceRequest.getCount());
                    return accommodationSpace;
                })
                .collect(Collectors.toList());
    }

    // 공간 초기화 메서드
    public void initializeSpaces(int spaceCount) {
        accommodationSpaces.clear(); // 기존 공간 초기화
        for (int i = 0; i < spaceCount; i++) {
            AccommodationSpaceRequest accommodationSpaceRequest = new AccommodationSpaceRequest();
            accommodationSpaceRequest.setSpaceId((long) (i + 1));
            accommodationSpaceRequest.setCount(0);
            accommodationSpaces.add(accommodationSpaceRequest);
        }
    }

    public void logRequestDetails() {
        log.info("Host ID: {}", userId);
        log.info("Accommodation Name: {}", title);
        log.info("Total Area: {}", totalArea);
        log.info("Road Address: {}", roadAddress);
        log.info("Lot Address: {}", lotAddress);
        log.info("Detail Address: {}", detailAddress);
        log.info("Floor: {}", floor);
        log.info("Total Floors: {}", totalFloor);
        log.info("Price: {}", price);
        log.info("Details: {}", content);
        log.info("Transportation Info: {}", transportationInfo);
        log.info("Selected Amenities IDs: {}", amenityIds);
        log.info("Number of uploaded images: {}", (images != null ? images.size() : 0));

        // AccommodationSpaces 로그 추가
        if (accommodationSpaces != null && !accommodationSpaces.isEmpty()) {
            for (AccommodationSpaceRequest space : accommodationSpaces) {
                log.info("Accommodation Space - Space ID: {}, Count: {}", space.getSpaceId(), space.getCount());
            }
        } else {
            log.info("No accommodation spaces provided.");
        }
    }

}