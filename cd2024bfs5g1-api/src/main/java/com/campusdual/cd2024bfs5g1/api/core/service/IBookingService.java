package com.campusdual.cd2024bfs5g1.api.core.service;

import com.ontimize.jee.common.db.AdvancedEntityResult;
import com.ontimize.jee.common.dto.EntityResult;
import com.ontimize.jee.common.exceptions.OntimizeJEERuntimeException;

import java.util.List;
import java.util.Map;

public interface IBookingService {
    public EntityResult bookingQuery(Map<String, Object> keyMap, List<String> attrList);


    AdvancedEntityResult datesByBookingPaginationQuery(Map<String, Object> keyMap, List<?> attrList,
                                                       int recordNumber, int startIndex, List<?> orderBy) throws OntimizeJEERuntimeException;

    public EntityResult myBookingQuery(Map<String, Object> keyMap, List<String> attrList);

    public EntityResult datesByBookingQuery(Map<String, Object> keyMap, List<String> attrList);

    public EntityResult bookingInsert(Map<String, Object> attrMap);

    public EntityResult bookingUpdate(Map<String, Object> attrMap, Map<String, Object> keyMap);

    public EntityResult bookingDelete(Map<String, Object> keyMap);


}
