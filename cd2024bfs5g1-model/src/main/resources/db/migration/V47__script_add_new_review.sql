DO $$
DECLARE
my_bk_id booking_date.bk_id%TYPE;
    my_date booking_date.date%TYPE;
    my_cw_id coworking.cw_id%TYPE;
    my_user_id usr_user.usr_id%TYPE;
    review_descriptions TEXT[] := ARRAY[
        'Excelente experiencia, muy recomendable.',
                        'El coworking tiene lo justo y necesario. No destaca, pero cumple con los básicos como agua y espacio para trabajar.',
        'Buen lugar para trabajar, pero podría mejorar.',
        'El ambiente es agradable y tranquilo.',
                         'El coworking es amplio y cómodo, pero la máquina de vending solo tenía opciones muy básicas. Me hubiera gustado más variedad.',
        'Buena conexión a internet y servicios.',
          'Tuve una experiencia regular. Las sillas eran buenas, pero el ruido de otros usuarios me distrajo bastante. Sin embargo, la pantalla extra fue útil.',
'Un lugar inspirador para trabajar. Sillas de calidad, agua fresca siempre disponible y un ambiente colaborativo. Volveré sin duda.' ];
    review_description TEXT;
    review_ratio INT;
    review_index INT := 1;
    processed_bk_ids INT[] := '{}';
    existing_review_count INT;
    total_reviews INT;

BEGIN
    -- Contar el número total de reseñas existentes
SELECT COUNT(*) INTO total_reviews FROM booking_rate;

-- Si ya hay 5 reseñas, salir del bloque
IF total_reviews >= 5 THEN
        RETURN;
END IF;

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
INSERT INTO booking_rate (id_bkr, bkr_description, bkr_ratio, cw_id, usr_id)
VALUES (my_bk_id, review_description, review_ratio, my_cw_id, my_user_id);

-- Agregar el bk_id al array de procesados
processed_bk_ids := array_append(processed_bk_ids, my_bk_id);

                -- Incrementar el contador de reseñas totales
                total_reviews := total_reviews + 1;

                -- Si se alcanzan las 5 reseñas, salir del bucle
                IF total_reviews >= 5 THEN
                    EXIT;
END IF;
END IF;
END IF;
END LOOP;

END $$;