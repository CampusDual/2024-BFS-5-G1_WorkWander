CREATE TABLE event (
    id_event serial NOT NULL,
	name varchar(100) NOT NULL,
	description text NOT NULL,
	date_event timestamp NOT NULL,
	address text NOT NULL,
	locality text NOT NULL,
	bookings int4 NOT NULL,
	CONSTRAINT pk_id_event PRIMARY KEY (id_event)
);