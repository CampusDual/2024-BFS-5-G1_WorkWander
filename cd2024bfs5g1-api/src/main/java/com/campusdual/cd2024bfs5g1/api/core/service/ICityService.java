package com.campusdual.cd2024bfs5g1.api.core.service;

import com.ontimize.jee.common.dto.EntityResult;

import java.util.List;
import java.util.Map;

public interface ICityService {

    public EntityResult cityQuery (Map<String, Object> keyMap, List<String> attrList);
}
