DO $$
DECLARE
my_date	TIMESTAMP;
	my_user usr_user.usr_id%TYPE;
	my_cw_id coworking.cw_id%TYPE;
	my_bk_id booking.bk_id%TYPE;

BEGIN

/*	Asignamos la fecha de partida de los datos actuales	*/
SELECT CURRENT_DATE - INTERVAL '1 month' INTO my_date;

/*	Recuperamos el código de usuario para que genere los coworking	*/
SELECT 2 INTO my_user;

/* ---> Seleccionamos el coworking Buen Camino*/
SELECT 1 cw_id INTO my_cw_id FROM coworking WHERE cw_name = 'Buen Camino';

/*	Insertamos una reserva para el coworking creado*/
INSERT INTO public.booking (bk_id, bk_usr_id, bk_cw_id, bk_state) VALUES(nextval('booking_bk_id_seq'::regclass), my_user, my_cw_id, true)
    returning bk_id INTO my_bk_id;

/*	Creamos la reserva para 4 días diferentes	*/
INSERT INTO public.booking_date (bk_id, "date") VALUES(my_bk_id, my_date + INTERVAL '1 day');
INSERT INTO public.booking_date (bk_id, "date") VALUES(my_bk_id, my_date + INTERVAL '2 day');
INSERT INTO public.booking_date (bk_id, "date") VALUES(my_bk_id, my_date + INTERVAL '3 day');
INSERT INTO public.booking_date (bk_id, "date") VALUES(my_bk_id, my_date + INTERVAL '4 day');

/*	---> Seleccionamos el coworking Sarria Collaborative*/
SELECT TOP 1 cw_id INTO my_cw_id FROM coworking WHERE cw_name = 'Sarria Collaborative';

INSERT INTO public.booking (bk_id, bk_usr_id, bk_cw_id, bk_state) VALUES(nextval('booking_bk_id_seq'::regclass), my_user, my_cw_id, true)
    returning bk_id INTO my_bk_id;

INSERT INTO public.booking_date (bk_id, "date") VALUES(my_bk_id, my_date + INTERVAL '5 day');
INSERT INTO public.booking_date (bk_id, "date") VALUES(my_bk_id, my_date + INTERVAL '6 day');
/*	---> Seleccionamos el coworking O Galo Cowork*/
SELECT TOP 1 cw_id INTO my_cw_id FROM coworking WHERE cw_name = 'O Galo Cowork';

INSERT INTO public.booking (bk_id, bk_usr_id, bk_cw_id, bk_state) VALUES(nextval('booking_bk_id_seq'::regclass), my_user, my_cw_id, true)
    returning bk_id INTO my_bk_id;

INSERT INTO public.booking_date (bk_id, "date") VALUES(my_bk_id, my_date + INTERVAL '3 day');
INSERT INTO public.booking_date (bk_id, "date") VALUES(my_bk_id, my_date + INTERVAL '4 day');
INSERT INTO public.booking_date (bk_id, "date") VALUES(my_bk_id, my_date + INTERVAL '5 day');

/*	---> Seleccionamos el coworking Ferreiros Creative Suite*/
SELECT TOP 1 cw_id INTO my_cw_id FROM coworking WHERE cw_name = 'Ferreiros Creative Suite';

INSERT INTO public.booking (bk_id, bk_usr_id, bk_cw_id, bk_state) VALUES(nextval('booking_bk_id_seq'::regclass), my_user, my_cw_id, true)
    returning bk_id INTO my_bk_id;


INSERT INTO public.booking_date (bk_id, "date") VALUES(my_bk_id, my_date + INTERVAL '10 day');
INSERT INTO public.booking_date (bk_id, "date") VALUES(my_bk_id, my_date + INTERVAL '11 day');
INSERT INTO public.booking_date (bk_id, "date") VALUES(my_bk_id, my_date + INTERVAL '12 day');

END $$;