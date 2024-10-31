package com.campusdual.cd2024bfs5g1.api.core.service;

import com.ontimize.jee.common.dto.EntityResult;

import java.util.List;
import java.util.Map;

public interface IServService {
    public EntityResult serviceQuery(Map<String, Object> keyMap, List<String> attrList);

    public EntityResult serviceInsert(Map<String, Object> attrMap);

    public EntityResult serviceUpdate(Map<String, Object> attrMap, Map<String, Object> keyMap);

    public EntityResult serviceDelete(Map<String, Object> keyMap);
}
