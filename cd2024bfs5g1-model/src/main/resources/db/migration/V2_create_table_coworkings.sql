CREATE TABLE coworking (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    description VARCHAR(250),
    address VARCHAR(255),
    location VARCHAR(100),
    capacity INT,
    daily_price DECIMAL(10, 2),
    company_id INT,
    start_date DATE,
    end_date DATE
);