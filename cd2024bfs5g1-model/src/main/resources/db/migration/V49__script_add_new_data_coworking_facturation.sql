DO $$
DECLARE

/* Información de eventos	*/
my_event_id event.id_event%TYPE;
my_event_name event.name%TYPE;
my_event_description event.description%TYPE;
my_event_date_event event.date_event%TYPE;
my_event_hour_event event.hour_event%TYPE;
my_event_address event.address%TYPE;
my_event_bookings event.bookings%TYPE;
my_event_duration event.duration%TYPE;
my_event_image_event event.image_event%TYPE;
my_event_locality event.locality%TYPE;
my_event_price event.price%TYPE;

my_location coworking.cw_location%TYPE;


my_date TIMESTAMP;

	/*	Información del usuario	*/
	my_user usr_user.usr_id%TYPE;
    my_cw_id coworking.cw_id%TYPE;
    my_bk_id booking.bk_id%TYPE;

    coworkings TEXT[] := ARRAY['CoLab Zone'];  /* AÑADIR LOS COWORKINGS Datos Cowrking CoLabZone*/
    user_names TEXT[] := ARRAY['Adela', 'Alberto', 'Ana', 'Beatriz', 'Nataly'];
    user_names2 TEXT[] := ARRAY['Hugo', 'Miguel', 'Lucas', 'Sergio', 'Olivia'];
    user_names3 TEXT[] := ARRAY['Hugo', 'Miguel', 'Lucas', 'Sergio', 'Olivia','Adela', 'Alberto', 'Ana', 'Beatriz', 'Nataly'];


    dates TIMESTAMP[] := ARRAY[
        '2024-10-04',
        '2024-10-05',
        '2024-10-06',
        '2024-10-08',
        '2024-10-31',
        '2024-11-04',
        '2024-11-05',
        '2024-11-06',
        '2024-11-08',
        '2024-11-15',
        '2024-11-16',
        '2024-11-18',
        '2024-11-30',
        '2024-12-04',
        '2024-12-05',
        '2024-12-06',
        '2024-12-15',
        '2024-12-16',
        '2024-12-18',
        '2024-12-30',
        '2024-12-08',
        '2024-12-31'];  -- Fechas específicas

    dates2 TIMESTAMP[] := ARRAY[
        '2024-10-24',
        '2024-10-25',
        '2024-10-26',
        '2024-10-18',
        '2024-10-31',
        '2024-11-14',
        '2024-11-15',
        '2024-11-16',
        '2024-11-28',
        '2024-11-30',
        '2024-12-06',
        '2024-12-07',
        '2024-12-08',
        '2024-12-10',
        '2024-12-17',
        '2024-12-20',
        '2024-12-27'];  -- Fechas específicas

    dates3 TIMESTAMP[] := ARRAY[
        '2025-01-04',
        '2025-01-05',
        '2025-01-06',
        '2025-01-08',
        '2025-01-15',
        '2025-01-16',
        '2025-01-18',
        '2025-01-30',
        '2025-01-31',
        '2025-02-01',
        '2025-02-06',
        '2025-02-07',
        '2025-02-08',
        '2025-02-10',
        '2025-02-17',
        '2025-02-20',
        '2025-02-27'];  -- Fechas específicas

BEGIN

    FOR i IN 1..array_length(user_names, 1) LOOP

		SELECT usr_id into my_user FROM usr_user where usr_name = user_names[i];

        -- Bucle para cada coworking en el array
        FOR j IN 1..array_length(coworkings, 1) LOOP

            -- Seleccionar el coworking actual
            SELECT cw_id INTO my_cw_id FROM coworking WHERE cw_name = coworkings[j] LIMIT 1;

            INSERT INTO public.booking (bk_usr_id, bk_cw_id, bk_state)
            VALUES (my_user, my_cw_id, true)
			RETURNING bk_id INTO my_bk_id;

            FOR k IN 1..array_length(dates, 1) LOOP

                INSERT INTO public.booking_date (bk_id, "date") VALUES (my_bk_id, dates[k]);

            END LOOP;
        END LOOP;
    END LOOP;
    FOR i IN 1..array_length(user_names2, 1) LOOP

		SELECT usr_id into my_user FROM usr_user where usr_name = user_names2[i];

        -- Bucle para cada coworking en el array
        FOR j IN 1..array_length(coworkings, 1) LOOP

            -- Seleccionar el coworking actual
            SELECT cw_id INTO my_cw_id FROM coworking WHERE cw_name = coworkings[j] LIMIT 1;

            INSERT INTO public.booking (bk_usr_id, bk_cw_id, bk_state)
            VALUES (my_user, my_cw_id, true)
			RETURNING bk_id INTO my_bk_id;

            FOR k IN 1..array_length(dates2, 1) LOOP

                INSERT INTO public.booking_date (bk_id, "date") VALUES (my_bk_id, dates2[k]);

            END LOOP;
        END LOOP;
    END LOOP;

    FOR i IN 1..array_length(user_names3, 1) LOOP

		SELECT usr_id into my_user FROM usr_user where usr_name = user_names3[i];

        -- Bucle para cada coworking en el array
        FOR j IN 1..array_length(coworkings, 1) LOOP

            -- Seleccionar el coworking actual
            SELECT cw_id INTO my_cw_id FROM coworking WHERE cw_name = coworkings[j] LIMIT 1;

            INSERT INTO public.booking (bk_usr_id, bk_cw_id, bk_state)
            VALUES (my_user, my_cw_id, true)
			RETURNING bk_id INTO my_bk_id;

            FOR k IN 1..array_length(dates3, 1) LOOP

                INSERT INTO public.booking_date (bk_id, "date") VALUES (my_bk_id, dates3[k]);

            END LOOP;
        END LOOP;
    END LOOP;


    /*  Recuperamos la población del evento */

    SELECT id_city INTO my_location FROM city where city =  'Boiro';


    /*	Asignamos los valores para el evento que vamos a crear	*/
    SELECT 	'Cena de Empresa','Celebración de la comida de empresa', '2024-12-18','21:15:00'
    INTO my_event_name, my_event_description, my_event_date_event, my_event_hour_event;

    SELECT 'Avenida Ourense, 8', 16, 120, 0
    INTO my_event_address, my_event_bookings, my_event_duration, my_event_price;

    /*	Creamos eventos para el usuario creado	*/

    INSERT INTO public."event" (id_event, "name", description, date_event, hour_event, address, bookings, usr_id, duration, image_event, locality, price)
    VALUES(nextval('event_id_event_seq'::regclass), my_event_name, my_event_description, my_event_date_event, my_event_hour_event, my_event_address, my_event_bookings, 3, my_event_duration, my_event_image_event,  my_location, my_event_price)
    RETURNING id_event into my_event_id;

    SELECT 	'Festa do marisco','Semana desgustación de marisco', '2024-12-05','21:15:00'
    INTO my_event_name, my_event_description, my_event_date_event, my_event_hour_event;

    SELECT 'Avenida Ourense, 8', 16, 120, 0
    INTO my_event_address, my_event_bookings, my_event_duration, my_event_price;

    /*	Creamos eventos para el usuario creado	*/
    INSERT INTO public."event" (id_event, "name", description, date_event, hour_event, address, bookings, usr_id, duration, image_event, locality, price)
    VALUES(nextval('event_id_event_seq'::regclass), my_event_name, my_event_description, my_event_date_event, my_event_hour_event, my_event_address, my_event_bookings, 3, my_event_duration, my_event_image_event,  my_location, my_event_price)
    RETURNING id_event into my_event_id;


END $$;