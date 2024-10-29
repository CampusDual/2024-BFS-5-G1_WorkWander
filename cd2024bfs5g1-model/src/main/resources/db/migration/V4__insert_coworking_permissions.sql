
insert into usr_server_permission (srp_name) values ('com.campusdual.cd2024bfs5g1.api.core.service.ICoworkingService/myCoworkingQuery');

insert into usr_role_server_permission (rol_id, srp_id) values (3, (select srp_id from usr_server_permission where srp_name = 'com.campusdual.cd2024bfs5g1.api.core.service.ICoworkingService/myCoworkingQuery'));

update usr_role set rol_json_client_permission = '{"menu":[{"attr":"admin","visible":false,"enabled":false},{"attr":"MyCoworkings","visible":false,"enabled":false},{"attr":"newEvents","visible":false,"enabled":false}],"routes":[{"permissionId":"myCoworkings","enabled":false},{"permissionId":"events-new-route","enabled":false}]}' where rol_id = 2;

update usr_role set rol_json_client_permission = '{"menu":[{"attr":"MyCoworkings","visible":false,"enabled":false}],"routes":[{"permissionId":"myCoworkings","enabled":false}]}' where rol_id = 1;
