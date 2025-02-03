DO $$
DECLARE
my_date TIMESTAMP;

	/*	Información del usuario	*/
	my_user usr_user.usr_id%TYPE;
	my_user_usr_login usr_user.usr_login%TYPE;
	my_user_usr_name usr_user.usr_name%TYPE;
	my_user_mail usr_user.usr_email%TYPE;
	my_user_password usr_user.usr_password%TYPE;

    my_cw_id coworking.cw_id%TYPE;
    my_bk_id booking.bk_id%TYPE;

    coworkings TEXT[] := ARRAY['Digital Hub', 'Aitzenea', 'Buen Camino', 'Via Lactea', 'O Galo Cowork', 'A Ponte'];  /* AÑADIR LOS COWORKINGS ELEGIDOS*/

    i INT;

    dates TIMESTAMP[] := ARRAY[
        '2024-12-05',
        '2024-12-31',
        '2025-02-04',
        '2025-02-05',
        '2025-02-06',
        '2025-02-08'
    ];  -- Fechas específicas

BEGIN
    -- Obtener el usr_login del array
    my_user_usr_login := 'diego';
    my_user_usr_name := 'Diego';
    -- Generar el usr_email
    my_user_mail := my_user_usr_login || '@mail.com';

    my_user_password := '$2a$12$Kz66GrY8iYy65pZkr8sH.OQxbWABgMGbJ7va6X3b0/Y01vVeAlsk2';

    -- Insertar el nuevo usuario en la tabla usr_user
    INSERT INTO usr_user (usr_login, usr_name, usr_email, usr_password)
    VALUES (my_user_usr_login, my_user_usr_name, my_user_mail, my_user_password)
    RETURNING usr_id INTO my_user;

    -- Insertar el nuevo rol en la tabla usr_user_role
    INSERT INTO usr_user_role (uro_id, usr_id, rol_id)
    VALUES (nextval('usr_user_role_uro_id_seq'::regclass), my_user, 2);

    -- Bucle para cada coworking en el array
    FOR i IN 1..array_length(coworkings, 1) LOOP
            -- Seleccionar el coworking actual
        SELECT cw_id INTO my_cw_id FROM coworking WHERE cw_name = coworkings[i] LIMIT 1;

        INSERT INTO public.booking (bk_id, bk_usr_id, bk_cw_id, bk_state)
        VALUES (nextval('booking_bk_id_seq'::regclass), my_user, my_cw_id, true)
            RETURNING bk_id INTO my_bk_id;

       INSERT INTO public.booking_date (bk_id, "date") VALUES (my_bk_id, dates[i]);

    END LOOP;
END $$;