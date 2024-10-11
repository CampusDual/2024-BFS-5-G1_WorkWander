package com.campusdual.cd2024bfs5g1.model.core.dao;

import com.ontimize.jee.server.dao.common.ConfigurationFile;
import com.ontimize.jee.server.dao.jdbc.OntimizeJdbcDaoSupport;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Repository;

@Repository(value = "CoworkingDao")
@Lazy
@ConfigurationFile(configurationFile = "dao/CoworkingDao.xml",
        configurationFilePlaceholder = "dao/placeholders.properties")
public class CoworkingDao extends OntimizeJdbcDaoSupport{
    public static final String CW_ID          = "ID";
    public static final String CW_NAME        = "NAME";
    public static final String CW_DESCRIPTION = "DESCRIPTION";
    public static final String CW_ADDRESS     = "ADDRESS";
    public static final String CW_LOCATION    = "LOCATION";
    public static final String CW_CAPACITY    = "CAPACITY";
    public static final String CW_DAILY_PRICE = "DAILY_PRICE";
    public static final String CW_USER_ID     = "USER_ID";
    public static final String CW_START_DATE  = "START_DATE";
    public static final String CW_END_DATE    = "END_DATE";
}