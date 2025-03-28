package com.campusdual.cd2024bfs5g1.api.core.service;

import com.ontimize.jee.common.db.AdvancedEntityResult;
import com.ontimize.jee.common.dto.EntityResult;
import com.ontimize.jee.common.exceptions.OntimizeJEERuntimeException;

import java.util.List;
import java.util.Map;

public interface ICoworkingService {
    public EntityResult coworkingQuery(Map<String, Object> keyMap, List<String> attrList);

    public EntityResult myCoworkingQuery(Map<String, Object> keyMap, List<String> attrList);

    public EntityResult serviceCoworkingQuery(Map<String, Object> keyMap, List<String> attrList);

    public EntityResult coworkingInsert(Map<String, Object> attrMap);

    public EntityResult coworkingUpdate(Map<String, Object> attrMap, Map<String, Object> keyMap);

    public EntityResult coworkingDelete(Map<String, Object> keyMap);

    public EntityResult coworkingCapacityQuery(Map<String, Object> keyMap, List<String> attrList);

    public AdvancedEntityResult serviceCoworkingPaginationQuery(Map<String, Object> keysValues, List<?> attributes,
            int recordNumber, int startIndex, List<?> orderBy);

    public EntityResult coworkingByUserQuery(final Map<String, Object> keyMap, final List<String> attrList);

    public EntityResult coworkingNameByIdQuery(final Map<String, Object> keyMap, final List<String> attrList);

    public EntityResult coworkingFacturationChartQuery(final Map<String, Object> keyMap, final List<String> attrList);

    public EntityResult coworkingNearbyQuery(Map<String, Object> keyMap, List<String> attrList);

    public EntityResult bookingsByDayQuery(Map<String, Object> keyMap, List<String> attrList);

    public EntityResult bookingsByMonthQuery(final Map<String, Object> keyMap, final List<String> attrList) throws OntimizeJEERuntimeException;
}
