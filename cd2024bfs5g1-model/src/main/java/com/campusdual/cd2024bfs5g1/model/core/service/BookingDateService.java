package com.campusdual.cd2024bfs5g1.model.core.service;

import com.campusdual.cd2024bfs5g1.api.core.service.IBookingDateService;
import com.campusdual.cd2024bfs5g1.model.core.dao.BookingDateDao;
import com.ontimize.jee.common.dto.EntityResult;
import com.ontimize.jee.server.dao.DefaultOntimizeDaoHelper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service("BookingDateService")
public class BookingDateService implements IBookingDateService {
    @Autowired
    private DefaultOntimizeDaoHelper daoHelper;
    @Autowired
    private BookingDateDao bookingDateDao;


    @Override
    public EntityResult bookingDateQuery(final Map<String, Object> keyMap, final List<String> attrList) {
        return this.daoHelper.query(this.bookingDateDao, keyMap, attrList);
    }

    @Override
    public EntityResult bookingDateInsert(final Map<String, Object> attrMap) {
        return this.daoHelper.insert(this.bookingDateDao, attrMap);
    }

    @Override
    public EntityResult bookingDateUpdate(final Map<String, Object> attrMap, final Map<String, Object> keyMap) {
        return this.daoHelper.update(this.bookingDateDao, keyMap, attrMap);
    }

    @Override
    public EntityResult bookingDateDelete(final Map<String, Object> keyMap) {
        return this.daoHelper.delete(this.bookingDateDao, keyMap);
    }
}