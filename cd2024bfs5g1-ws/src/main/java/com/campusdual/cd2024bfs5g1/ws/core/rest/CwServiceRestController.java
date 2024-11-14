package com.campusdual.cd2024bfs5g1.ws.core.rest;

import com.campusdual.cd2024bfs5g1.api.core.service.ICwServiceService;
import com.campusdual.cd2024bfs5g1.api.core.service.IServService;
import com.ontimize.jee.server.rest.ORestController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/cw_services")
public class CwServiceRestController extends ORestController<ICwServiceService> {

    @Autowired
    private ICwServiceService cwServiceService;

    @Override
    public ICwServiceService getService() {
        return this.cwServiceService;
    }
}
