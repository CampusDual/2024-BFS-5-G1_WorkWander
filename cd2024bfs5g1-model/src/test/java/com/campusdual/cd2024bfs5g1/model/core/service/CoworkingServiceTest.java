/*package com.campusdual.cd2024bfs5g1.model.core.service;

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

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.anyMap;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

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
        SecurityContextHolder.setContext(this.securityContext);
        when(this.securityContext.getAuthentication()).thenReturn(this.authentication);
        when(this.authentication.getPrincipal()).thenReturn(this.userInformation);

        // Configurar el usuario autenticado
        final Map<Object, Object> otherData = new HashMap<>();
        otherData.put(UserDao.USR_ID, 1);
        when(this.userInformation.getOtherData()).thenReturn(otherData);
    }

    @Test
    public void testCoworkingQuery() {
        // Datos de prueba
        final Map<String, Object> keyMap = new HashMap<>();
        final List<String> attrList = Arrays.asList("attribute1", "attribute2");
        final EntityResult expectedResult = new EntityResultMapImpl();

        // Configurar el mock
        when(this.daoHelper.query(this.coworkingDao, keyMap, attrList)).thenReturn(expectedResult);

        // Llamar al método
        final EntityResult result = this.coworkingService.coworkingQuery(keyMap, attrList);

        // Verificar resultados
        assertEquals(expectedResult, result, "El resultado devuelto por coworkingQuery debería coincidir con el " +
                "resultado esperado");
        verify(this.daoHelper).query(this.coworkingDao, keyMap, attrList);
    }

    @Test
    public void testMyCoworkingQuery() {
        this.setupSecurityContext(); // Mover la configuración aquí

        // Datos de prueba
        final Map<String, Object> keyMap = new HashMap<>();
        final List<String> attrList = Arrays.asList("attribute1", "attribute2");
        final EntityResult expectedResult = new EntityResultMapImpl();

        // Configurar el mock
        when(this.daoHelper.query(eq(this.coworkingDao), anyMap(), eq(attrList),
                eq(this.coworkingDao.CW_QUERY_SERVICES))).thenReturn(expectedResult);

        // Llamar al método
        final EntityResult result = this.coworkingService.myCoworkingQuery(keyMap, attrList);

        // Verificar que se añadió el ID del usuario al keyMap
        assertTrue(keyMap.containsKey(CoworkingDao.CW_USER_ID), "El ID del usuario debería haberse añadido a keyMap");
        assertEquals(1, keyMap.get(CoworkingDao.CW_USER_ID), "El valor del ID de usuario en attrMap debería ser 1");

        // Verificar resultados
        assertEquals(expectedResult, result, "El resultado devuelto por el método debería coincidir con el resultado " +
                "esperado");
        verify(this.daoHelper).query(eq(this.coworkingDao), eq(keyMap), eq(attrList),
                eq(this.coworkingDao.CW_QUERY_SERVICES));
    }

    //TODO corregir test
    @Test
    public void testCoworkingInsert() {
        this.setupSecurityContext();
        //     // Datos de prueba
        final Map<String, Object> attrMap = new HashMap<>();
        final EntityResult expectedResult = new EntityResultMapImpl();

        //     // Configurar el mock
        when(this.daoHelper.insert(this.coworkingDao, attrMap)).thenReturn(expectedResult);

        try {
            //     // Llamar al método
            final EntityResult cwResult = this.coworkingService.coworkingInsert(attrMap);
            //     // Verificar que se añadió el ID del usuario al attrMap
            assertTrue(attrMap.containsKey(CoworkingDao.CW_USER_ID), "El ID del usuario debería estar presente" +
                    "en attrMap\\ tras la inserción");
            assertEquals(1, attrMap.get(CoworkingDao.CW_USER_ID), "El valor del ID de usuario en attrMap\\" +
                    " debería ser 1");

            //     // Verificar resultados
            assertEquals(expectedResult, cwResult, "El resultado devuelto por el \\" +
                    "método debería coincidir con el resultado esperado");
            verify(this.daoHelper).insert(this.coworkingDao, attrMap);
        } catch (Exception e) {
            System.out.println("Error " + e.getMessage());
        }
    }

    //TODO: REVISAR ESTE TEST, COMPARAR CON LA MISMA DE CoworkingUpdate
    @Test
    public void testCoworkingUpdate() {
        // Datos de prueba
        Map<String, Object> attrMap = new HashMap<>();
        Map<String, Object> keyMap = new HashMap<>();
        EntityResult expectedResult = new EntityResultMapImpl();

        // Configurar el mock
        when(daoHelper.update(coworkingDao, attrMap, keyMap)).thenReturn(expectedResult);

        try {
            // Llamar al método
            EntityResult result = coworkingService.coworkingUpdate(attrMap, keyMap);

            // Verificar resultados
            assertEquals(expectedResult, result);
            verify(daoHelper).update(coworkingDao, attrMap, keyMap);
        } catch (Exception e) {
            System.out.println("Error " + e.getMessage());
        }
    }

//    @Test
//    public void testCoworkingDelete() {
//        // Datos de prueba
//        final Map<String, Object> keyMap = new HashMap<>();
//        final EntityResult expectedResult = new EntityResultMapImpl();
//
//        // Configurar el mock
//        when(this.daoHelper.delete(this.coworkingDao, keyMap)).thenReturn(expectedResult);
//
//        // Llamar al método
//        final EntityResult result = this.coworkingService.coworkingDelete(keyMap);
//
//        // Verificar resultados
//        assertEquals(expectedResult, result);
//        verify(this.daoHelper).delete(this.coworkingDao, keyMap);
//    }
}*/
