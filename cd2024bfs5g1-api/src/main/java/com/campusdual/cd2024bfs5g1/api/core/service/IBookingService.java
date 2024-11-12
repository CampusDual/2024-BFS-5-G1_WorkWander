package com.campusdual.cd2024bfs5g1.api.core.service;

import com.ontimize.jee.common.dto.EntityResult;

import java.util.Date;
import java.util.List;
import java.util.Map;

public interface IBookingService {
    public EntityResult bookingQuery(Map<String, Object> keyMap, List<String> attrList);

    public EntityResult totalBookingsByDateQuery(Map<String, Object> keyMap, List<String> attrList);

    public EntityResult myBookingQuery(Map<String, Object> keyMap, List<String> attrList);

    public EntityResult bookingInsert(Map<String, Object> attrMap);

    public EntityResult bookingUpdate(Map<String, Object> attrMap, Map<String, Object> keyMap);

    public EntityResult bookingDelete(Map<String, Object> keyMap);

    public Map<Date, Boolean> getDatesDisponibilityQuery(Map<String, Object> keyMap, List<String> attrList);
}
