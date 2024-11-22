package com.campusdual.cd2024bfs5g1.model.core.dao;

import com.ontimize.jee.server.dao.common.ConfigurationFile;
import com.ontimize.jee.server.dao.jdbc.OntimizeJdbcDaoSupport;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Repository;

@Repository(value = "BookingEventDao")
@Lazy
@ConfigurationFile(configurationFile = "dao/BookingEventDao.xml",
        configurationFilePlaceholder = "dao/placeholders.properties")

public class BookingEventDao  extends OntimizeJdbcDaoSupport {
    public static final String BKE_EVENT_ID = "bke_event_id"; //Identificador de la tabla
    public static final String BKE_ID_EVENT = "bke_id_event"; //ID del evento
    public static final String BKE_USR_ID = "bke_usr_id"; //Id del usuario
    public static final String BKE_EVENT_STATE = "bke_event_state"; //Estado del booking
}
