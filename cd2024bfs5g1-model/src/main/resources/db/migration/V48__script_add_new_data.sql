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
	num_days INT;
	i INT;
    num_users INT := 18; -- Número de usuarios a crear

    user_names TEXT[] := ARRAY[
        'Adela', 'Juan', 'Ana', 'Hugo','Miguel', 'David', 'Julian', 'Alberto', 'Javier', 'Orlando', 'Bryan', 'Lucas', 'Alejandro', 'Tania', 'Sergio', 'Julio', 'Beatriz', 'Nataly'
    ];

	coworkings TEXT[] := ARRAY['Via Lactea', 'Palas Camiño', 'A Ponte', 'CoLab Zone'];  /* AÑADIR LOS COWORKINGS ELEGIDOS*/

BEGIN

    SELECT rol_id INTO my_user_role FROM usr_role where rol_name =  'user';

    -- Crear usuarios en la tabla usr_user
    FOR i IN 1..num_users LOOP
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
            SELECT CURRENT_DATE - INTERVAL '1 month' INTO my_date;
            num_days := floor(random() * 4 + 2); -- Número de días de reserva entre 2 y 5
            INSERT INTO public.booking (bk_id, bk_usr_id, bk_cw_id, bk_state)
            VALUES (nextval('booking_bk_id_seq'::regclass), my_user, my_cw_id, true)
            RETURNING bk_id INTO my_bk_id;

            FOR j IN 1..num_days LOOP
                        INSERT INTO public.booking_date (bk_id, "date") VALUES (my_bk_id, my_date + INTERVAL '1 day' * j);
            END LOOP;

            -- Fechas presentes
            SELECT CURRENT_DATE INTO my_date;
            num_days := floor(random() * 4 + 2); -- Número de días de reserva entre 2 y 5
            INSERT INTO public.booking (bk_id, bk_usr_id, bk_cw_id, bk_state)
            VALUES (nextval('booking_bk_id_seq'::regclass), my_user, my_cw_id, true)
            RETURNING bk_id INTO my_bk_id;

            FOR j IN 1..num_days LOOP
                        INSERT INTO public.booking_date (bk_id, "date") VALUES (my_bk_id, my_date + INTERVAL '1 day' * j);
            END LOOP;

            -- Fechas futuras
            SELECT CURRENT_DATE + INTERVAL '1 month' INTO my_date;
            num_days := floor(random() * 4 + 2); -- Número de días de reserva entre 2 y 5
            INSERT INTO public.booking (bk_id, bk_usr_id, bk_cw_id, bk_state)
            VALUES (nextval('booking_bk_id_seq'::regclass), my_user, my_cw_id, true)
                RETURNING bk_id INTO my_bk_id;
            FOR j IN 1..num_days LOOP
                        INSERT INTO public.booking_date (bk_id, "date") VALUES (my_bk_id, my_date + INTERVAL '1 day' * j);
            END LOOP;

        END LOOP;

    END LOOP;

END $$;