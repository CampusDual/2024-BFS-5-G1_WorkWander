update usr_role set rol_json_client_permission = '{"menu":[{"attr":"MyCoworkings","visible":false,"enabled":false},
{"attr":"coworkingsPublic","visible":false,"enabled":false},{"attr":"login_public","visible":false,"enabled":false},
{"attr":"coworkings","visible":false,"enabled":false}],"routes":[{"permissionId":"myCoworkings","enabled":false},
{"permissionId":"coworkingsPublic","enabled":false},{"permissionId":"login_public","enabled":false},
{"permissionId":"coworkings-new-route"}]}'
where rol_id = 1;
update usr_role set rol_json_client_permission = '{"menu":[{"attr":"MyCoworkings","visible":false,"enabled":false},
{"attr":"coworkingsPublic","visible":false,"enabled":false},{"attr":"login_public","visible":false,"enabled":false},
{"attr":"coworkings","visible":false,"enabled":false}],"routes":[{"permissionId":"myCoworkings","enabled":false},
{"permissionId":"coworkingsPublic","enabled":false},{"permissionId":"login_public","enabled":false},
{"permissionId":"coworkings-new-route"}]}'
 where rol_id = 2;
update usr_role set rol_json_client_permission = '{ "menu": [{ "attr": "admin", "visible": false, "enabled": false },
{"attr":"coworkingsPublic","visible":false,"enabled":false}, {"attr":"login_public","visible":false,"enabled":false}]}'
where rol_id = 3;
