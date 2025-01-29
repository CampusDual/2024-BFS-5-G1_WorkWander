DO $$
DECLARE
	my_user_role usr_user_role.rol_id%TYPE;

	/*	Información del usuario	*/
	my_user usr_user.usr_id%TYPE;
	my_user_usr_login usr_user.usr_login%TYPE;
	my_user_usr_name usr_user.usr_name%TYPE;
	my_user_mail usr_user.usr_email%TYPE;
	my_user_password usr_user.usr_password%TYPE;
	my_user_cif usr_user.usr_cif%TYPE;

BEGIN
   /*    Usuario perfil company    */

    SELECT rol_id INTO my_user_role FROM usr_role where rol_name =  'company';

    /*	Asignamos los valores de usuario que vamos a crear	*/
    SELECT
        'cotecme',
        'company@mail.com',
        'Cotecme',
        '$2a$12$F0b201nBwTw7xkvtvYyAsOGGmBoPgKPuIxOU86dY5W484U.BiofAG',
        'N7621277H'
    INTO
        my_user_usr_login,
        my_user_mail,
        my_user_usr_name,
        my_user_password,
        my_user_cif;

    /* Creamos el usuario */
    INSERT INTO public.usr_user
        (usr_id, usr_login, usr_name, usr_email, usr_password, usr_cif)
    VALUES
        (nextval('usr_user_usr_id_seq'::regclass), my_user_usr_login, my_user_usr_name, my_user_mail, my_user_password, my_user_cif)
    RETURNING usr_id INTO my_user;

    /* Asignamos el rol de empresa */
    INSERT INTO public.usr_user_role
    (uro_id, usr_id, rol_id) VALUES(nextval('usr_user_role_uro_id_seq'::regclass), my_user, my_user_role);


END $$;
