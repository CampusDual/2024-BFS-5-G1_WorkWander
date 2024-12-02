alter table event drop column locality;

alter table event add locality integer;

alter table event add constraint locality_fk foreign key (locality) references city(id_city);