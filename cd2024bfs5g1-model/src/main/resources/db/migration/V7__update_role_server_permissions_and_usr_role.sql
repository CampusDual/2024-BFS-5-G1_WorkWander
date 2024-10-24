UPDATE usr_role
SET rol_json_client_permission = '{"menu":[{"attr":"admin","visible":false,"enabled":false},
{"attr":"MyCoworkings","visible":false,"enabled":false},{"attr":"coworkingsPublic","visible":false,"enabled":false},
{"attr":"login_public","visible":false,"enabled":false},{"attr":"coworkings","visible":false,"enabled":false}],
"routes":[{"permissionId":"myCoworkings","enabled":false},{"permissionId":"coworkingsPublic","enabled":false},
{"permissionId":"login_public","enabled":false},{"permissionId":"coworkings-new.route","enabled":false}]}'
WHERE rol_id = 2;

insert into usr_role_server_permission (rol_id,srp_id) values
(2,(select srp_id from usr_server_permission where srp_name = 'com.campusdual.cd2024bfs5g1.api.core.service.IEventService/eventInsert')),
(2,(select srp_id from usr_server_permission where srp_name = 'com.campusdual.cd2024bfs5g1.api.core.service.IEventService/eventQuery'));