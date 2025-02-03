DO $$
DECLARE
my_booking_id_event booking_event.bke_event_id%TYPE;
    my_event_id booking_event.bke_id_event%TYPE;
    my_user_id usr_user.usr_id%TYPE;
    num_insertions INT = 10; -- Número de inserciones que se van a realizar
    i INT;
    event_ids INT[];
    user_ids INT[];

BEGIN
    -- Obtener todos los IDs de eventos existentes
SELECT array_agg(id_event) INTO event_ids FROM event;

-- Obtener todos los IDs de usuarios existentes
SELECT array_agg(usr_id) INTO user_ids FROM usr_user;

-- Bucle para realizar múltiples inserciones
FOR i IN 1..num_insertions LOOP
        -- Seleccionar un evento aleatorio de los IDs existentes
        my_event_id := event_ids[ceil(random() * array_length(event_ids, 1))];

        -- Seleccionar un usuario aleatorio de los IDs existentes
        my_user_id := user_ids[ceil(random() * array_length(user_ids, 1))];

        -- Insertar una asistencia para el evento
INSERT INTO booking_event (bke_event_id, bke_id_event, bke_usr_id, bke_event_state)
VALUES (nextval('booking_event_bke_event_id_seq'::regclass), my_event_id, my_user_id, true)
    RETURNING bke_event_id INTO my_booking_id_event;
END LOOP;

END $$;