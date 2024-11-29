package com.campusdual.cd2024bfs5g1.model.core.service;

import com.campusdual.cd2024bfs5g1.api.core.service.ICoworkingService;
import com.campusdual.cd2024bfs5g1.model.core.dao.CoworkingDao;
import com.campusdual.cd2024bfs5g1.model.core.dao.CwServiceDao;
import com.campusdual.cd2024bfs5g1.model.core.dao.UserDao;
import com.ontimize.jee.common.db.SQLStatementBuilder;
import com.ontimize.jee.common.dto.EntityResult;
import com.ontimize.jee.common.exceptions.OntimizeJEERuntimeException;
import com.ontimize.jee.common.services.user.UserInformation;
import com.ontimize.jee.server.dao.DefaultOntimizeDaoHelper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

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
        this.iterationPivotCwService(services, cwId);
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
        return this.daoHelper.delete(this.coworkingDao, keyMap);
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

    @Override
    public EntityResult serviceCoworkingAdvancedQuery(final Map<String, Object> keysValues,
            final List<?> attributes) throws OntimizeJEERuntimeException {

        final Map<String, Object> combinedFilter = new HashMap<>();
        //        if (keysValues.size() > 0 && (((SQLStatementBuilder.BasicExpression) ((SQLStatementBuilder
        //        .BasicExpression) keysValues.get(SQLStatementBuilder.ExtendedSQLConditionValuesProcessor
        //        .EXPRESSION_KEY)).getLeftOperand())
        //                .getClass() != SQLStatementBuilder.BasicExpression.class ||
        //                (((SQLStatementBuilder.BasicExpression) keysValues.get(SQLStatementBuilder
        //                .ExtendedSQLConditionValuesProcessor.EXPRESSION_KEY)).getLeftOperand()
        //                        .getClass() == SQLStatementBuilder.BasicExpression.class &&
        //                        ((SQLStatementBuilder.BasicExpression) ((SQLStatementBuilder.BasicExpression)
        //                        keysValues.get(SQLStatementBuilder.ExtendedSQLConditionValuesProcessor
        //                        .EXPRESSION_KEY)).getLeftOperand()).getLeftOperand() != "date"))) {
        //
        //            if (keysValues.size() == 1) {
        //                combinedFilter.put(SQLStatementBuilder.ExtendedSQLConditionValuesProcessor.EXPRESSION_KEY,
        //                        keysValues.get(SQLStatementBuilder.ExtendedSQLConditionValuesProcessor
        //                        .EXPRESSION_KEY));
        //            } else {
        //                combinedFilter.put(SQLStatementBuilder.ExtendedSQLConditionValuesProcessor.EXPRESSION_KEY,
        //                        ((SQLStatementBuilder.BasicExpression) keysValues.get(SQLStatementBuilder
        //                        .ExtendedSQLConditionValuesProcessor.EXPRESSION_KEY)).getLeftOperand());
        //            }
        //        }

        final List<String> datesAttributes = List.of("cw_id", "date", "cw_capacity", "cw_location", "services",
                "plazasOcupadas");

        final EntityResult filteredResults = this.daoHelper.query(this.coworkingDao, keysValues, datesAttributes,
                this.coworkingDao.CW_QUERY_DATES);
        attributes.remove("date");
        final List<Integer> coworkingsSinDisponibilidad = new ArrayList<>();
        final List<Integer> coworkings = new ArrayList<>();

        for (int i = 0; i < filteredResults.calculateRecordNumber(); i++) {
            final int aux = (int) filteredResults.getRecordValues(i).get("cw_id");

            final long plazasOcupadas = (long) filteredResults.getRecordValues(i).get("plazasOcupadas");
            final int capacity = (int) filteredResults.getRecordValues(i).get("cw_capacity");
            coworkings.add(aux);

            if (plazasOcupadas >= capacity && filteredResults.getRecordValues(i).get("date") != null) {
                coworkingsSinDisponibilidad.add(aux);
            }

            //            final SQLStatementBuilder.BasicExpression cwIdBasicExpression = new SQLStatementBuilder
            //            .BasicExpression(
            //                    "cw_id", SQLStatementBuilder.BasicOperator.EQUAL_OP, aux);
            //
            //            final SQLStatementBuilder.BasicExpression dateBasicExpression =
            //                    new SQLStatementBuilder.BasicExpression(daterangeFilter,
            //                            SQLStatementBuilder.BasicOperator.AND_OP, cwIdBasicExpression);
            //
            //            final Map<String, Object> dateCwFilter = new HashMap<>();
            //            dateCwFilter.put(SQLStatementBuilder.ExtendedSQLConditionValuesProcessor.EXPRESSION_KEY,
            //                    dateBasicExpression);
            //
            //            final EntityResult auxiliarQuery = this.daoHelper.query(this.coworkingDao, dateCwFilter,
            //            attributes,
            //                    this.coworkingDao.CW_QUERY_DATES);
            //
            //            if (auxiliarQuery.calculateRecordNumber() > 0) {
            //                if (daterangeResults == null) {
            //                    daterangeResults = this.daoHelper.query(this.coworkingDao, dateCwFilter, attributes,
            //                            this.coworkingDao.CW_QUERY_DATES);
            //                } else {
            //                    daterangeResults.putAll(this.daoHelper.query(this.coworkingDao, dateCwFilter,
            //                    attributes,
            //                            this.coworkingDao.CW_QUERY_DATES).getRecordValues(0));
            //                }
            //            }
        }

        coworkings.removeAll(coworkingsSinDisponibilidad);

        final Map<String, Object> filter = new HashMap<>();

        if (coworkings.size() > 0) {
            final SQLStatementBuilder.BasicExpression filtroIds =
                    new SQLStatementBuilder.BasicExpression(new SQLStatementBuilder.BasicField(CoworkingDao.CW_ID),
                            SQLStatementBuilder.BasicOperator.IN_OP, coworkings);

            filter.put(SQLStatementBuilder.ExtendedSQLConditionValuesProcessor.EXPRESSION_KEY, filtroIds);
        }

        return this.daoHelper.query(this.coworkingDao, filter, attributes, this.coworkingDao.CW_QUERY_SERVICES);
    }

    public void iterationPivotCwService(final ArrayList<Map<String, Integer>> services, final int cwId) {
        for (int i = 0; i < services.size(); i++) {
            final Map<String, Object> map = new HashMap<>();
            map.put(CwServiceDao.CW_ID, cwId);
            map.put(CwServiceDao.SRV_ID, services.get(i).get("id"));
            this.cwServiceService.cwServiceInsert(map);
        }
    }

}
