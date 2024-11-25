package com.campusdual.cd2024bfs5g1.model.core.service;

import com.campusdual.cd2024bfs5g1.api.core.service.IBookingDateService;
import com.campusdual.cd2024bfs5g1.api.core.service.IBookingService;
import com.campusdual.cd2024bfs5g1.api.core.service.ICoworkingService;
import com.campusdual.cd2024bfs5g1.model.core.dao.BookingDao;
import com.campusdual.cd2024bfs5g1.model.core.dao.UserDao;
import com.ontimize.jee.common.db.AdvancedEntityResult;
import com.ontimize.jee.common.dto.EntityResult;
import com.ontimize.jee.common.dto.EntityResultMapImpl;
import com.ontimize.jee.common.exceptions.OntimizeJEERuntimeException;
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
import java.time.LocalDate;
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
    @Autowired
    private IBookingDateService bds;


    @Override
    public EntityResult bookingQuery(final Map<String, Object> keyMap, final List<String> attrList) {
        return this.daoHelper.query(this.bookingDao, keyMap, attrList);
    }

    @Override
    public EntityResult totalBookingsByDateQuery(final Map<String, Object> keyMap, final List<String> attrList) {
        return this.daoHelper.query(this.bookingDao, keyMap, attrList, BookingDao.TOTAL_BOOKINGS_DATE_QUERY);
    }

    @Override
    public AdvancedEntityResult datesByBookingPaginationQuery(final Map<String, Object> keyMap, final List<?> attrList, final int recordNumber, final int startIndex, final List<?> orderBy) throws OntimizeJEERuntimeException {
        final Object user = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        final int userId = (int) ((UserInformation) user).getOtherData().get(UserDao.USR_ID);
        keyMap.put(BookingDao.BK_USR_ID, userId);
        return this.daoHelper.paginationQuery(this.bookingDao, keyMap, attrList, recordNumber, startIndex,
                orderBy, BookingDao.DATES_BY_BOOKING_QUERY);
    }

    @Override
    public EntityResult myBookingQuery(final Map<String, Object> keyMap, final List<String> attrList) {
        final Object user = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        final int userId = (int) ((UserInformation) user).getOtherData().get(UserDao.USR_ID);
        keyMap.put(BookingDao.BK_USR_ID, userId);
        return this.daoHelper.query(this.bookingDao, keyMap, attrList);
    }

    @Override
    public EntityResult getDatesDisponibilityQuery(final Map<String, Object> keyMap, final List<String> attrList) {
        final Object datesObj = keyMap.get("bk_date");
        ArrayList<Date> dates = BookingService.objectToDates(datesObj);
        dates = BookingService.getIntermediateDates(dates);

        final Map<Date, Boolean> fechas = new LinkedHashMap<>();

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
    public EntityResult datesByBookingQuery(final Map<String, Object> keyMap, final List<String> attrList) {
        final Object user = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        final int userId = (int) ((UserInformation) user).getOtherData().get(UserDao.USR_ID);
        keyMap.put(BookingDao.BK_USR_ID, userId);
        return this.daoHelper.query(this.bookingDao, keyMap, attrList, BookingDao.DATES_BY_BOOKING_QUERY);
    }

    @Override
    @Secured({PermissionsProviderSecured.SECURED})
    public EntityResult bookingInsert(final Map<String, Object> attrMap) {
        final Object user = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        final int userId = (int) ((UserInformation) user).getOtherData().get(UserDao.USR_ID);
        attrMap.put(BookingDao.BK_USR_ID, userId);
        return this.daoHelper.insert(this.bookingDao, attrMap);
    }

    @Override
    public EntityResult rangeBookingInsert(final Map<String, Object> attrMap) {
        final Object datesObj = attrMap.get("bk_date");
        final List<Date> dates = BookingService.objectToDates(datesObj);

        final Map<String, Object> paramsBD = new HashMap<>();
        final EntityResult result = this.bookingInsert(attrMap);
        final int bk_id = (int) result.get(BookingDao.BK_ID);
        paramsBD.put("bk_id", bk_id);

        for (final Date date : dates) {
            paramsBD.put("date", date);
            this.bds.bookingDateInsert(paramsBD);
        }
        return result;
    }

    @Override
    public EntityResult bookingUpdate(final Map<String, Object> attrMap, final Map<String, Object> keyMap) {
        return this.daoHelper.update(this.bookingDao, attrMap, keyMap);
    }

    @Override
    public EntityResult bookingDelete(final Map<String, Object> keyMap) {
        return this.daoHelper.delete(this.bookingDao, keyMap);
    }

    public static ArrayList<Date> objectToDates(final Object datesObj) {
        final ArrayList<Date> dates = new ArrayList<>();
        if (datesObj instanceof List) {
            final List<String> datesList = (List<String>) datesObj;
            final SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
            sdf.setTimeZone(TimeZone.getTimeZone("UTC"));
            for (final String date : datesList) {
                final Date date2;
                try {
                    date2 = sdf.parse(date);
                    dates.add(date2);
                } catch (final ParseException e) {
                    System.out.println("Error al parsear la fecha");
                    throw new RuntimeException(e);
                }
            }
        }
        return dates;
    }

    @Override
    public EntityResult occupationLinearChartQuery(final Map<String, Object> keyMap, final List<String> attrList) {
        final Object user = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        final int userId = (int) ((UserInformation) user).getOtherData().get(UserDao.USR_ID);
        final Object datesObj = keyMap.get("bk_date");
        final List<Integer> idList = (List<Integer>) datesObj;
        keyMap.put("bk_usr_id", userId);
        final Map<String, Object> keyMapCW = new HashMap<>();
        keyMapCW.put("cw_usr_id", userId);
        //Defino el calendario
        final Calendar calendar = Calendar.getInstance();
        calendar.set(Calendar.HOUR_OF_DAY, 0);
        calendar.set(Calendar.MINUTE, 0);
        calendar.set(Calendar.SECOND, 0);
        calendar.set(Calendar.MILLISECOND, 0);
        int contador = 0;
        //Mapa1
        final Map<String, Map<Date, Double>> coworkingMap = new LinkedHashMap<>();
        //Bucle de coworkings de la empresa
        for (final int id : idList) {
            keyMapCW.put("cw_id", id);
            keyMap.put("bk_cw_id", id);
            //Sacar la capacidad de los coworkings
            final EntityResult capacidad = this.cs.coworkingCapacityQuery(keyMapCW, attrList);
            final int capacidadDisponible = ((ArrayList<Integer>) capacidad.get("cw_capacity")).get(0);

            //Mpa de fechas y capacidad
            final Map<Date, Double> datesMap = new LinkedHashMap<>();
            //Recorrer hasta 7 días atrás
            for (int i = 0; i < 7; i++) {
                //cambio la fecha y la pongo en el keyMap
                calendar.add(Calendar.DAY_OF_MONTH, -1);
                final Date date = calendar.getTime();
                keyMap.put("date", date);
                //Saco la ocupacion y la añado al mapa como porcentaje
                final EntityResult ocupacion = this.occupationByDateQuery(keyMap, attrList);
                final long ocupacionI = ((ArrayList<Long>) ocupacion.get("dates")).get(0);
                final double ocupacionP = (int) ocupacionI / capacidadDisponible * 100;
                datesMap.put(date, ocupacionP);
            }
            coworkingMap.put(namesCoworkings.get(contador), datesMap);
            contador++;
        }
        //Envuelvo coworkingMap pa mandarlo al frontend
        final EntityResult r = new EntityResultMapImpl();
        r.setCode(0);
        r.put("data", coworkingMap);
        return r;
    }

    private static ArrayList<Date> getIntermediateDates(final ArrayList<Date> dates) {
        final Date startDate = dates.get(0);
        final Date finalDate = dates.get(1);
        dates.clear();
        final LocalDate currentDate = LocalDate.now();
        final Calendar calendar = Calendar.getInstance();
        calendar.setTime(startDate);
        for (Date d = startDate; d.getTime() != finalDate.getTime(); ) {
            d = calendar.getTime();
            dates.add(d);
            calendar.add(Calendar.DAY_OF_YEAR, 1);
        }
        if (dates.isEmpty()) {
            dates.add(calendar.getTime());
        }
        return dates;
    }

    @Override
    public EntityResult occupationByDateQuery(final Map<String, Object> keyMap, final List<String> attrList) {
        return this.daoHelper.query(this.bookingDao, keyMap, attrList, BookingDao.OCCUPATION_BY_DATES);
    }


}