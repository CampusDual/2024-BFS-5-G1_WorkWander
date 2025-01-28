DO $$
DECLARE
my_date TIMESTAMP;
    my_user usr_user.usr_id%TYPE := 2; -- ID del usuario que realiza las reservas
    my_cw_id coworking.cw_id%TYPE;
    my_bk_id booking.bk_id%TYPE;
    coworkings TEXT[] := ARRAY['Via Lactea', 'Palas Camiño', 'A Ponte', 'CoLab Zone'];  /* AÑADIR LOS COWORKINGS ELEGIDOS*/
    num_days INT;
    i INT;

BEGIN
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
END $$;