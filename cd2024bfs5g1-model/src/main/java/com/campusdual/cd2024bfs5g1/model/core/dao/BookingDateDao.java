package com.campusdual.cd2024bfs5g1.model.core.dao;

import com.ontimize.jee.server.dao.common.ConfigurationFile;
import com.ontimize.jee.server.dao.jdbc.OntimizeJdbcDaoSupport;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Repository;

@Repository(value = "BookingDateDao")
@Lazy
@ConfigurationFile(configurationFile = "dao/BookingDateDao.xml",
        configurationFilePlaceholder = "dao/placeholders.properties")

public class BookingDateDao extends OntimizeJdbcDaoSupport {
    public static final String BK_ID = "bk_id";
    public static final String DATE = "date";
}
