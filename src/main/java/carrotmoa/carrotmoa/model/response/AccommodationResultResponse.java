package carrotmoa.carrotmoa.model.response;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;

@Getter
@Setter
@Builder
public class AccommodationResultResponse {
    private long id;
    private String title;
    private String roadAddress;
    private BigDecimal price;
    private String imageUrl;
    private List<Integer> roomTypeCount; // 방 유형 개수를 담는 리스트

    public static AccommodationResultResponse fromData(Object[] data) {
        List<Integer> roomTypeCounts = Arrays.asList(
                (Integer) data[5], // 방 개수
                (Integer) data[6], // 화장실 개수
                (Integer) data[7], // 거실 개수
                (Integer) data[8]  // 주방 개수
        );

        return AccommodationResultResponse.builder()
                .id((Long) data[0])
                .title((String) data[1])
                .roadAddress((String) data[2])
                .price((BigDecimal) data[3])
                .imageUrl((String) data[4])
                .roomTypeCount(roomTypeCounts)
                .build();
    }
}