CREATE TABLE event (
    id_event serial NOT NULL,
	name varchar(100) NOT NULL,
	description text NOT NULL,
	date_event timestamp NOT NULL,
	address text NOT NULL,
	locality text NOT NULL,
	bookings int4 NOT NULL,
	usr_id int4 NOT NULL,
	CONSTRAINT fk_usr_id FOREIGN KEY usr_id REFERENCES usr_user(usr_id),
	CONSTRAINT pk_id_event PRIMARY KEY (id_event)
);

insert into usr_role(rol_name, rol_xml_client_permission, rol_json_client_permission, rol_notes) values (
    'company', '<?xml version="1.0" encoding="UTF-8"?><security><MENU><ELEMENT attr="admin"><Enabled restricted="yes"/><Visible restricted="yes"/></ELEMENT></MENU></security>','{ "menu": [{ "attr": "admin", "visible": false, "enabled": false }] }', 'This is the company role'
    );

insert into usr_server_permission (srp_name) values ('com.campusdual.cd2024bfs5g1.api.core.service.IEventService/eventInsert');

insert into usr_role_server_permission (rol_id, srp_id) values (3, (select srp_id from usr_server_permission where srp_name = 'com.campusdual.cd2024bfs5g1.api.core.service.IEventService/eventInsert'));

update usr_role set rol_json_client_permission = '{ "menu": [{ "attr": "admin", "visible": false, "enabled": false }, {"attr":"MyCoworkings","visible":false,"enabled":false}, { "attr": "newEvents", "visible": false, "enabled": false }], "routes": [{"permissionId": "events-new-route", "enabled": false }}' where rol_id = 2;

update usr_role set rol_json_client_permission = '{ "menu": [{ "attr": "admin", "visible": false, "enabled": false }] }' where rol_id = 3;





