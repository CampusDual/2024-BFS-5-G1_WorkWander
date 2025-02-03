DO $$
DECLARE
	my_user_role usr_user_role.rol_id%TYPE;

	/*	Información del usuario	*/
	my_user usr_user.usr_id%TYPE;
	my_user_usr_login usr_user.usr_login%TYPE;
	my_user_usr_name usr_user.usr_name%TYPE;
	my_user_mail usr_user.usr_email%TYPE;
	my_user_password usr_user.usr_password%TYPE;

    my_cw_id coworking.cw_id%TYPE;
    my_bk_id booking.bk_id%TYPE;

	my_date TIMESTAMP;
	/*  Datos de creación de usuarios */
	num_days INT;
	i INT;

    user_names TEXT[] := ARRAY[
        /*'Adela',*/ 'Alberto', 'Ana', 'Beatriz', 'Nataly'
    ];

    /*  Creación de Reservas */
	coworkings TEXT[] := ARRAY['Via Lactea', 'Palas Camiño', 'A Ponte', 'Casa Ribeira Sacra'];  /* AÑADIR LOS COWORKINGS ELEGIDOS*/

	/*  Creación de reseñas */
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

    SELECT rol_id INTO my_user_role FROM usr_role where rol_name =  'user';

    SELECT CURRENT_DATE  - INTERVAL '1 month'  INTO my_date;

    -- Crear usuarios en la tabla usr_user
    FOR i IN 1..array_length(user_names, 1) LOOP
        -- Obtener el usr_login del array
        my_user_usr_login := lower(user_names[i]);

        my_user_usr_name := user_names[i];

        -- Generar el usr_email
        my_user_mail := my_user_usr_login || '@mail.com';

        my_user_password := '$2a$12$Kz66GrY8iYy65pZkr8sH.OQxbWABgMGbJ7va6X3b0/Y01vVeAlsk2';

        -- Insertar el nuevo usuario en la tabla usr_user
        INSERT INTO usr_user (usr_login, usr_name, usr_email, usr_password)
        VALUES (my_user_usr_login, my_user_usr_name, my_user_mail, my_user_password)
        RETURNING usr_id INTO my_user;

        -- Insertar el nuevo rol en la tabla usr_user_role
        INSERT INTO usr_user_role (uro_id, usr_id, rol_id)
        VALUES (nextval('usr_user_role_uro_id_seq'::regclass), my_user, my_user_role);


        -- Bucle para cada coworking en el array
        FOR i IN 1..array_length(coworkings, 1) LOOP
                    -- Seleccionar el coworking actual
            SELECT cw_id INTO my_cw_id FROM coworking WHERE cw_name = coworkings[i] LIMIT 1;

            -- Fechas pasadas
            SELECT my_date - INTERVAL '1 month' INTO my_date;
            num_days := floor(random() * 4 + 2); -- Número de días de reserva entre 2 y 5
            INSERT INTO public.booking (bk_id, bk_usr_id, bk_cw_id, bk_state)
            VALUES (nextval('booking_bk_id_seq'::regclass), my_user, my_cw_id, true)
            RETURNING bk_id INTO my_bk_id;

            FOR j IN 1..num_days LOOP
                        INSERT INTO public.booking_date (bk_id, "date") VALUES (my_bk_id, my_date + INTERVAL '1 day' * j);
            END LOOP;

            -- Fechas presentes
            SELECT my_date + INTERVAL '1 month'  INTO my_date;
            num_days := floor(random() * 4 + 2); -- Número de días de reserva entre 2 y 5
            INSERT INTO public.booking (bk_id, bk_usr_id, bk_cw_id, bk_state)
            VALUES (nextval('booking_bk_id_seq'::regclass), my_user, my_cw_id, true)
            RETURNING bk_id INTO my_bk_id;

            FOR j IN 1..num_days LOOP
                        INSERT INTO public.booking_date (bk_id, "date") VALUES (my_bk_id, my_date + INTERVAL '1 day' * j);
            END LOOP;

            -- Fechas futuras
            SELECT my_date + INTERVAL '2 month' INTO my_date;
            num_days := floor(random() * 4 + 2); -- Número de días de reserva entre 2 y 5
            INSERT INTO public.booking (bk_id, bk_usr_id, bk_cw_id, bk_state)
            VALUES (nextval('booking_bk_id_seq'::regclass), my_user, my_cw_id, true)
                RETURNING bk_id INTO my_bk_id;
            FOR j IN 1..num_days LOOP
                        INSERT INTO public.booking_date (bk_id, "date") VALUES (my_bk_id, my_date + INTERVAL '1 day' * j);
            END LOOP;

        END LOOP;

    END LOOP;

    /*  Creamos las reseñas de las reservas */
    -- Seleccionar todas las reservas pasadas
    FOR my_bk_id, my_date IN
    SELECT DISTINCT bk_id, date FROM booking_date WHERE date < CURRENT_DATE
    LOOP
        -- Verificar si el bk_id ya ha sido procesado
        IF NOT my_bk_id = ANY(processed_bk_ids) THEN
            -- Verificar si ya existe una reseña para el bk_id en la tabla booking_rate
            SELECT COUNT(*) INTO existing_review_count FROM booking_rate WHERE id_bkr = my_bk_id;

            IF existing_review_count = 0 THEN
                -- Seleccionar el coworking y el usuario asociados a la reserva
                SELECT bk_cw_id, bk_usr_id INTO my_cw_id, my_user_id FROM booking WHERE bk_id = my_bk_id;

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

            END IF;
        END IF;
    END LOOP;

END $$;