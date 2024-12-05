package com.campusdual.cd2024bfs5g1.model.core.dao;

import com.ontimize.jee.server.dao.common.ConfigurationFile;
import com.ontimize.jee.server.dao.jdbc.OntimizeJdbcDaoSupport;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Repository;


@Repository(value = "BookingDao")
@Lazy
@ConfigurationFile(configurationFile = "dao/BookingDao.xml",
        configurationFilePlaceholder = "dao/placeholders.properties")
public class BookingDao extends OntimizeJdbcDaoSupport {
    public static final String BK_ID = "bk_id";
    public static final String BK_USR_ID = "bk_usr_id";
    public static final String BK_CW_ID = "bk_cw_id";
    public static final String BK_STATE = "bk_state";
    public static final String TOTAL_BOOKINGS_DATE_QUERY = "totalBookingsByDate";
    public static final String DATES_BY_BOOKING_QUERY = "datesByBooking";
    public static final String OCCUPATION_BY_DATES = "occupationByDate";
    public static final String COWORKINGS_WITH_BOOKINGS = "coworkingsWithBookings";
}
