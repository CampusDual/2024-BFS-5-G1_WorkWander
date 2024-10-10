package com.campusdual.cd2024bfs5g1.model.core.service;

import com.campusdual.cd2024bfs5g1.api.core.service.ICoworkingService;
import com.campusdual.cd2024bfs5g1.model.core.dao.CoworkingDao;
import com.ontimize.jee.common.dto.EntityResult;
import com.ontimize.jee.server.dao.DefaultOntimizeDaoHelper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Lazy
@Service(value = "CoworkingService")
public class CoworkingService implements ICoworkingService {

    @Autowired
    private DefaultOntimizeDaoHelper daoHelper;
    @Autowired
    private CoworkingDao coworkingDao;

    @Override
    public EntityResult coworkingQuery(Map<String, Object> keyMap, List<String> attrList) {
        return this.daoHelper.query(this.coworkingDao, keyMap, attrList);
    }

    @Override
    public EntityResult coworkingInsert(Map<String, Object> attrMap) {
        return this.daoHelper.insert(this.coworkingDao, attrMap);
    }

    @Override
    public EntityResult coworkingUpdate(Map<String, Object> attrMap, Map<String, Object> keyMap) {
        return this.daoHelper.update(this.coworkingDao, attrMap, keyMap);
    }

    @Override
    public EntityResult coworkingDelete(Map<String, Object> keyMap) {
        return this.daoHelper.delete(this.coworkingDao, keyMap);
    }
}
