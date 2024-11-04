package com.campusdual.cd2024bfs5g1.model.core.service;

import com.campusdual.cd2024bfs5g1.api.core.service.IServService;
import com.campusdual.cd2024bfs5g1.model.core.dao.ServiceDao;
import com.ontimize.jee.common.dto.EntityResult;
import com.ontimize.jee.server.dao.DefaultOntimizeDaoHelper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

/**
 * Servicio para gestionar las operaciones relacionadas con los coworkings.
 * Implementa la interfaz {@link IServService}.
 */
@Lazy
@Service(value = "ServService")
public class ServService implements IServService {

    @Autowired
    private DefaultOntimizeDaoHelper daoHelper;

    @Autowired
    private ServiceDao serviceDao;

    /**
     * Consulta los registros de servicio según los criterios proporcionados.
     *
     * @param keyMap   Mapa de claves para filtrar los registros.
     * @param attrList Lista de atributos a recuperar en la consulta.
     * @return {@link EntityResult} con los resultados de la consulta.
     */
    @Override
    public EntityResult serviceQuery(Map<String, Object> keyMap, List<String> attrList) {
        return this.daoHelper.query(this.serviceDao, keyMap, attrList);
    }

    /**
     * Inserta un nuevo registro de servicio en la base de datos.    *
     *
     * @param attrMap Mapa de atributos del servicio a insertar.
     * @return {@link EntityResult} con el resultado de la operación de inserción.
     */
    @Override
    public EntityResult serviceInsert(Map<String, Object> attrMap) {
        // Ejecutar el insert usando el daoHelper
        return this.daoHelper.insert(this.serviceDao, attrMap);
    }

    /**
     * Actualiza los registros de servicios que coinciden con las claves proporcionadas.
     *
     * @param attrMap Mapa de atributos a actualizar.
     * @param keyMap  Mapa de claves para identificar los registros a actualizar.
     * @return {@link EntityResult} con el resultado de la operación de actualización.
     */
    @Override
    public EntityResult serviceUpdate(Map<String, Object> attrMap, Map<String, Object> keyMap) {
        return this.daoHelper.update(this.serviceDao, attrMap, keyMap);
    }

    /**
     * Elimina los registros de servicio que coinciden con las claves proporcionadas.
     *
     * @param keyMap Mapa de claves para identificar los registros a eliminar.
     * @return {@link EntityResult} con el resultado de la operación de eliminación.
     */
    @Override
    public EntityResult serviceDelete(Map<String, Object> keyMap) {
        return this.daoHelper.delete(this.serviceDao, keyMap);
    }

}

