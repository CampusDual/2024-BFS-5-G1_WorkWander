alter table coworking drop column cw_location;

alter table coworking add cw_location integer;

alter table coworking add constraint cw_location_fk foreign key (cw_location) references city(id_city);