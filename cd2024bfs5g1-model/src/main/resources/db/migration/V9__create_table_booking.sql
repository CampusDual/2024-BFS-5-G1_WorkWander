create table booking (
	bk_id serial primary key,
	bk_usr_id integer,
	bk_cw_id integer,
	bk_date date,
	bk_state boolean,
	constraint bk_usr_id_fk foreign key (bk_usr_id) references usr_user(usr_id),
	constraint bk_cw_id_fk foreign key (bk_cw_id) references coworking(cw_id)
);