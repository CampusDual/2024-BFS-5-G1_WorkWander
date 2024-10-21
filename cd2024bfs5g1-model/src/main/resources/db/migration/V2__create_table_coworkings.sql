CREATE TABLE coworking (
    cw_id SERIAL PRIMARY KEY,
    cw_name VARCHAR(100),
    cw_description VARCHAR(250),
    cw_address VARCHAR(255),
    cw_location VARCHAR(100),
    cw_capacity INT,
    cw_daily_price DECIMAL(10, 2),
    cw_usr_id INT,
    cw_start_date DATE default CURRENT_DATE,
    cw_end_date DATE
CONSTRAINT cw_usr_id_fk FOREIGN KEY (cw_usr_id) REFERENCES usr_user(usr_id)
);