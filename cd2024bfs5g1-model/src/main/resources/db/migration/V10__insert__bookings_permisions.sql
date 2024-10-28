
insert into usr_server_permission (srp_name) values ('com.campusdual.cd2024bfs5g1.api.core.service.IBookingService/bookingInsert');

insert into usr_role_server_permission (rol_id, srp_id) values (2, (select srp_id from usr_server_permission where srp_name = 'com.campusdual.cd2024bfs5g1.api.core.service.IBookingService/bookingInsert'));

UPDATE usr_role
SET rol_json_client_permission = '{"menu": [{ "attr": "admin", "visible": false, "enabled": false },
{"attr":"coworkingsPublic","visible":false,"enabled":false},{"attr":"login_public","visible":false,"enabled":false}],"components":[{"attr":"coworkingDetail","selector":"o-form","components":[{"attr":"bookingButton","visible":false,"enabled":false}]}]}'
WHERE rol_id = 3;




