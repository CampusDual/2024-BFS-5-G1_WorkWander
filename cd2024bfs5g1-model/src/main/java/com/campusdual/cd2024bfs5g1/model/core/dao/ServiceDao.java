package com.campusdual.cd2024bfs5g1.model.core.dao;

import com.ontimize.jee.server.dao.common.ConfigurationFile;
import com.ontimize.jee.server.dao.jdbc.OntimizeJdbcDaoSupport;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Repository;

@Repository(value = "ServiceDao")
@Lazy
@ConfigurationFile(configurationFile = "dao/ServiceDao.xml",
        configurationFilePlaceholder = "dao/placeholders.properties")
public class ServiceDao extends OntimizeJdbcDaoSupport{
    public static final String SRV_ID          = "srv_id";
    public static final String SRV_NAME        = "srv_name";
}
