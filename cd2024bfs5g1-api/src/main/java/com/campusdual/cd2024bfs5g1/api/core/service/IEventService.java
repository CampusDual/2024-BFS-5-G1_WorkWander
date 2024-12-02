package com.campusdual.cd2024bfs5g1.api.core.service;

import com.ontimize.jee.common.db.AdvancedEntityResult;
import com.ontimize.jee.common.dto.EntityResult;
import com.ontimize.jee.common.exceptions.OntimizeJEERuntimeException;

import java.util.List;
import java.util.Map;

public interface IEventService {
    public EntityResult eventQuery(Map<String, Object> keyMap, List<String> attrList) throws OntimizeJEERuntimeException;

    public EntityResult eventInsert(Map<String, Object> attributes) throws OntimizeJEERuntimeException;

    public EntityResult myEventQuery(Map<String, Object> keyMap, List<String> attrList) throws OntimizeJEERuntimeException;

    public AdvancedEntityResult homeEventsPaginationQuery(Map<String, Object> keyMap, List<String> attrList,
            final int recordNumber, final int startIndex, final List<?> orderBy) throws OntimizeJEERuntimeException;

    public EntityResult myEventsCalendarQuery(Map<String, Object> keyMap, List<String> attrList) throws OntimizeJEERuntimeException;
}
