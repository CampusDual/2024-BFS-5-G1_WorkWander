package com.campusdual.cd2024bfs5g1.api.core.service;

import com.ontimize.jee.common.dto.EntityResult;

import java.util.List;
import java.util.Map;

public interface IBookingDateService {

    public EntityResult bookingDateQuery(Map<String, Object> keyMap, List<String> attrList);

    public EntityResult bookingDateInsert(Map<String, Object> attrMap);

    public EntityResult bookingDateUpdate(Map<String, Object> attrMap, Map<String, Object> keyMap);

    public EntityResult bookingDateDelete(Map<String, Object> keyMap);
}
