package com.campusdual.cd2024bfs5g1.ws.core.rest;

import com.campusdual.cd2024bfs5g1.api.core.service.IBookingDateService;
import com.campusdual.cd2024bfs5g1.api.core.service.IBookingEventService;
import com.campusdual.cd2024bfs5g1.api.core.service.IBookingService;
import com.ontimize.jee.common.dto.EntityResult;
import com.ontimize.jee.server.rest.ORestController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/bookingEvent")

public class BookingEventRestController  extends ORestController<IBookingEventService>{

        @Autowired
        private IBookingEventService bookingEventService;

        @Override
        public IBookingEventService getService() {
                return this.bookingEventService;
        }

        @PostMapping("/getEventDisponibility")
        public EntityResult getEventDisponibilityQuery(@RequestBody Map<String, Object> keyMap) {
                return this.bookingEventService.getEventDisponibilityQuery(keyMap);
        }
}
