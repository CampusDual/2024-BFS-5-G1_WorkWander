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

import javax.imageio.IIOImage;
import javax.imageio.ImageIO;
import javax.imageio.ImageWriteParam;
import javax.imageio.ImageWriter;
import javax.imageio.stream.ImageOutputStream;

import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.List;
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

        String cwResizedImage = null;
        if (attrMap.get("cw_image") != null) {
            try {
                cwResizedImage = resizeImage((String) attrMap.get("cw_image"));
            } catch (final IOException e) {
                throw new RuntimeException(e);
            }
            attrMap.put("cw_image_resized", cwResizedImage);
        }
        attrMap.put("cw_image_resized", cwResizedImage); // Cambiar a cw_image_resized para consistencia

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

        String cwResizedImage = null;
        if (attrMap.get("cw_image") != null) {
            try {
                cwResizedImage = resizeImage((String) attrMap.get("cw_image"));
            } catch (final IOException e) {
                throw new RuntimeException(e);
            }
            attrMap.put("cw_image_resized", cwResizedImage);
        }
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

static String resizeImage(final String base64Image) throws IOException {
    if (base64Image == null || base64Image.isEmpty()) {
        return null;
    }

    try {
        byte[] imageBytes = Base64.getDecoder().decode(base64Image);
        BufferedImage originalImage;

        try (ByteArrayInputStream bis = new ByteArrayInputStream(imageBytes)) {
            originalImage = ImageIO.read(bis);
            if (originalImage == null) {
                throw new IOException("No se pudo leer la imagen");
            }
        }

        final int TARGET_WIDTH = 320;
        double ratio = (double) originalImage.getHeight() / originalImage.getWidth();
        int newHeight = (int) (TARGET_WIDTH * ratio);

        // Detectar si la imagen necesita transparencia
        boolean hasTransparency = originalImage.getColorModel().hasAlpha();

        // Elegir formato basado en contenido
        String formatoSalida = hasTransparency ? "png" : "jpeg";
        int imageType = hasTransparency ? BufferedImage.TYPE_INT_ARGB : BufferedImage.TYPE_INT_RGB;

        BufferedImage outputImage = new BufferedImage(TARGET_WIDTH, newHeight, imageType);
        Graphics2D g2d = outputImage.createGraphics();

        // Configuración optimizada
        g2d.setRenderingHint(RenderingHints.KEY_INTERPOLATION, RenderingHints.VALUE_INTERPOLATION_BILINEAR);
        g2d.setRenderingHint(RenderingHints.KEY_RENDERING, RenderingHints.VALUE_RENDER_QUALITY);
        if (!hasTransparency) {
            g2d.setBackground(Color.WHITE);
            g2d.clearRect(0, 0, TARGET_WIDTH, newHeight);
        }

        g2d.drawImage(originalImage, 0, 0, TARGET_WIDTH, newHeight, null);
        g2d.dispose();

        try (ByteArrayOutputStream baos = new ByteArrayOutputStream()) {
            if ("jpeg".equals(formatoSalida)) {
                // Configuración JPEG
                ImageWriter writer = ImageIO.getImageWritersByFormatName("jpeg").next();
                ImageWriteParam param = writer.getDefaultWriteParam();
                param.setCompressionMode(ImageWriteParam.MODE_EXPLICIT);
                param.setCompressionQuality(0.8f);

                ImageOutputStream ios = ImageIO.createImageOutputStream(baos);
                writer.setOutput(ios);
                writer.write(null, new IIOImage(outputImage, null, null), param);
                writer.dispose();
                ios.close();
            } else {
                // PNG para imágenes con transparencia
                ImageIO.write(outputImage, "png", baos);
            }
            return Base64.getEncoder().encodeToString(baos.toByteArray());
        }
    } catch (IOException e) {
        throw new IOException("Error al procesar la imagen: " + e.getMessage());
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
        final List<Map> listaCoworkings = new ArrayList<>();
        int year = 0;
        year = (int) keyMap.remove("year");
        months = new ArrayList<>((ArrayList<Integer>) keyMap.remove("month"));
        for (int i = 0; i < months.size(); i++) {
            final int mes = months.get(i);
            keyMap.put("date_part('month',booking_date.date)", mes);
            keyMap.put(BookingDao.BK_STATE, true);
            keyMap.put("date_part('year',booking_date.date)", year);
            final Map<String, Object> dataMonths = this.monthsGraphic(keyMap, attrList, arrayCw_id);
            if (dataMonths != null) {
                listaCoworkings.add(this.monthsGraphic(keyMap, attrList, arrayCw_id));
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
     * @param coworkings
     * @return coworkingMap
     */
    public Map<String, Object> monthsGraphic(final Map<String, Object> keys, final List<String> attrList,
            final ArrayList<Integer> coworkings) {
        final Map<String, Object> monthsMap = new LinkedHashMap<>();
        List<String> coworkingName = new ArrayList<>();
        final List<Map> coworkingsList = new ArrayList<>();
        Map<String, Object> c = null;
        EntityResult er = null;
        for (int j = 0; j < coworkings.size(); j++) {
            List<String> coworking = new ArrayList<>();
            List<Integer> in = new ArrayList<>();
            List<Double> account = new ArrayList<>();
            c = new HashMap<>(); //mapa del coworking y del importe
            keys.put("cw_id", coworkings.get(j));
            er = this.daoHelper.query(this.coworkingDao, keys, attrList,
                    this.coworkingDao.CW_QUERY_FACTURATION_BY_MONTH);
            coworking = (List<String>) er.get("coworking_name");
            in = (List<Integer>) er.get("m");
            account = (List<Double>) er.get("account");
            if (coworking != null) {
                c.put("name", coworking.get(0));
                c.put("value", account.get(0));
                coworkingsList.add(c);
                coworkingName = (List<String>) er.get("coworking_name");
                monthsMap.put("name", keys.get("date_part('month',booking_date.date)"));
                monthsMap.put("i", in.get(0));
                monthsMap.put("series", coworkingsList);
            }
        }
        if (!monthsMap.isEmpty()) {
            return monthsMap;
        } else {
            return null;
        }
    }
    @Override
    public EntityResult bookingsByDayQuery(final Map<String, Object> keyMap, final List<String> attrList) throws OntimizeJEERuntimeException {
        final Object user = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        final int userId = (int) ((UserInformation) user).getOtherData().get(UserDao.USR_ID);
        keyMap.put(CoworkingDao.CW_USER_ID, userId);
        return this.daoHelper.query(this.coworkingDao, keyMap, attrList, this.coworkingDao.BOOKINGS_BY_DAY_QUERY);
    }

    @Override
    public EntityResult bookingsByMonthQuery(final Map<String, Object> keyMap, final List<String> attrList) throws OntimizeJEERuntimeException {
        final Object user = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        final int userId = (int) ((UserInformation) user).getOtherData().get(UserDao.USR_ID);
        keyMap.put(CoworkingDao.CW_USER_ID, userId);
        return this.daoHelper.query(this.coworkingDao, keyMap, attrList, this.coworkingDao.BOOKINGS_BY_MONTH_QUERY);
    }
}