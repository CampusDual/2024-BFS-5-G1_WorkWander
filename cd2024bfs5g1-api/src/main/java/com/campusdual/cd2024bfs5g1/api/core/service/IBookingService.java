package com.campusdual.cd2024bfs5g1.api.core.service;

import com.ontimize.jee.common.db.AdvancedEntityResult;
import com.ontimize.jee.common.dto.EntityResult;
import com.ontimize.jee.common.exceptions.OntimizeJEERuntimeException;

import java.util.List;
import java.util.Map;

public interface IBookingService {
    public EntityResult bookingQuery(Map<String, Object> keyMap, List<String> attrList);


    //    TODO: query para traer si hay reservas posteriores para eliminar coworking
    EntityResult coworkingsWithBookingsQuery(Map<String, Object> keyMap, List<String> attrList);

    EntityResult totalBookingsByDateQuery(Map<String, Object> keyMap, List<String> attrList);

    AdvancedEntityResult datesByBookingPaginationQuery(Map<String, Object> keyMap, List<?> attrList,
            int recordNumber, int startIndex, List<?> orderBy) throws OntimizeJEERuntimeException;

    public EntityResult myBookingQuery(Map<String, Object> keyMap, List<String> attrList);

    public EntityResult datesByBookingQuery(Map<String, Object> keyMap, List<String> attrList);

    public EntityResult bookingInsert(Map<String, Object> attrMap);

    public EntityResult bookingUpdate(Map<String, Object> attrMap, Map<String, Object> keyMap);

    public EntityResult bookingDelete(Map<String, Object> keyMap);

    public EntityResult getDatesDisponibilityQuery(Map<String, Object> keyMap, final List<String> attrList);

    public EntityResult rangeBookingInsert(Map<String, Object> attrMap);

    public EntityResult occupationLinearChartQuery(final Map<String, Object> keyMapB, final List<String> attrList);

    public EntityResult occupationByDateQuery(Map<String, Object> keyMap, List<String> attrList);
}