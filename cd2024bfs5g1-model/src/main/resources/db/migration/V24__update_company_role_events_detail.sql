update usr_role
set rol_json_client_permission = '{"menu":[{"attr":"admin","visible":false,"enabled":false},
{"attr":"coworkingsPublic","visible":false,"enabled":false},{"attr":"eventsPublic","visible":false,"enabled":false},
{"attr":"login_public","visible":false,"enabled":false},{"attr":"myBookings","visible":false,"enabled":false},
{"attr":"myCalendar","visible":false,"enabled":false}],
"components":[{"attr":"coworkingDetail","selector":"o-form","components":[{"attr":"bookingButton","visible":false,"enabled":false},
{"attr":"date","visible":false,"enabled":false},{"attr":"realCapacity","visible":false,"enabled":false}]},
{"attr":"eventDetail","selector":"o-form","components":[{"attr":"bookingButton","visible":false,"enabled":false}]}],
"routes":[{"permissionId":"Bookings","enabled":false},{"permissionId":"myCalendar","enabled":false}]}'
where rol_id = 3;