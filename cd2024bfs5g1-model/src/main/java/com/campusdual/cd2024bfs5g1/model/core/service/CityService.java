package com.campusdual.cd2024bfs5g1.model.core.service;

import com.campusdual.cd2024bfs5g1.api.core.service.ICityService;
import com.campusdual.cd2024bfs5g1.model.core.dao.CityDao;
import com.ontimize.jee.common.dto.EntityResult;
import com.ontimize.jee.server.dao.DefaultOntimizeDaoHelper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Lazy
@Service (value ="CityService")
public class CityService implements ICityService {

    @Autowired
    private DefaultOntimizeDaoHelper daoHelper;
    @Autowired
    private CityDao cityDao;

    @Cacheable (value="citiesCache")
    @Override
    public EntityResult cityQuery(Map<String, Object> keyMap, List<String> attrList) {
        return daoHelper.query(this.cityDao, keyMap,attrList);
    }
}
