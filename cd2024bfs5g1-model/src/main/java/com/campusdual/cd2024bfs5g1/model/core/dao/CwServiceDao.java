package com.campusdual.cd2024bfs5g1.model.core.dao;

import com.ontimize.jee.server.dao.common.ConfigurationFile;
import com.ontimize.jee.server.dao.jdbc.OntimizeJdbcDaoSupport;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Repository;

@Repository(value = "CwServiceDao")
@Lazy
@ConfigurationFile(configurationFile = "dao/CwServiceDao.xml",
        configurationFilePlaceholder = "dao/placeholders.properties")
public class CwServiceDao extends OntimizeJdbcDaoSupport{
    public static final String CSER_ID          = "cser_id";
    public static final String CW_ID        = "cw_id";
    public static final String SRV_ID        = "srv_id";
}
