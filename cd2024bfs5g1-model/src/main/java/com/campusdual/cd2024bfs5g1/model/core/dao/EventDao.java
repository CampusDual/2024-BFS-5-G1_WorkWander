package com.campusdual.cd2024bfs5g1.model.core.dao;

import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Repository;

import com.ontimize.jee.server.dao.common.ConfigurationFile;
import com.ontimize.jee.server.dao.jdbc.OntimizeJdbcDaoSupport;

@Repository(value="EventDao")
@Lazy
@ConfigurationFile(
        configurationFile = "dao/EventDao.xml",
        configurationFilePlaceholder = "dao/placeholders.properties"
)
public class EventDao extends OntimizeJdbcDaoSupport {

    public static final String ID_EVENT  = "id_event";
    public static final String NAME  = "name";
    public static final String DESCRIPTION  = "description";
    public static final String DATE_EVENT = "date_event";
    public static final String ADDRESS  = "address";
    public static final String LOCALITY  = "locality";
    public static final String BOOKINGS  = "bookings";

    public EventDao() {
        super();
    }
}
