alter table booking
drop column bk_date;

create table booking_date (
bk_id integer not null,
date date not null,
primary KEY(bk_id, date),
constraint bk_id_fk foreign key (bk_id) references booking(bk_id));