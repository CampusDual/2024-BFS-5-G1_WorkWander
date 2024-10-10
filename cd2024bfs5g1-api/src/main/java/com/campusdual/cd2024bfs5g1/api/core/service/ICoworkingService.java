package com.campusdual.cd2024bfs5g1.api.core.service;

import com.ontimize.jee.common.dto.EntityResult;

import java.util.List;
import java.util.Map;

public interface ICoworkingService {
    public EntityResult coworkingQuery(Map<String, Object> keyMap, List<String> attrList);

    public EntityResult coworkingInsert(Map<String, Object> attrMap);

    public EntityResult coworkingUpdate(Map<String, Object> attrMap, Map<String, Object> keyMap);

    public EntityResult coworkingDelete(Map<String, Object> keyMap);
}
