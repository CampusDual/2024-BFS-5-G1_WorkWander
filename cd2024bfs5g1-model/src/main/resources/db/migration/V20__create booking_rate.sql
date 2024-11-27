create table booking_rate (
	id_bkr int primary key ,
	bkr_description varchar(500),
	bkr_ratio int CHECK (bkr_ratio BETWEEN 1 AND 5),
	cw_id int,
	constraint bk_id_fk foreign key (id_bkr) references booking(bk_id)),
	constraint cw_id_fk foreign key (cw_id) references coworking(cw_id));