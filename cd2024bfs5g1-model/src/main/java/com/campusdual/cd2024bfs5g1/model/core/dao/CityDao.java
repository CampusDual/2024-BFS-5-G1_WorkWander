package com.campusdual.cd2024bfs5g1.model.core.dao;

import com.ontimize.jee.server.dao.common.ConfigurationFile;
import com.ontimize.jee.server.dao.jdbc.OntimizeJdbcDaoSupport;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Repository;

@Repository( value = "CityDao")
@Lazy
@ConfigurationFile(configurationFile = "dao/CityDao.xml",
        configurationFilePlaceholder = "dao/placeholders.properties")
public class CityDao extends OntimizeJdbcDaoSupport {


    public static final String ID_CITY = "id_city";
    public static final String CITY = "city";
}
