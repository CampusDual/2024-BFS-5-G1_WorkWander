UPDATE usr_rol
SET rol_json_client_permission = "{"menu":[{"attr":"admin","visible":false,"enabled":false},
{"attr":"coworkingsPublic","visible":false,"enabled":false},{"attr":"login_public","visible":false,"enabled":false}
,{"attr":"myBookings","visible":false,"enabled":false},{"attr":"myCalendar","visible":false,"enabled":false}],
"components":[{"attr":"coworkingDetail","selector":"o-form","components":[{"attr":"bookingButton","visible":false,"enabled":false},
{"attr":"date","visible":false,"enabled":false},{"attr":"realCapacity","visible":false,"enabled":false}]}],
"routes":[{"permissionId":"Bookings","enabled":false},{"permissionId":"myCalendar","enabled":false}]}"
WHERE rol_id = 3;

INSERT INTO usr_server_permission (srp_name) VALUES ('com.campusdual.cd2024bfs5g1.api.core.service.IEventService/myEventsCalendarQuery');

INSERT INTO usr_role_server_permission (rol_id,srp_id) VALUES
(2,(SELECT srp_id FROM usr_server_permission WHERE srp_name = 'com.campusdual.cd2024bfs5g1.api.core.service.IEventService/myEventsCalendarQuery'));