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
    public EntityResult bookingRateQuery(final Map<String, Object> keyMap, final List<String> attrList) {
        return this.daoHelper.query(this.bookingRateDao, keyMap, attrList);
    }

    @Override
    public EntityResult bookingValorationsPerCoworkingQuery(final Map<String, Object> keyMap,
            final List<String> attrList) {
        return this.daoHelper.query(this.bookingRateDao, keyMap, attrList, BookingRateDao.COWORKING_VALORATIONS);
    }

    @Override
    public EntityResult ratioAveragePerCoworkingQuery(final Map<String, Object> keyMap,
            final List<String> attrList) {
        return this.daoHelper.query(this.bookingRateDao, keyMap, attrList, BookingRateDao.COWORKING_AVERAGE_RATIO);
    }

    @Override
    public EntityResult bookingRateInsert(final Map<String, Object> attrMap) {
        return this.daoHelper.insert(this.bookingRateDao, attrMap);
    }

    @Override
    public EntityResult bookingRateUpdate(final Map<String, Object> attrMap, final Map<String, Object> keyMap) {
        return this.daoHelper.update(this.bookingRateDao, keyMap, attrMap);
    }

    @Override
    public EntityResult bookingRateDelete(final Map<String, Object> keyMap) {
        return this.daoHelper.delete(this.bookingRateDao, keyMap);
    }
}