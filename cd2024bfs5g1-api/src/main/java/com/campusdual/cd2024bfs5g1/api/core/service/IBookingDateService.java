package com.campusdual.cd2024bfs5g1.api.core.service;

import com.ontimize.jee.common.dto.EntityResult;

import java.util.List;
import java.util.Map;

public interface IBookingDateService {
    public EntityResult bookingDateQuery(final Map<String, Object> keyMap, final List<String> attrList);

    public EntityResult bookingDateInsert(final Map<String, Object> attrMap);

    public EntityResult bookingDateUpdate(final Map<String, Object> attrMap, final Map<String, Object> keyMap);

    public EntityResult bookingDateDelete(final Map<String, Object> keyMap);
}
