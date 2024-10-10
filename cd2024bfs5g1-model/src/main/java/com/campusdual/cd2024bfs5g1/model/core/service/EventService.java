package com.campusdual.cd2024bfs5g1.model.core.service;

import com.campusdual.cd2024bfs5g1.api.core.service.IEventService;
import com.campusdual.cd2024bfs5g1.model.core.dao.EventDao;
import com.ontimize.jee.common.dto.EntityResult;
import com.ontimize.jee.common.exceptions.OntimizeJEERuntimeException;
import com.ontimize.jee.server.dao.DefaultOntimizeDaoHelper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;

@Lazy
@Service("EventService")
public class EventService implements IEventService {

    @Autowired
    private EventDao eventDao;

    @Autowired
    private DefaultOntimizeDaoHelper daoHelper;

    @Override
    @Transactional(rollbackFor = Exception.class)
    public EntityResult eventInsert(Map<String, Object> attributes) throws OntimizeJEERuntimeException {
        return this.daoHelper.insert(this.eventDao, attributes);
    }
}
