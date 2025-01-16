package com.campusdual.cd2024bfs5g1.model.core.service;

import com.campusdual.cd2024bfs5g1.api.core.service.ICoworkingService;
import com.campusdual.cd2024bfs5g1.model.core.dao.BookingDao;
import com.campusdual.cd2024bfs5g1.model.core.dao.CoworkingDao;
import com.campusdual.cd2024bfs5g1.model.core.dao.CwServiceDao;
import com.campusdual.cd2024bfs5g1.model.core.dao.UserDao;
import com.ontimize.jee.common.db.AdvancedEntityResult;
import com.ontimize.jee.common.db.SQLStatementBuilder;
import com.ontimize.jee.common.dto.EntityResult;
import com.ontimize.jee.common.dto.EntityResultMapImpl;
import com.ontimize.jee.common.exceptions.OntimizeJEERuntimeException;
import com.ontimize.jee.common.services.user.UserInformation;
import com.ontimize.jee.server.dao.DefaultOntimizeDaoHelper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.*;

/**
 * Servicio para gestionar las operaciones relacionadas con los coworkings.
 * Implementa la interfaz {@link ICoworkingService}.
 */
@Lazy
@Service(value = "CoworkingService")
public class CoworkingService implements ICoworkingService {

    @Autowired
    private DefaultOntimizeDaoHelper daoHelper;

    @Autowired
    private CoworkingDao coworkingDao;

    @Autowired
    private CwServiceService cwServiceService;

    @Autowired
    private BookingService bookingService;

    @Autowired
    private BookingDao bookingDao;

    /**
     * Consulta los registros de coworking según los criterios proporcionados.
     *
     * @param keyMap   Mapa de claves para filtrar los registros.
     * @param attrList Lista de atributos a recuperar en la consulta.
     * @return {@link EntityResult} con los resultados de la consulta.
     */
    @Override
    public EntityResult coworkingQuery(final Map<String, Object> keyMap, final List<String> attrList) {
        return this.daoHelper.query(this.coworkingDao, keyMap, attrList);
    }

    /**
     * Inserta un nuevo registro de coworking en la base de datos.
     * Añade automáticamente el ID del usuario autenticado al registro.
     *
     * @param keyMap Mapa de atributos del coworking a insertar.
     * @return {@link EntityResult} con el resultado de la operación de inserción.
     */
    @Override
    public EntityResult myCoworkingQuery(final Map<String, Object> keyMap, final List<String> attrList) {
        final Object user = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        final int userId = (int) ((UserInformation) user).getOtherData().get(UserDao.USR_ID);
        keyMap.put(CoworkingDao.CW_USER_ID, userId);
        return this.daoHelper.query(this.coworkingDao, keyMap, attrList, this.coworkingDao.CW_QUERY_SERVICES);
    }

    @Override
    public EntityResult serviceCoworkingQuery(final Map<String, Object> keyMap, final List<String> attrList) {
        return this.daoHelper.query(this.coworkingDao, keyMap, attrList, this.coworkingDao.CW_QUERY_SERVICES);
    }

    @Override
    public EntityResult coworkingInsert(final Map<String, Object> attrMap) {
        // Obtener el usuario autenticado
        final Object user = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        final int userId = (int) ((UserInformation) user).getOtherData().get(UserDao.USR_ID);

        // Añadir el ID del usuario al mapa de atributos para el insert
        attrMap.put(CoworkingDao.CW_USER_ID, userId);

        // Recuperación de los servicios
        final ArrayList<Map<String, Integer>> services = (ArrayList<Map<String, Integer>>) attrMap.remove("services");

        // Ejecutar el insert usando el daoHelper
        final EntityResult cwResult = this.daoHelper.insert(this.coworkingDao, attrMap);

        final int cwId = (int) cwResult.get(CoworkingDao.CW_ID);

        // Bucle for para alta en la tabla pivote
        this.iterationPivotCwService(services, cwId);
        return cwResult;
    }

