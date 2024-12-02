package com.campusdual.cd2024bfs5g1.model.core.dao;

import com.ontimize.jee.server.dao.common.ConfigurationFile;
import com.ontimize.jee.server.dao.jdbc.OntimizeJdbcDaoSupport;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Repository;

@Repository(value = "EventDao")
@Lazy
@ConfigurationFile(
        configurationFile = "dao/EventDao.xml",
        configurationFilePlaceholder = "dao/placeholders.properties"
)
public class EventDao extends OntimizeJdbcDaoSupport {

    public static final String ID_EVENT = "id_event";
    public static final String NAME = "name";
    public static final String DESCRIPTION = "description";
    public static final String DATE_EVENT = "date_event";
    public static final String HOUR_EVENT = "hour_event";
    public static final String ADDRESS = "address";
    public static final String LOCALITY = "locality";
    public static final String BOOKINGS = "bookings";
    public static final String USR_ID = "usr_id";
    public static final String DURATION = "duration";
    public static final String IMAGE_EVENT = "image_event";
    public static final String PRICE = "price";
    public static final String MYEVENTS_QUERY = "myEvents";
    public static final String HOMEEVENTS_QUERY = "homeEvents";
    public static final String MYEVENTSCALENDAR_QUERY = "myEventsCalendar";

    public EventDao() {
        super();
    }
}
