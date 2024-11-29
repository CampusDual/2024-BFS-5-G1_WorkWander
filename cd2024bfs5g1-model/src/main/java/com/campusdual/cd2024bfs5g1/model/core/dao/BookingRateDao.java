package com.campusdual.cd2024bfs5g1.model.core.dao;

import com.ontimize.jee.server.dao.common.ConfigurationFile;
import com.ontimize.jee.server.dao.jdbc.OntimizeJdbcDaoSupport;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Repository;


@Repository(value = "BookingRateDao")
@Lazy
@ConfigurationFile(configurationFile = "dao/BookingRateDao.xml",
        configurationFilePlaceholder = "dao/placeholders.properties")
public class BookingRateDao extends OntimizeJdbcDaoSupport {
    public static final String ID_BKR = "id_bkr";
    public static final String BKR_DESCRIPTION = "bkr_description";
    public static final String BKR_RATIO = "bkr_ratio";
    public static final String CW_ID = "cw_id";
    public static final String USR_ID = "usr_id";
    public static final String COWORKING_VALORATIONS = "coworkingValorations";
    public static final String COWORKING_AVERAGE_RATIO = "coworkingAverageRatio";

}
