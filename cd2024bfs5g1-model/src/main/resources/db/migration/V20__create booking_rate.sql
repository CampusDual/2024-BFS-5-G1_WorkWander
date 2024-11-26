create table booking_rate (
	id_bkr int primary key ,
	bkr_description varchar(500),
	bkr_ratio int CHECK (bkr_ratio BETWEEN 1 AND 5),
	constraint bk_id_fk foreign key (id_bkr) references booking(bk_id));