    /**
     * Actualiza los registros de coworking que coinciden con las claves proporcionadas.
     *
     * @param attrMap Mapa de atributos a actualizar.
     * @param keyMap  Mapa de claves para identificar los registros a actualizar.
     * @return {@link EntityResult} con el resultado de la operación de actualización.
     */
    @Override
    public EntityResult coworkingUpdate(final Map<String, Object> attrMap, final Map<String, Object> keyMap) {
        // Recuperación de los servicios
        final ArrayList<Map<String, Integer>> services = (ArrayList<Map<String, Integer>>) attrMap.remove("services");
        // Ejecutar el update usando el daoHelper
        final EntityResult cwResult = this.daoHelper.update(this.coworkingDao, attrMap, keyMap);
        // Borrado de los servicios
        this.cwServiceService.cwServiceDelete(keyMap);
        // Bucle for para alta en la tabla pivote
        final int cwId = (int) keyMap.get("cw_id");
        if (services != null) {
            this.iterationPivotCwService(services, cwId);
        }
        return cwResult;
    }

    /**
     * Elimina los registros de coworking que coinciden con las claves proporcionadas.
     *
     * @param keyMap Mapa de claves para identificar los registros a eliminar.
     * @return {@link EntityResult} con el resultado de la operación de eliminación.
     */
    @Override
    public EntityResult coworkingDelete(final Map<String, Object> keyMap) {
        final Map<String, Object> date = new HashMap<>();
        date.put("cw_end_date", new Date());

        final Map<String, Object> cw_id = new HashMap<>();
        cw_id.put("cw_id", keyMap.get("cw_id"));

        final List<String> columnas = new ArrayList<>();
        columnas.add("cw_name");
        final EntityResult result = this.bookingService.coworkingsWithBookingsQuery(cw_id, columnas);

        if (result.isEmpty()) {
            return this.coworkingUpdate(date, keyMap);
        } else {
            final EntityResult noResult = new EntityResultMapImpl();
            noResult.setCode(EntityResult.OPERATION_SUCCESSFUL);
            noResult.setMessage("NO_DELETE");
            return noResult;
        }
    }

    /**
     * Calcula la capacidad que tiene el coworking
     *
     * @param keyMap   Mapa de claves para identificar el coworking a examinar.
     * @param attrList
     * @return
     */
    @Override
    public EntityResult coworkingCapacityQuery(final Map<String, Object> keyMap, final List<String> attrList) {
        return this.daoHelper.query(this.coworkingDao, keyMap, attrList, CoworkingDao.CW_QUERY_CAPACITY);
    }

    /**
     * Recorre una BasicExpression y todos sus operandos de forma recursiva mientras comprueba si uno de los operandos
     * coincide con la cadena "date".
     *
     * @param basicExpression
     * @return true si encuentra una cadena "date", false en caso contrario.
     */
    public static boolean dateCheckInFilters(SQLStatementBuilder.BasicExpression basicExpression) {
        boolean hasDate = false;
        // Bucle que itera mientras hasDate sea false, es decir, mientras no se encuentren fechas.
        while (!hasDate) {
            // Entra dentro del if cuando left operand o right operand son "date"
            if (basicExpression.getLeftOperand().toString().equals("date") ||
                    (basicExpression.getRightOperand() != null && basicExpression.getRightOperand()
                            .toString()
                            .equals("date"))) {
                hasDate = true;
            } else {
                // Entra dentro del if si right operand existe y si right operand es de clase BasicExpression (es
                // decir, tiene más elementos a evaluar)
                if (basicExpression.getRightOperand() != null && basicExpression.getRightOperand()
                        .getClass() == SQLStatementBuilder.BasicExpression.class) {
                    // Llama a dateCheckInFilters pasándole el right operand como parámetro y recoge la booleana
                    // devuelta en hasDate
                    hasDate =
                            dateCheckInFilters((SQLStatementBuilder.BasicExpression) basicExpression.getRightOperand());
                }
                // Entra solo si hasDate sigue siendo false
                if (!hasDate) {
                    // Entra si left operand es de clase BasicExpression (es decir, tiene más elementos a evaluar)
                    if (basicExpression.getLeftOperand().getClass() == SQLStatementBuilder.BasicExpression.class) {
                        // Cambia la basicExpression con la que se trabaja a el left operand y da otra vuelta al bucle
                        basicExpression = ((SQLStatementBuilder.BasicExpression) basicExpression.getLeftOperand());
                    } else {
                        // Si left operand no tiene más elementos, entonces devuelve false y para la función/recursión
                        return false;
                    }
                }
            }
        }
        return hasDate;
    }

