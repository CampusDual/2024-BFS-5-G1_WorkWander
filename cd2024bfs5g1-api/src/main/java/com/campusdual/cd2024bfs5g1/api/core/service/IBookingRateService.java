package com.campusdual.cd2024bfs5g1.api.core.service;

import com.ontimize.jee.common.dto.EntityResult;

import java.util.List;
import java.util.Map;

public interface IBookingRateService {
    public EntityResult bookingRateQuery(final Map<String, Object> keyMap, final List<String> attrList);

    public EntityResult bookingRateInsert(final Map<String, Object> attrMap);

    public EntityResult bookingRateUpdate(final Map<String, Object> attrMap, final Map<String, Object> keyMap);

    public EntityResult bookingRateDelete(final Map<String, Object> keyMap);
}
