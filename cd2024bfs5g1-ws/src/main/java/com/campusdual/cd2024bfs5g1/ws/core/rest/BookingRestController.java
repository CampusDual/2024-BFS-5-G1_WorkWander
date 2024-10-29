package com.campusdual.cd2024bfs5g1.ws.core.rest;

import com.campusdual.cd2024bfs5g1.api.core.service.IBookingService;
import com.campusdual.cd2024bfs5g1.api.core.service.ICoworkingService;
import com.ontimize.jee.server.rest.ORestController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/bookings")
public class BookingRestController  extends ORestController<IBookingService> {

    @Autowired
    private IBookingService bookingService;

    @Override
    public IBookingService getService() {
        return this.bookingService;
    }
}





