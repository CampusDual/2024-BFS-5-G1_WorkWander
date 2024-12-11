package com.campusdual.cd2024bfs5g1.model.core.dao;

import com.ontimize.jee.common.db.NullValue;
import com.ontimize.jee.common.db.SQLStatementBuilder;
import com.ontimize.jee.common.dto.EntityResult;
import com.ontimize.jee.common.dto.EntityResultMapImpl;
import com.ontimize.jee.common.tools.Chronometer;
import com.ontimize.jee.server.dao.ISQLQueryAdapter;
import com.ontimize.jee.server.dao.common.ConfigurationFile;
import com.ontimize.jee.server.dao.jdbc.EntityResultResultSetExtractor;
import com.ontimize.jee.server.dao.jdbc.OntimizeJdbcDaoSupport;
import com.ontimize.jee.server.dao.jdbc.QueryTemplateInformation;
import org.springframework.context.annotation.Lazy;
import org.springframework.jdbc.core.ArgumentPreparedStatementSetter;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;
import java.util.Objects;

@Repository(value = "CoworkingDao")
@Lazy
@ConfigurationFile(configurationFile = "dao/CoworkingDao.xml",
        configurationFilePlaceholder = "dao/placeholders.properties")
public class CoworkingDao extends OntimizeJdbcDaoSupport {
    public static final String CW_ID = "cw_id";
    public static final String CW_NAME = "cw_name";
    public static final String CW_DESCRIPTION = "cw_description";
    public static final String CW_ADDRESS = "cw_address";
    public static final String CW_LOCATION = "cw_location";
    public static final String CW_CAPACITY = "cw_capacity";
    public static final String CW_DAILY_PRICE = "cw_daily_price";
    public static final String CW_USER_ID = "cw_usr_id";
    public static final String CW_START_DATE = "cw_start_date";
    public static final String CW_END_DATE = "cw_end_date";
    public static final String CW_IMAGE = "cw_image";
    public static final String CW_QUERY_SERVICES = "serviceCoworking";
    public static final String CW_QUERY_CAPACITY = "coworkingCapacity";
    public static final String CW_QUERY_DATES = "filterDates";
    public static final String COWORKINGS_BY_USER = "coworkingsByUser";
    public static final String COWORKINGS_NAME_BY_NAME = "coworkingNameById";
    public static final String COW_LAT = "cw_lat";
    public static final String COW_LON = "cw_lon";
    private EntityResultMapImpl inputAttributesValues;

    @Override
    public EntityResult query(final Map<?, ?> keysValues, final List<?> attributes, final List<?> sort,
            final String queryId, ISQLQueryAdapter queryAdapter) {
        /*  Recuperamos los parámetros de Longitud y Latitud */
        String latOrigen = "";
        String lonOrigen = "";
        String distance = "";


        for(Map.Entry<String, ?> entry : inputAttributesValues.entrySet()) {
            String oKey = (String)entry.getKey();
            Object oValue = entry.getValue();
            if (Objects.equals(oKey, "LAT_ORIGEN")){
                latOrigen = (String) entry.getValue();
                keysValues.remove(oKey);
            }
            if (Objects.equals(oKey, "LON_ORIGEN")){
                lonOrigen = (String) entry.getValue();
                keysValues.remove(oKey);
            }
            if (Objects.equals(oKey, "DISTANCE")){
                distance = (String) entry.getValue();
                keysValues.remove(oKey);
            }
            if (oValue != null && !(oValue instanceof NullValue)) {
                hValidKeysValues.put(oKey, oValue);
            }
        }
        
        this.checkCompiled();
        final QueryTemplateInformation queryTemplateInformation = this.getQueryTemplateInformation(queryId);

        final SQLStatementBuilder.SQLStatement stSQL = this.composeQuerySql(queryId, attributes, keysValues, sort, null, queryAdapter);

        String sqlQuery = stSQL.getSQLStatement();
        final List<?> vValues = stSQL.getValues();

        /* Asignamos las variables para el parámetro de lat y longitud */
        if (latOrigen != null)  {
            sqlQuery = queryTemplateInformation.getSqlTemplate().replaceAll("#LAT_ORIGEN#", latOrigen);
        }
        if (lonOrigen != null){
            sqlQuery = queryTemplateInformation.getSqlTemplate().replaceAll("#LON_ORIGEN#", lonOrigen);
        }
        if (distance != null){
            sqlQuery = queryTemplateInformation.getSqlTemplate().replaceAll("#DISTANCE#", distance);
        }

        // TODO los atributos que se pasan al entityresultsetextractor tienen que ir "desambiguados" porque
        // cuando el DefaultSQLStatementHandler busca
        // las columnas toUpperCase y toLowerCase no tiene en cuenta el '.'
        Chronometer chrono = new Chronometer().start();
        try {

            JdbcTemplate jdbcTemplate = this.getJdbcTemplate();

            if (jdbcTemplate != null) {

                ArgumentPreparedStatementSetter pss = new ArgumentPreparedStatementSetter(vValues.toArray());

                return jdbcTemplate.query(sqlQuery, pss,
                        new EntityResultResultSetExtractor(this.getStatementHandler(), queryTemplateInformation,
                                attributes));
            }

            return new EntityResultMapImpl(EntityResult.OPERATION_WRONG, EntityResult.NODATA_RESULT);

        } finally {
            OntimizeJdbcDaoSupport.logger.trace("Time consumed in query+result= {} ms", chrono.stopMs());
        }
    }
}