package com.campusdual.cd2024bfs5g1.model.core.service;

import com.campusdual.cd2024bfs5g1.api.core.service.IBookingRateService;
import com.campusdual.cd2024bfs5g1.model.core.dao.BookingRateDao;
import com.ontimize.jee.common.dto.EntityResult;
import com.ontimize.jee.server.dao.DefaultOntimizeDaoHelper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service("BookingRateService")
@Lazy
public class BookingRateService implements IBookingRateService {
    @Autowired
    private DefaultOntimizeDaoHelper daoHelper;
    @Autowired
    private BookingRateDao bookingRateDao;

    @Override
    public EntityResult bookingRateQuery(Map<String, Object> keyMap, List<String> attrList) {
        return this.daoHelper.query(this.bookingRateDao, keyMap, attrList);
    }

    @Override
    public EntityResult bookingRateInsert(Map<String, Object> attrMap) {
        return this.daoHelper.insert(this.bookingRateDao, attrMap);
    }

    @Override
    public EntityResult bookingRateUpdate(Map<String, Object> attrMap, Map<String, Object> keyMap) {
        return this.daoHelper.update(this.bookingRateDao, keyMap, attrMap);
    }

    @Override
    public EntityResult bookingRateDelete(Map<String, Object> keyMap) {
        return this.daoHelper.delete(this.bookingRateDao, keyMap);
    }
}