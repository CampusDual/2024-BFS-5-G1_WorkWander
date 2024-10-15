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
    public static final String CW_ID          = "id";
    public static final String CW_NAME        = "name";
    public static final String CW_DESCRIPTION = "description";
    public static final String CW_ADDRESS     = "address";
    public static final String CW_LOCATION    = "location";
    public static final String CW_CAPACITY    = "capacity";
    public static final String CW_DAILY_PRICE = "daily_price";
    public static final String CW_USER_ID     = "user_id";
    public static final String CW_START_DATE  = "start_date";
    public static final String CW_END_DATE    = "end_date";
}