create table booking_event (
	bke_event_id serial primary key,
	bke_id_event integer,
	bke_usr_id integer,
	bke_event_state boolean DEFAULT true,
	constraint bke_usr_id_fk foreign key (bke_usr_id) references usr_user(usr_id),
	constraint bke_event_id_fk foreign key (bke_id_event) references event(id_event)
);
