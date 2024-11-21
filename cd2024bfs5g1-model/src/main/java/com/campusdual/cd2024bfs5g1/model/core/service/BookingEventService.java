package com.campusdual.cd2024bfs5g1.model.core.service;
import com.campusdual.cd2024bfs5g1.api.core.service.IBookingDateService;
import com.campusdual.cd2024bfs5g1.api.core.service.IBookingEventService;
import com.campusdual.cd2024bfs5g1.model.core.dao.BookingDateDao;
import com.campusdual.cd2024bfs5g1.model.core.dao.BookingEventDao;
import com.ontimize.jee.common.dto.EntityResult;
import com.ontimize.jee.server.dao.DefaultOntimizeDaoHelper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service("BookingEventService")
@Lazy

public class BookingEventService implements IBookingEventService {
    @Autowired
    private DefaultOntimizeDaoHelper daoHelper;
    @Autowired
    private BookingEventDao bookingEventDao;

    @Override
    public EntityResult bookingEventQuery(Map<String, Object> keyMap, List<String> attrList) {
        return this.daoHelper.query(this.bookingEventDao, keyMap, attrList);
    }

    @Override
    public EntityResult bookingEventInsert(Map<String, Object> attrMap) {
        return this.daoHelper.insert(this.bookingEventDao, attrMap);
    }

    @Override
    public EntityResult bookingEventUpdate(Map<String, Object> attrMap, Map<String, Object> keyMap) {
        return this.daoHelper.update(this.bookingEventDao, keyMap, attrMap);
    }

    @Override
    public EntityResult bookingEventDelete(Map<String, Object> keyMap) {
        return this.daoHelper.delete(this.bookingEventDao, keyMap);
    }

    @Override
    public EntityResult getEventDisponibilityQuery(Map<String, Object> keyMap, List<String> attrList) {
        return null;
    }
}