    @Override
    public AdvancedEntityResult serviceCoworkingPaginationQuery(final Map<String, Object> keysValues,
            final List<?> attributes, final int recordNumber, final int startIndex, final List<?> orderBy) throws OntimizeJEERuntimeException {
        final SQLStatementBuilder.BasicExpression basicExpression =
                (SQLStatementBuilder.BasicExpression) keysValues.get(SQLStatementBuilder.ExtendedSQLConditionValuesProcessor.EXPRESSION_KEY);
        final boolean hasDate = basicExpression == null ? false : dateCheckInFilters(basicExpression);
        attributes.remove("date");
        if (!hasDate) {
            return this.daoHelper.paginationQuery(this.coworkingDao, keysValues, attributes, recordNumber, startIndex,
                    orderBy, this.coworkingDao.CW_QUERY_SERVICES);
        }

        final List<String> datesAttributes = List.of("cw_id", "date", "cw_capacity", "cw_location", "services",
                "plazasOcupadas");

        final EntityResult filteredResults = this.daoHelper.query(this.coworkingDao, keysValues, datesAttributes,
                this.coworkingDao.CW_QUERY_DATES);
        if (filteredResults.calculateRecordNumber() == 0) {
            return this.daoHelper.paginationQuery(this.coworkingDao, keysValues, datesAttributes, recordNumber,
                    startIndex,
                    orderBy, this.coworkingDao.CW_QUERY_DATES);
        }

        final List<Integer> coworkingsSinDisponibilidad = new ArrayList<>();
        final List<Integer> coworkings = new ArrayList<>();

        for (int i = 0; i < filteredResults.calculateRecordNumber(); i++) {
            final int aux = (int) filteredResults.getRecordValues(i).get("cw_id");

            final long plazasOcupadas = filteredResults.getRecordValues(i).get("plazasOcupadas") != null ?
                    (long) filteredResults.getRecordValues(i).get("plazasOcupadas") : 0;
            final int capacity = (int) filteredResults.getRecordValues(i).get("cw_capacity");
            coworkings.add(aux);

            if (plazasOcupadas >= capacity && filteredResults.getRecordValues(i).get("date") != null) {
                coworkingsSinDisponibilidad.add(aux);
            }
        }

        coworkings.removeAll(coworkingsSinDisponibilidad);

        final Map<String, Object> filter = new HashMap<>();

        if (coworkings.size() > 0) {
            final SQLStatementBuilder.BasicExpression filtroIds =
                    new SQLStatementBuilder.BasicExpression(new SQLStatementBuilder.BasicField(CoworkingDao.CW_ID),
                            SQLStatementBuilder.BasicOperator.IN_OP, coworkings);

            filter.put(SQLStatementBuilder.ExtendedSQLConditionValuesProcessor.EXPRESSION_KEY, filtroIds);
        }

        return this.daoHelper.paginationQuery(this.coworkingDao, filter, attributes, recordNumber, startIndex,
                orderBy, this.coworkingDao.CW_QUERY_SERVICES);
    }

    public void iterationPivotCwService(final ArrayList<Map<String, Integer>> services, final int cwId) {
        for (int i = 0; i < services.size(); i++) {
            final Map<String, Object> map = new HashMap<>();
            map.put(CwServiceDao.CW_ID, cwId);
            map.put(CwServiceDao.SRV_ID, services.get(i).get("id"));
            this.cwServiceService.cwServiceInsert(map);
        }
    }

