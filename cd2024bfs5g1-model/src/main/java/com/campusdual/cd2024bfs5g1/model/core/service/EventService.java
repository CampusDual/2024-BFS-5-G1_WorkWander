package com.campusdual.cd2024bfs5g1.model.core.service;

import com.campusdual.cd2024bfs5g1.api.core.service.IEventService;
import com.campusdual.cd2024bfs5g1.model.core.dao.EventDao;
import com.campusdual.cd2024bfs5g1.model.core.dao.UserDao;
import com.ontimize.jee.common.db.AdvancedEntityResult;
import com.ontimize.jee.common.dto.EntityResult;
import com.ontimize.jee.common.exceptions.OntimizeJEERuntimeException;
import com.ontimize.jee.common.security.PermissionsProviderSecured;
import com.ontimize.jee.common.services.user.UserInformation;
import com.ontimize.jee.server.dao.DefaultOntimizeDaoHelper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.access.annotation.Secured;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Timestamp;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.format.DateTimeParseException;
import java.util.Date;
import java.util.List;
import java.util.Map;

@Lazy
@Service("EventService")
public class EventService implements IEventService {

    @Autowired
    private EventDao eventDao;

    @Autowired
    private DefaultOntimizeDaoHelper daoHelper;

    @Override
    //@Secured({PermissionsProviderSecured.SECURED})
    @Transactional(rollbackFor = Exception.class)
    public EntityResult eventQuery(final Map<String, Object> keyMap, final List<String> attrList) {
        return this.daoHelper.query(this.eventDao, keyMap, attrList);
    }

    @Override
    @Secured({PermissionsProviderSecured.SECURED})
    @Transactional(rollbackFor = Exception.class)
    public EntityResult eventInsert(final Map<String, Object> attributes) throws OntimizeJEERuntimeException {
        final Object user = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        final int userId = (int) ((UserInformation) user).getOtherData().get(UserDao.USR_ID);
        attributes.put(EventDao.USR_ID, userId);

        //Para convertir de String a Timestamp, ya que desde el front llega String y la base de datos acepta otro
        // formato
        if (attributes.containsKey("hour_event")) {
            final String hourEventStr = (String) attributes.get("hour_event");

            try {
                final Timestamp timestamp = Timestamp.valueOf("1970-01-01 " + hourEventStr);
                attributes.put("hour_event", timestamp);
            } catch (final DateTimeParseException e) {
                throw new OntimizeJEERuntimeException("Formato de hora incorrecto para hour_event: " + hourEventStr, e);
            }
        }

        // Asegura que el formato de entrada y el de salida coinciden con lo esperado
        final String inputPattern = "dd/MM/yyyy, H:mm:ss";
        final String outputPattern = "yyyy-MM-dd HH:mm:ss";
        final SimpleDateFormat inputFormat = new SimpleDateFormat(inputPattern);
        final SimpleDateFormat outputFormat = new SimpleDateFormat(outputPattern);

        try {
            // Extrae y analiza la fecha según el formato de entrada
            final String dateEventString = String.valueOf(attributes.get("date_event"));
            final Date parsedDate = inputFormat.parse(dateEventString);

            // Convierte a String en el formato de salida esperado
            final String formattedDate = outputFormat.format(parsedDate);

            // Guarda el valor formateado en attributes
            attributes.put("date_event", formattedDate);
        } catch (final ParseException e) {
            e.printStackTrace();
        }

        return this.daoHelper.insert(this.eventDao, attributes);
    }

    @Override
    public EntityResult myEventQuery(final Map<String, Object> keyMap, final List<String> attrList) throws OntimizeJEERuntimeException {
        final Object user = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        final int userId = (int) ((UserInformation) user).getOtherData().get(UserDao.USR_ID);
        keyMap.put(EventDao.USR_ID, userId);
        return this.daoHelper.query(this.eventDao, keyMap, attrList, this.eventDao.MYEVENTS_QUERY);
    }

    @Override
    public AdvancedEntityResult homeEventsPaginationQuery(final Map<String, Object> keyMap, final List<String> attrList,
            final int recordNumber, final int startIndex, final List<?> orderBy) throws OntimizeJEERuntimeException {
        return this.daoHelper.paginationQuery(this.eventDao, keyMap, attrList, recordNumber, startIndex,
                orderBy, this.eventDao.HOMEEVENTS_QUERY);
    }
}

