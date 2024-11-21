package com.campusdual.cd2024bfs5g1.ws.core.rest;

import com.campusdual.cd2024bfs5g1.api.core.service.IBookingDateService;
import com.campusdual.cd2024bfs5g1.api.core.service.IBookingEventService;
import com.campusdual.cd2024bfs5g1.api.core.service.IBookingService;
import com.ontimize.jee.server.rest.ORestController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/booking_events")

public class BookingEventRestController  extends ORestController<IBookingEventService>{

        @Autowired
        private IBookingEventService bookingEventService;

        @Override
        public IBookingEventService getService() {
            return this.bookingEventService;
        }
}
