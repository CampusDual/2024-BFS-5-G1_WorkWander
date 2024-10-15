CREATE TABLE coworking (
    cw_id SERIAL PRIMARY KEY,
    cw_name VARCHAR(100),
    cw_description VARCHAR(250),
    cw_address VARCHAR(255),
    cw_location VARCHAR(100),
    cw_capacity INT,
    cw_daily_price DECIMAL(10, 2),
    cw_company_id INT,
    cw_start_date DATE,
    cw_end_date DATE
);