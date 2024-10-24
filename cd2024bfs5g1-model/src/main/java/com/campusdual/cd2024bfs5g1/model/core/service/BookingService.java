package com.campusdual.cd2024bfs5g1.model.core.service;

import com.campusdual.cd2024bfs5g1.api.core.service.IBookingService;
import com.campusdual.cd2024bfs5g1.model.core.dao.BookingDao;
import com.campusdual.cd2024bfs5g1.model.core.dao.CoworkingDao;
import com.campusdual.cd2024bfs5g1.model.core.dao.UserDao;
import com.ontimize.jee.common.dto.EntityResult;
import com.ontimize.jee.common.services.user.UserInformation;
import com.ontimize.jee.server.dao.DefaultOntimizeDaoHelper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Lazy
@Service(value = "BookingService")
public class BookingService implements IBookingService {
    @Autowired
    private DefaultOntimizeDaoHelper daoHelper;
    @Autowired
    private BookingDao bookingDao;
    @Override
    public EntityResult bookingQuery(Map<String, Object> keyMap, List<String> attrList) {
        return this.daoHelper.query(this.bookingDao, keyMap, attrList);    }

    @Override
    public EntityResult totalBookingsByDateQuery(Map<String, Object> keyMap, List<String> attrList) {
        return this.daoHelper.query(this.bookingDao, keyMap, attrList, BookingDao.TOTAL_BOOKINGS_DATE_QUERY);
    }

    @Override
    public EntityResult myBookingQuery(Map<String, Object> keyMap, List<String> attrList) {
        Object user = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        int userId = (int)((UserInformation) user).getOtherData().get(UserDao.USR_ID);
        keyMap.put(BookingDao.BK_USR_ID, userId);
        return this.daoHelper.query(this.bookingDao, keyMap, attrList);
    }

    @Override
    public EntityResult bookingInsert(Map<String, Object> attrMap) {
        // Obtener el usuario autenticado
        Object user = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        int userId = (int) ((UserInformation) user).getOtherData().get(UserDao.USR_ID);
//        int cwId = (int) ((UserInformation) user).getOtherData().get(CoworkingDao.CW_ID);

        // Añadir el ID del usuario al mapa de atributos para el insert
        attrMap.put(BookingDao.BK_USR_ID, userId);
//        attrMap.put(BookingDao.BK_CW_ID, cwId);

        // Ejecutar el insert usando el daoHelper
        return this.daoHelper.insert(this.bookingDao, attrMap);
    }

    @Override
    public EntityResult bookingUpdate(Map<String, Object> attrMap, Map<String, Object> keyMap) {
        return this.daoHelper.update(this.bookingDao, attrMap, keyMap);
    }

    @Override
    public EntityResult bookingDelete(Map<String, Object> keyMap) {
        return this.daoHelper.delete(this.bookingDao, keyMap);
    }
}
