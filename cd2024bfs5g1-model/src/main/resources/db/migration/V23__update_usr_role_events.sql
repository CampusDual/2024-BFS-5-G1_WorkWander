update usr_role
set rol_json_client_permission = '{"menu":[{"attr":"coworkingsPublic","visible":false,"enabled":false},
{"attr":"eventsPublic","visible":false,"enabled":false},{"attr":"login_public","visible":false,"enabled":false}],
"routes":[{"permissionId":"coworkingsPublic","enabled":false},{"permissionId":"eventsPublic","enabled":false},
{"permissionId":"login_public","enabled":false}]}'
where rol_id = 1;

update usr_role
set rol_json_client_permission = '{"menu":[{"attr":"admin","visible":false,"enabled":false},
{"attr":"MyCoworkings","visible":false,"enabled":false},{"attr":"coworkingsPublic","visible":false,"enabled":false},
{"attr":"eventsPublic","visible":false,"enabled":false},{"attr":"login_public","visible":false,"enabled":false},
{"attr":"coworkings","visible":false,"enabled":false},{"attr":"analytics","visible":false,"enabled":false}],
"routes":[{"permissionId":"myCoworkings","enabled":false},{"permissionId":"coworkingsPublic","enabled":false},
{"permissionId":"eventsPublic","enabled":false},{"permissionId":"login_public","enabled":false},
{"permissionId":"coworkings-new.route","enabled":false},{"permissionId":"analytics-occupation","enabled":false}]}'
where rol_id = 2;

update usr_role
set rol_json_client_permission = '{"menu":[{"attr":"admin","visible":false,"enabled":false},
{"attr":"coworkingsPublic","visible":false,"enabled":false},{"attr":"eventsPublic","visible":false,"enabled":false},
{"attr":"login_public","visible":false,"enabled":false},{"attr":"myBookings","visible":false,"enabled":false},
{"attr":"myCalendar","visible":false,"enabled":false}],"components":[{"attr":"coworkingDetail","selector":"o-form",
"components":[{"attr":"bookingButton","visible":false,"enabled":false},
{"attr":"date","visible":false,"enabled":false},{"attr":"realCapacity","visible":false,"enabled":false}]}],
"routes":[{"permissionId":"Bookings","enabled":false},{"permissionId":"myCalendar","enabled":false}]}'
where rol_id = 3;