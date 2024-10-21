package com.campusdual.cd2024bfs5g1.ws.core.rest;

import com.campusdual.cd2024bfs5g1.api.core.service.IEventService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ontimize.jee.server.rest.ORestController;

@RestController
@RequestMapping("/events")
public class EventRestController extends ORestController<IEventService> {

    @Autowired
    private IEventService eventService;

    @Override
    public IEventService getService() {
        return this.eventService;
    }
}