    @Override
    public EntityResult coworkingByUserQuery(final Map<String, Object> keyMap, final List<String> attrList) {
        final Object user = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        final int userId = (int) ((UserInformation) user).getOtherData().get(UserDao.USR_ID);
        keyMap.put(CoworkingDao.CW_USER_ID, userId);
        return this.daoHelper.query(this.coworkingDao, keyMap, attrList);
    }

    @Override
    public EntityResult coworkingNameByIdQuery(final Map<String, Object> keyMap, final List<String> attrList) {
        final Object user = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        final int userId = (int) ((UserInformation) user).getOtherData().get(UserDao.USR_ID);
        keyMap.put(CoworkingDao.CW_USER_ID, userId);
        return this.daoHelper.query(this.coworkingDao, keyMap, attrList, this.coworkingDao.COWORKINGS_NAME_BY_NAME);
    }

    @Override
    public EntityResult coworkingNearbyQuery(final Map<String, Object> keyMap, final List<String> attrList) {
        return this.daoHelper.query(this.coworkingDao, keyMap, attrList, this.coworkingDao.COWORKINGS_NEARBY);
    }

    /**
     * Obtiene la info para generar el gráfico de facturación
     *
     * @param keyMap
     * @param attrList
     * @return response
     */
    @Override
    public EntityResult coworkingFacturationChartQuery(final Map<String, Object> keyMap, final List<String> attrList) {
        final ArrayList<Integer> arrayCw_id = new ArrayList<>((ArrayList<Integer>) keyMap.remove("cw_id"));
        ArrayList<Integer> months = null;
        //final Object daysObj = null;
        //final ArrayList<Date> days = null;
        final List<Map> listaCoworkings = new ArrayList<>();
        int year = 0;
        year = (int) keyMap.remove("year");
        months = new ArrayList<>((ArrayList<Integer>) keyMap.remove("month"));
        for (int i = 0; i < arrayCw_id.size(); i++) {
            final int cw = arrayCw_id.get(i);
            keyMap.put(CoworkingDao.CW_ID, cw);
            keyMap.put(BookingDao.BK_STATE, true);
            keyMap.put("date_part('year',booking_date.date)", year);
            final Map<String, Object> dataMonths = this.monthsGraphic(keyMap, attrList, months);
            if (dataMonths != null) {
                listaCoworkings.add(this.monthsGraphic(keyMap, attrList, months));
            }
        }
        final EntityResult response = new EntityResultMapImpl();
        response.setCode(0);
        response.put("data", (List.of(listaCoworkings)));
        return response;
    }

    /**
     * Devuelve un Map de String Object con la info de los meses
     *
     * @param keys,
     * @param attrList,
     * @param months
     * @return coworkingMap
     */
    public Map<String, Object> monthsGraphic(final Map<String, Object> keys, final List<String> attrList,
            final ArrayList<Integer> months) {
        final Map<String, Object> coworkingMap = new LinkedHashMap<>();
        List<String> coworkingName = new ArrayList<>();
        final List<Map> monthsList = new ArrayList<>();
        Map<String, Object> m = null;
        EntityResult er = null;
        for (int j = 0; j < months.size(); j++) {
            List<Integer> month = new ArrayList<>();
            List<Integer> in = new ArrayList<>();
            List<Double> account = new ArrayList<>();
            m = new HashMap<>(); //mapa del mes y del importe
            keys.put("date_part('month',booking_date.date)", months.get(j));
            er = this.daoHelper.query(this.coworkingDao, keys, attrList,
                    this.coworkingDao.CW_QUERY_FACTURATION_BY_MONTH);
            month = (List<Integer>) er.get("m");
            in = (List<Integer>) er.get("m");
            account = (List<Double>) er.get("account");
            if (month != null) {
                m.put("i", in.get(0));
                m.put("name", month.get(0));
                m.put("value", account.get(0));
                monthsList.add(m);
                coworkingName = (List<String>) er.get("coworking_name");
                coworkingMap.put("name", coworkingName.get(0));
                coworkingMap.put("series", monthsList);
            }
        }
        if (!coworkingMap.isEmpty()) {
            return coworkingMap;
        } else {
            return null;
        }
    }
}