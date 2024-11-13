package com.campusdual.cd2024bfs5g1.model.core.service;

import com.campusdual.cd2024bfs5g1.api.core.service.IBookingService;
import com.campusdual.cd2024bfs5g1.api.core.service.ICoworkingService;
import com.campusdual.cd2024bfs5g1.model.core.dao.BookingDao;
import com.campusdual.cd2024bfs5g1.model.core.dao.UserDao;
import com.ontimize.jee.common.dto.EntityResult;
import com.ontimize.jee.common.dto.EntityResultMapImpl;
import com.ontimize.jee.common.security.PermissionsProviderSecured;
import com.ontimize.jee.common.services.user.UserInformation;
import com.ontimize.jee.server.dao.DefaultOntimizeDaoHelper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.access.annotation.Secured;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;

@Lazy
@Service(value = "BookingService")
public class BookingService implements IBookingService {
    @Autowired
    private DefaultOntimizeDaoHelper daoHelper;
    @Autowired
    private BookingDao bookingDao;
    @Autowired
    private ICoworkingService cs;

    @Override
    public EntityResult bookingQuery(final Map<String, Object> keyMap, final List<String> attrList) {
        return this.daoHelper.query(this.bookingDao, keyMap, attrList);
    }

    @Override
    public EntityResult totalBookingsByDateQuery(final Map<String, Object> keyMap, final List<String> attrList) {
        return this.daoHelper.query(this.bookingDao, keyMap, attrList, BookingDao.TOTAL_BOOKINGS_DATE_QUERY);
    }

    @Override
    public EntityResult getDatesDisponibilityQuery(final Map<String, Object> keyMap, final List<String> attrList) {
        final Object datesObj = keyMap.get("bk_date");
        final List<Date> dates = new ArrayList<>();

        //Pasamos Fechas Object a Strings a Date
        if (datesObj instanceof List) {
            final List<String> datesList = (List<String>) datesObj;
            for (final String date : datesList) {
                final String processedDate = date.split("T")[0];
                final SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
                sdf.setTimeZone(TimeZone.getTimeZone("UTC"));
                final Date date2;
                try {
                    date2 = sdf.parse(processedDate);
                    dates.add(date2);
                } catch (final ParseException e) {
                    System.out.println("Error al parsear la fecha");
                    throw new RuntimeException(e);
                }
            }
        }

        //Sacamos las fechas intermedias
        final Date startDate = dates.get(0);
        final Date finalDate = dates.get(1);
        dates.clear();
        final Calendar calendar = Calendar.getInstance();
        calendar.setTime(startDate);
        for (Date d = startDate; d.getTime() != finalDate.getTime(); ) {
            calendar.add(Calendar.DAY_OF_YEAR, 1);
            d = calendar.getTime();
            dates.add(d);
        }
        if (dates.isEmpty()) {
            calendar.add(Calendar.DAY_OF_YEAR, 1);
            dates.add(calendar.getTime());
        }

        final Map<Date, Boolean> fechas = new HashMap<>();
        //Hacemos las consultas
        for (final Date date : dates) {
            final Map<String, Object> paramsCW = new HashMap<>();
            paramsCW.put("cw_id", keyMap.get("bk_cw_id"));

            final Map<String, Object> paramsB = new HashMap<>(keyMap);
            paramsB.put("date", date);
            paramsB.remove("bk_date");

            final EntityResult capacidad = this.cs.coworkingCapacityQuery(paramsCW, attrList);
            final EntityResult plazasOc = this.totalBookingsByDateQuery(paramsB, attrList);

            final int capacidadDisponible = ((ArrayList<Integer>) capacidad.get("cw_capacity")).get(0);
            final long plazasOcupadas = ((ArrayList<Long>) plazasOc.get("plazasOcupadas")).get(0);
            final int plazas = (int) plazasOcupadas;

            fechas.put(date, capacidadDisponible - plazas > 0);
        }
        final EntityResult r = new EntityResultMapImpl();
        r.setCode(0);
        r.put("data", fechas);
        return r;
    }

    @Override
    public EntityResult myBookingQuery(final Map<String, Object> keyMap, final List<String> attrList) {
        final Object user = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        final int userId = (int) ((UserInformation) user).getOtherData().get(UserDao.USR_ID);
        keyMap.put(BookingDao.BK_USR_ID, userId);
        return this.daoHelper.query(this.bookingDao, keyMap, attrList);
    }

    @Override
    @Secured({PermissionsProviderSecured.SECURED})
    public EntityResult bookingInsert(final Map<String, Object> attrMap) {
        // Obtener el usuario autenticado
        final Object user = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        final int userId = (int) ((UserInformation) user).getOtherData().get(UserDao.USR_ID);

        // Añadir el ID del usuario al mapa de atributos para el insert
        attrMap.put(BookingDao.BK_USR_ID, userId);

        // Ejecutar el insert usando el daoHelper
        return this.daoHelper.insert(this.bookingDao, attrMap);
    }

    @Override
    public EntityResult bookingUpdate(final Map<String, Object> attrMap, final Map<String, Object> keyMap) {
        return this.daoHelper.update(this.bookingDao, attrMap, keyMap);
    }

    @Override
    public EntityResult bookingDelete(final Map<String, Object> keyMap) {
        return this.daoHelper.delete(this.bookingDao, keyMap);
    }
}
