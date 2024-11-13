package com.campusdual.cd2024bfs5g1.ws.core.rest;


import com.campusdual.cd2024bfs5g1.api.core.service.ICityService;
import com.ontimize.jee.server.rest.ORestController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/cities")
public class CityRestController extends ORestController<ICityService> {

    @Autowired
    private ICityService cityService;

    @Override
    public ICityService getService() {
        return this.cityService;
    }
}
