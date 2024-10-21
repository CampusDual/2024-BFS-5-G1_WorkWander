insert into usr_server_permission (srp_name) values ('com.campusdual.cd2024bfs5g1.api.core.service.IEventService/eventQuery');

insert into usr_role_server_permission (rol_id, srp_id) values (3, (select srp_id from usr_server_permission where srp_name = 'com.campusdual.cd2024bfs5g1.api.core.service.IEventService/eventQuery'));
