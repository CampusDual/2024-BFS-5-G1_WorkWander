create table service(srv_id serial primary key not null,
srv_name varchar(50) not null);

create table cw_service(
	cser_id serial primary key not null,
	cw_id int not null,
	srv_id int not null,
		constraint cwsw_cw_fk foreign key (cw_id) references coworking(cw_id),
		constraint cwsw_srv_fk foreign key (srv_id) references service(srv_id)
	);
insert into service(srv_name) values('Pantalla adicional');
insert into service(srv_name) values ('Máquina expendedora');
insert into service(srv_name) values('Cafetería');
insert into service(srv_name) values('Máquina de agua');
insert into service(srv_name) values('Silla ergonómica');
insert into service(srv_name) values('Parking');