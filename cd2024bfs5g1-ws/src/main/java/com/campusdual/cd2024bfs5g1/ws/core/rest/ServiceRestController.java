package com.campusdual.cd2024bfs5g1.ws.core.rest;

import com.campusdual.cd2024bfs5g1.api.core.service.IServService;
import com.ontimize.jee.server.rest.ORestController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/services")
public class ServiceRestController extends ORestController<IServService> {

    @Autowired
    private IServService serviceService;

    @Override
    public IServService getService() {
        return this.serviceService;
    }
}
