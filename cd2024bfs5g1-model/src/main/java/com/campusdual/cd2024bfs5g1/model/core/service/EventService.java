package com.campusdual.cd2024bfs5g1.model.core.service;

import com.campusdual.cd2024bfs5g1.api.core.service.IEventService;
import com.campusdual.cd2024bfs5g1.model.core.dao.EventDao;
import com.campusdual.cd2024bfs5g1.model.core.dao.UserDao;
import com.ontimize.jee.common.dto.EntityResult;
import com.ontimize.jee.common.exceptions.OntimizeJEERuntimeException;
import com.ontimize.jee.common.security.PermissionsProviderSecured;
import com.ontimize.jee.common.services.user.UserInformation;
import com.ontimize.jee.server.dao.DefaultOntimizeDaoHelper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.access.annotation.Secured;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

@Lazy
@Service("EventService")
public class EventService implements IEventService {

    @Autowired
    private EventDao eventDao;

    @Autowired
    private DefaultOntimizeDaoHelper daoHelper;

    @Override
    @Secured({ PermissionsProviderSecured.SECURED })
    @Transactional(rollbackFor = Exception.class)
    public EntityResult eventQuery(Map<String, Object> keyMap, List<String> attrList) {
        return this.daoHelper.query(this.eventDao, keyMap, attrList);
    }

    @Override
    @Secured({ PermissionsProviderSecured.SECURED })
    @Transactional(rollbackFor = Exception.class)
    public EntityResult eventInsert(Map<String, Object> attributes) throws OntimizeJEERuntimeException {
        Object user = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        int userId = (int)((UserInformation) user).getOtherData().get(UserDao.USR_ID);
        attributes.put(EventDao.USR_ID ,userId);

        return this.daoHelper.insert(this.eventDao, attributes);
    }
}
