alter table booking
drop column bk_date;

create table booking_date (
bk_id integer not null,
date date not null,
primary KEY(bk_id, date),
constraint bk_id_fk foreign key (bk_id) references booking(bk_id));

UPDATE usr_role
SET rol_json_client_permission = '{"menu":[{"attr":"admin","visible":false,"enabled":false},{"attr":"coworkingsPublic","visible":false,"enabled":false},{"attr":"login_public","visible":false,"enabled":false},{"attr":"myBookings","visible":false,"enabled":false}],"components":[{"attr":"coworkingDetail","selector":"o-form","components":[{"attr":"bookingButton","visible":false,"enabled":false},{"attr":"date","visible":false,"enabled":false},{"attr":"realCapacity","visible":false,"enabled":false}]}],"routes":[{"permissionId":"Bookings","enabled":false}]}' WHERE rol_id = 3;