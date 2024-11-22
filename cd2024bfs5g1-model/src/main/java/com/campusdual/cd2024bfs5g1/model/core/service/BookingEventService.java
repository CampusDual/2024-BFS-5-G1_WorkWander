package com.campusdual.cd2024bfs5g1.model.core.service;

import com.campusdual.cd2024bfs5g1.api.core.service.IBookingEventService;
import com.campusdual.cd2024bfs5g1.model.core.dao.BookingEventDao;
import com.campusdual.cd2024bfs5g1.model.core.dao.EventDao;
import com.campusdual.cd2024bfs5g1.model.core.dao.UserDao;
import com.ontimize.jee.common.dto.EntityResult;
import com.ontimize.jee.common.dto.EntityResultMapImpl;
import com.ontimize.jee.common.services.user.UserInformation;
import com.ontimize.jee.server.dao.DefaultOntimizeDaoHelper;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service("BookingEventService")
@Lazy

public class BookingEventService implements IBookingEventService {
    private final DefaultOntimizeDaoHelper daoHelper;
    private final BookingEventDao bookingEventDao;
    private final EventDao eventDao;

    public BookingEventService(final DefaultOntimizeDaoHelper daoHelper,
            final BookingEventDao bookingEventDao,
            final EventDao eventDao) {
        this.daoHelper = daoHelper;
        this.bookingEventDao = bookingEventDao;
        this.eventDao = eventDao;
    }

    @Override
    public EntityResult bookingEventQuery(final Map<String, Object> keyMap, final List<String> attrList) {
        return this.daoHelper.query(this.bookingEventDao, keyMap, attrList);
    }

    @Override
    public EntityResult bookingEventInsert(final Map<String, Object> attrMap) {
        EntityResult retorno = new EntityResultMapImpl();
        final Map<String, Object> eventMap = new HashMap<>();

        // Obtener el usuario autenticado
        final Object user = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        final int userId = (int) ((UserInformation) user).getOtherData().get(UserDao.USR_ID);

        retorno.setCode(0);
        eventMap.put(this.eventDao.ID_EVENT, attrMap.get(this.bookingEventDao.BKE_ID_EVENT));

        // Verificamos cuantos espacios hay disponibles
        final List<String> eventAttrList = List.of(EventDao.ID_EVENT);

        final EntityResult resultado = this.getEventDisponibilityQuery(eventMap, eventAttrList);

        if (((Number) resultado.get("availableEventBookings")).intValue() > 0) {
            // Añadir el ID del usuario al mapa de atributos para el insert
            attrMap.put(BookingEventDao.BKE_USR_ID, userId);
            attrMap.put(BookingEventDao.BKE_EVENT_STATE, true);
            retorno = this.daoHelper.insert(this.bookingEventDao, attrMap);
            retorno.setMessage("BOOKINGS_CONFIRMED");
        } else {
            retorno.setMessage("NO_BOOKING_ENABLED");
        }
        return retorno;
    }

    @Override
    public EntityResult bookingEventUpdate(final Map<String, Object> attrMap, final Map<String, Object> keyMap) {
        return this.daoHelper.update(this.bookingEventDao, keyMap, attrMap);
    }

    @Override
    public EntityResult bookingEventDelete(final Map<String, Object> keyMap) {
        return this.daoHelper.delete(this.bookingEventDao, keyMap);
    }

    @Override
    public EntityResult getEventDisponibilityQuery(final Map<String, Object> keyMap, final List<String> attrList) {
        final EntityResult result = new EntityResultMapImpl();

        // Paso 1: Obtener el total de plazas del evento
        final List<String> eventAttrList = List.of(EventDao.BOOKINGS);
        final EntityResult eventResult = this.daoHelper.query(this.eventDao, keyMap, eventAttrList);

        if (eventResult.calculateRecordNumber() == 0) {
            result.setCode(EntityResult.OPERATION_WRONG);
            result.setMessage("Event not found");
            return result;
        }

        final int totalBookings = (int) eventResult.getRecordValues(0).get(EventDao.BOOKINGS);

        // Paso 2: Contar las inscripciones del evento
        final Map<String, Object> bookingFilter = new HashMap<>();
        bookingFilter.put(BookingEventDao.BKE_ID_EVENT, keyMap.get(EventDao.ID_EVENT));

        final EntityResult bookingResult = this.daoHelper.query(this.bookingEventDao, bookingFilter,
                List.of(BookingEventDao.BKE_ID_EVENT));

        final int usedBookings = bookingResult.calculateRecordNumber();

        // Paso 3: Calcular plazas disponibles
        final int availableBookings = totalBookings - usedBookings;

        // Paso 4: Devolver resultado
        result.put("totalEventBookings", totalBookings);
        result.put("usedEventBookings", usedBookings);
        result.put("availableEventBookings", availableBookings);

        result.setCode(EntityResult.OPERATION_SUCCESSFUL);
        return result;
    }

}
