package carrotmoa.carrotmoa.service;

import carrotmoa.carrotmoa.entity.Reservation;
import carrotmoa.carrotmoa.model.response.ReservationResponse;
import carrotmoa.carrotmoa.repository.AccommodationRepository;
import carrotmoa.carrotmoa.repository.ReservationRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
public class ReservationListService {
    private final ReservationRepository reservationRepository;
    private final AccommodationRepository accommodationRepository;

    public ReservationListService(ReservationRepository reservationRepository, AccommodationRepository accommodationRepository) {
        this.reservationRepository = reservationRepository;
        this.accommodationRepository = accommodationRepository;
    }

//    @Transactional
//    public List<ReservationResponse> getUserReservations(Long id) {
//        List<Reservation> reservations = reservationRepository.findByUserId(id);
//
//        return reservations.stream()
//                .map(ReservationResponse::fromData)
//                .collect(Collectors.toList());
//    }
//    @Transactional
//    public ReservationResponse getReservationById(Long id) {
//        Object[] roomInfo = accommodationRepository.getReservation(id);
//
//        return ReservationResponse.fromData(roomInfo);
//    }
}
