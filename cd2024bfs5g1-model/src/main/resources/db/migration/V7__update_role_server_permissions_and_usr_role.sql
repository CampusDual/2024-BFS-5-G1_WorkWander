UPDATE usr_role
SET rol_json_client_permission = '{"menu":[{"attr":"admin","visible":false,"enabled":false},
{"attr":"MyCoworkings","visible":false,"enabled":false},
{"attr":"coworkingsPublic","visible":false,"enabled":false},
{"attr":"login_public","visible":false,"enabled":false}],
"routes":[{"permissionId":"myCoworkings","enabled":false},
{"permissionId":"coworkingsPublic","enabled":false},{"permissionId":"login_public","enabled":false}]}'
WHERE rol_id = 2;

insert into usr_role_server_permission (rol_id,srp_id)
values
	(2,19),
	(2,20);