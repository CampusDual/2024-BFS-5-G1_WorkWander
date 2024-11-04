package com.campusdual.cd2024bfs5g1.model.core.service;

import com.campusdual.cd2024bfs5g1.api.core.service.ICwServiceService;
import com.campusdual.cd2024bfs5g1.model.core.dao.CwServiceDao;
import com.ontimize.jee.common.dto.EntityResult;
import com.ontimize.jee.server.dao.DefaultOntimizeDaoHelper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

/**
 * Servicio para gestionar las operaciones relacionadas con los coworkings.
 * Implementa la interfaz {@link ICwServiceService}.
 */
@Lazy
@Service(value = "ServiceService")
public class CwServiceService implements ICwServiceService {

    @Autowired
    private DefaultOntimizeDaoHelper daoHelper;

    @Autowired
    private CwServiceDao cwServiceDao;

    /**
     * Consulta los registros de servicio según los criterios proporcionados.
     *
     * @param keyMap   Mapa de claves para filtrar los registros.
     * @param attrList Lista de atributos a recuperar en la consulta.
     * @return {@link EntityResult} con los resultados de la consulta.
     */
    @Override
    public EntityResult cwServiceQuery(Map<String, Object> keyMap, List<String> attrList) {
        return this.daoHelper.query(this.cwServiceDao, keyMap, attrList);
    }

    /**
     * Inserta un nuevo registro de servicio en la base de datos.    *
     *
     * @param attrMap Mapa de atributos del servicio a insertar.
     * @return {@link EntityResult} con el resultado de la operación de inserción.
     */
    @Override
    public EntityResult cwServiceInsert(Map<String, Object> attrMap) {
        // Ejecutar el insert usando el daoHelper
        return this.daoHelper.insert(this.cwServiceDao, attrMap);
    }

    /**
     * Actualiza los registros de servicios que coinciden con las claves proporcionadas.
     *
     * @param attrMap Mapa de atributos a actualizar.
     * @param keyMap  Mapa de claves para identificar los registros a actualizar.
     * @return {@link EntityResult} con el resultado de la operación de actualización.
     */
    @Override
    public EntityResult cwServiceUpdate(Map<String, Object> attrMap, Map<String, Object> keyMap) {
        return this.daoHelper.update(this.cwServiceDao, attrMap, keyMap);
    }

    /**
     * Elimina los registros de servicio que coinciden con las claves proporcionadas.
     *
     * @param keyMap Mapa de claves para identificar los registros a eliminar.
     * @return {@link EntityResult} con el resultado de la operación de eliminación.
     */
    @Override
    public EntityResult cwServiceDelete(Map<String, Object> keyMap) {
        return this.daoHelper.delete(this.cwServiceDao, keyMap);
    }

    @Override
    public EntityResult servicePerCoworkingQuery(Map<String, Object> keyMap, List<String> attrList) {
        return this.daoHelper.query(this.cwServiceDao, keyMap, attrList, CwServiceDao.SERVICES_PER_COWORKING);
    }

}

