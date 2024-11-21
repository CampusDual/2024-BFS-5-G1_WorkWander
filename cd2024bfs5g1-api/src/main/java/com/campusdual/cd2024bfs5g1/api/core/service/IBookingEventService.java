package com.campusdual.cd2024bfs5g1.api.core.service;

import com.ontimize.jee.common.dto.EntityResult;

import java.util.List;
import java.util.Map;

public interface IBookingEventService {
    public EntityResult bookingEventQuery(final Map<String, Object> keyMap, final List<String> attrList);

    public EntityResult bookingEventInsert(final Map<String, Object> attrMap);

    public EntityResult bookingEventUpdate(final Map<String, Object> attrMap, final Map<String, Object> keyMap);

    public EntityResult bookingEventDelete(final Map<String, Object> keyMap);

    public EntityResult getEventDisponibilityQuery(Map<String, Object> keyMap, List<String> attrList);

}
