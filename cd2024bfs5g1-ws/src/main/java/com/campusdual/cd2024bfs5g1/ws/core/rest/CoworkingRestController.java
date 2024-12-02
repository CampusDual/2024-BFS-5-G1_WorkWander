package com.campusdual.cd2024bfs5g1.ws.core.rest;

import com.campusdual.cd2024bfs5g1.api.core.service.ICoworkingService;
import com.campusdual.cd2024bfs5g1.model.core.dao.BookingDateDao;
import com.ontimize.jee.common.db.AdvancedEntityResult;
import com.ontimize.jee.server.rest.AdvancedQueryParameter;
import com.ontimize.jee.server.rest.ORestController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/coworkings")
public class CoworkingRestController extends ORestController<ICoworkingService> {

    @Autowired
    private ICoworkingService coworkingService;

    @Override
    public ICoworkingService getService() {
        return this.coworkingService;
    }

    @RequestMapping(
            value = {"/{name}/advancedsearch"},
            method = {RequestMethod.POST},
            consumes = {"application/json"},
            produces = {"application/json"}
    )
    public ResponseEntity<AdvancedEntityResult> query(@PathVariable("name") String name,
            @RequestBody AdvancedQueryParameter aQueryParameter) throws Exception {

        aQueryParameter.getSqltypes().put(BookingDateDao.DATE, 91);
        return super.query(name, aQueryParameter);
    }
}