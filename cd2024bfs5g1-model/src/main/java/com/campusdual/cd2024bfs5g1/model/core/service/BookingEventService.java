package com.campusdual.cd2024bfs5g1.model.core.service;
import com.campusdual.cd2024bfs5g1.api.core.service.IBookingDateService;
import com.campusdual.cd2024bfs5g1.api.core.service.IBookingEventService;
import com.campusdual.cd2024bfs5g1.model.core.dao.*;
import com.ontimize.jee.common.dto.EntityResult;
import com.ontimize.jee.common.dto.EntityResultMapImpl;
import com.ontimize.jee.common.services.user.UserInformation;
import com.ontimize.jee.server.dao.DefaultOntimizeDaoHelper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service("BookingEventService")
@Lazy

public class BookingEventService implements IBookingEventService {
    @Autowired
    private DefaultOntimizeDaoHelper daoHelper;
    @Autowired
    private BookingEventDao bookingEventDao;
    @Autowired
    private EventDao eventDao;

    @Override
    public EntityResult bookingEventQuery(Map<String, Object> keyMap, List<String> attrList) {
        return this.daoHelper.query(this.bookingEventDao, keyMap, attrList);
    }

    @Override
    public EntityResult bookingEventInsert(Map<String, Object> attrMap) {
        // Obtener el usuario autenticado
        final Object user = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        final int userId = (int) ((UserInformation) user).getOtherData().get(UserDao.USR_ID);

        // Añadir el ID del usuario al mapa de atributos para el insert
        attrMap.put(BookingEventDao.BKE_USR_ID, userId);
        attrMap.put(BookingEventDao.BKE_EVENT_STATE,true);
        return this.daoHelper.insert(this.bookingEventDao, attrMap);

    }

    @Override
    public EntityResult bookingEventUpdate(Map<String, Object> attrMap, Map<String, Object> keyMap) {
        return this.daoHelper.update(this.bookingEventDao, keyMap, attrMap);
    }

    @Override
    public EntityResult bookingEventDelete(Map<String, Object> keyMap) {
        return this.daoHelper.delete(this.bookingEventDao, keyMap);
    }

    @Override
    public EntityResult getEventDisponibilityQuery(Map<String, Object> keyMap, List<String> attrList) {
        EntityResult result = new EntityResultMapImpl();

        // Paso 1: Obtener el total de plazas del evento
        List<String> eventAttrList = List.of(EventDao.BOOKINGS);
        EntityResult eventResult = this.daoHelper.query(this.eventDao, keyMap, eventAttrList);

        if (eventResult.calculateRecordNumber() == 0) {
            result.setCode(EntityResult.OPERATION_WRONG);
            result.setMessage("Event not found");
            return result;
        }

        int totalBookings = (int) eventResult.getRecordValues(0).get(EventDao.BOOKINGS);

        // Paso 2: Contar las inscripciones del evento
        Map<String, Object> bookingFilter = new HashMap<>();
        bookingFilter.put(BookingEventDao.BKE_ID_EVENT, keyMap.get(EventDao.ID_EVENT));

        EntityResult bookingResult = this.daoHelper.query(this.bookingEventDao, bookingFilter, List.of(BookingEventDao.BKE_ID_EVENT));
        int usedBookings = bookingResult.calculateRecordNumber();

        // Paso 3: Calcular plazas disponibles
        int availableBookings = totalBookings - usedBookings;

        // Paso 4: Devolver resultado
        result.put("totalEventBookings", totalBookings);
        result.put("usedEventBookings", usedBookings);
        result.put("availableEventBookings", availableBookings);

        result.setCode(EntityResult.OPERATION_SUCCESSFUL);
        return result;
    }

}
