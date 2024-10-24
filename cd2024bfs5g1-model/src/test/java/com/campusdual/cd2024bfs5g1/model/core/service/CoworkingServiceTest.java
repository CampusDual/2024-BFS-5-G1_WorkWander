package com.campusdual.cd2024bfs5g1.model.core.service;


import com.campusdual.cd2024bfs5g1.model.core.dao.CoworkingDao;
import com.campusdual.cd2024bfs5g1.model.core.dao.UserDao;
import com.ontimize.jee.common.dto.EntityResult;
import com.ontimize.jee.common.dto.EntityResultMapImpl;
import com.ontimize.jee.common.services.user.UserInformation;
import com.ontimize.jee.server.dao.DefaultOntimizeDaoHelper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class CoworkingServiceTest {

    @Mock
    private DefaultOntimizeDaoHelper daoHelper;

    @Mock
    private CoworkingDao coworkingDao;

    @InjectMocks
    private CoworkingService coworkingService;

    @Mock
    private SecurityContext securityContext;

    @Mock
    private Authentication authentication;

    @Mock
    private UserInformation userInformation;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    private void setupSecurityContext() {
        // Configurar el contexto de seguridad
        SecurityContextHolder.setContext(securityContext);
        when(securityContext.getAuthentication()).thenReturn(authentication);
        when(authentication.getPrincipal()).thenReturn(userInformation);

        // Configurar el usuario autenticado
        Map<Object, Object> otherData = new HashMap<>();
        otherData.put(UserDao.USR_ID, 1);
        when(userInformation.getOtherData()).thenReturn(otherData);
    }

    @Test
    public void testCoworkingQuery() {
        // Datos de prueba
        Map<String, Object> keyMap = new HashMap<>();
        List<String> attrList = Arrays.asList("attribute1", "attribute2");
        EntityResult expectedResult = new EntityResultMapImpl();

        // Configurar el mock
        when(daoHelper.query(coworkingDao, keyMap, attrList)).thenReturn(expectedResult);

        // Llamar al método
        EntityResult result = coworkingService.coworkingQuery(keyMap, attrList);

        // Verificar resultados
        assertEquals(expectedResult, result);
        verify(daoHelper).query(coworkingDao, keyMap, attrList);
    }

    @Test
    public void testMyCoworkingQuery() {
        setupSecurityContext(); // Mover la configuración aquí

        // Datos de prueba
        Map<String, Object> keyMap = new HashMap<>();
        List<String> attrList = Arrays.asList("attribute1", "attribute2");
        EntityResult expectedResult = new EntityResultMapImpl();

        // Configurar el mock
        when(daoHelper.query(eq(coworkingDao), anyMap(), eq(attrList))).thenReturn(expectedResult);

        // Llamar al método
        EntityResult result = coworkingService.myCoworkingQuery(keyMap, attrList);

        // Verificar que se añadió el ID del usuario al keyMap
        assertTrue(keyMap.containsKey(CoworkingDao.CW_USER_ID));
        assertEquals(1, keyMap.get(CoworkingDao.CW_USER_ID));

        // Verificar resultados
        assertEquals(expectedResult, result);
        verify(daoHelper).query(eq(coworkingDao), eq(keyMap), eq(attrList));
    }

    @Test
    public void testCoworkingInsert() {
        setupSecurityContext(); // Mover la configuración aquí

        // Datos de prueba
        Map<String, Object> attrMap = new HashMap<>();
        EntityResult expectedResult = new EntityResultMapImpl();

        // Configurar el mock
        when(daoHelper.insert(coworkingDao, attrMap)).thenReturn(expectedResult);

        // Llamar al método
        EntityResult result = coworkingService.coworkingInsert(attrMap);

        // Verificar que se añadió el ID del usuario al attrMap
        assertTrue(attrMap.containsKey(CoworkingDao.CW_USER_ID));
        assertEquals(1, attrMap.get(CoworkingDao.CW_USER_ID));

        // Verificar resultados
        assertEquals(expectedResult, result);
        verify(daoHelper).insert(coworkingDao, attrMap);
    }

    @Test
    public void testCoworkingUpdate() {
        // Datos de prueba
        Map<String, Object> attrMap = new HashMap<>();
        Map<String, Object> keyMap = new HashMap<>();
        EntityResult expectedResult = new EntityResultMapImpl();

        // Configurar el mock
        when(daoHelper.update(coworkingDao, attrMap, keyMap)).thenReturn(expectedResult);

        // Llamar al método
        EntityResult result = coworkingService.coworkingUpdate(attrMap, keyMap);

        // Verificar resultados
        assertEquals(expectedResult, result);
        verify(daoHelper).update(coworkingDao, attrMap, keyMap);
    }

    @Test
    public void testCoworkingDelete() {
        // Datos de prueba
        Map<String, Object> keyMap = new HashMap<>();
        EntityResult expectedResult = new EntityResultMapImpl();

        // Configurar el mock
        when(daoHelper.delete(coworkingDao, keyMap)).thenReturn(expectedResult);

        // Llamar al método
        EntityResult result = coworkingService.coworkingDelete(keyMap);

        // Verificar resultados
        assertEquals(expectedResult, result);
        verify(daoHelper).delete(coworkingDao, keyMap);
    }
}
