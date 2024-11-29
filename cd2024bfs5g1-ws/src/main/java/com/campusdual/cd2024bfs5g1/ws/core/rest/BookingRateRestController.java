package com.campusdual.cd2024bfs5g1.ws.core.rest;

import com.campusdual.cd2024bfs5g1.api.core.service.IBookingRateService;
import com.ontimize.jee.server.rest.ORestController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/bookingsRate")

public class BookingRateRestController extends ORestController<IBookingRateService> {

    @Autowired
    private IBookingRateService bookingRateService;

    @Override
    public IBookingRateService getService() {
        return this.bookingRateService;
    }
}

