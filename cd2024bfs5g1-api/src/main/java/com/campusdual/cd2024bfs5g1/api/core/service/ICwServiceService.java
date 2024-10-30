package com.campusdual.cd2024bfs5g1.api.core.service;

import com.ontimize.jee.common.dto.EntityResult;

import java.util.List;
import java.util.Map;

public interface ICwServiceService {
    public EntityResult cwServiceQuery(Map<String, Object> keyMap, List<String> attrList);

    public EntityResult cwServiceInsert(Map<String, Object> attrMap);

    public EntityResult cwServiceUpdate(Map<String, Object> attrMap, Map<String, Object> keyMap);

    public EntityResult cwServiceDelete(Map<String, Object> keyMap);
}