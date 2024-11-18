package com.campusdual.cd2024bfs5g1.ws.core.rest;

import com.campusdual.cd2024bfs5g1.api.core.service.IBookingDateService;
import com.ontimize.jee.server.rest.ORestController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/bookingDate")
public class BookingDateRestController extends ORestController<IBookingDateService> {

    @Autowired
    private IBookingDateService bookingDateService;

    @Override
    public IBookingDateService getService() {
        return this.bookingDateService;
    }
}
