CREATE TABLE coworking (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description VARCHAR(250) NOT NULL,
    address VARCHAR(255) NOT NULL,
    location VARCHAR(100) NOT NULL,
    capacity INT NOT NULL,
    daily_price DECIMAL(10, 2) NOT NULL,
    company_id INT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL
);