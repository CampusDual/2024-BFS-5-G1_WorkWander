DO $$
DECLARE
my_bk_id booking_date.bk_id%TYPE;
    my_date booking_date.date%TYPE;
    my_cw_id coworking.cw_id%TYPE;
    my_user_id usr_user.usr_id%TYPE;
    review_descriptions TEXT[] := ARRAY[
        'Excelente experiencia, muy recomendable.',
        'Buen lugar para trabajar, pero podría mejorar.',
        'El ambiente es agradable y tranquilo.',
        'Buena conexión a internet y servicios.',
        'El personal es muy amable y servicial.'
    ];
    review_description TEXT;
    review_ratio INT;
    review_index INT := 1;
    processed_bk_ids INT[] := '{}';
    existing_review_count INT;

BEGIN
    -- Seleccionar todas las reservas pasadas
FOR my_bk_id, my_date IN
SELECT DISTINCT bk_id, date
FROM booking_date
WHERE date < CURRENT_DATE
    LOOP
-- Verificar si el bk_id ya ha sido procesado
    IF NOT my_bk_id = ANY(processed_bk_ids) THEN
-- Verificar si ya existe una reseña para el bk_id en la tabla booking_rate
SELECT COUNT(*) INTO existing_review_count
FROM booking_rate
WHERE id_bkr = my_bk_id;

IF existing_review_count = 0 THEN
                -- Seleccionar el coworking y el usuario asociados a la reserva
SELECT bk_cw_id, bk_usr_id INTO my_cw_id, my_user_id
FROM booking
WHERE bk_id = my_bk_id;

-- Asignar una descripción de reseña única
review_description := review_descriptions[review_index];
                review_index := review_index + 1;
                IF review_index > array_length(review_descriptions, 1) THEN
                    review_index := 1; -- Reiniciar el índice si se supera el tamaño del array
END IF;

                -- Generar un ratio de reseña aleatorio entre 2 y 5
                review_ratio := floor(random() * 4 + 2);

                -- Insertar la reseña en la tabla Booking_rate
INSERT INTO booking_rate (id_bkr, bk_description, bkr_ratio, cw_id, usr_id)
VALUES (my_bk_id, review_description, review_ratio, my_cw_id, my_user_id);

-- Agregar el bk_id al array de procesados
processed_bk_ids := array_append(processed_bk_ids, my_bk_id);
END IF;
END IF;
END LOOP;

END $$;