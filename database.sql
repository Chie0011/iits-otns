CREATE TABLE ot_request (
    req_id SERIAL PRIMARY KEY,
    req_name VARCHAR(255) NOT NULL,
    req_email VARCHAR(255) NOT NULL,
    req_shift VARCHAR(255) NOT NULL,
    req_location VARCHAR(255) NOT NULL,
    req_date DATE NOT NULL,
    req_timeto VARCHAR(20) NOT NULL,
    req_timefrom VARCHAR(20) NOT NULL,
    req_duration VARCHAR(20) NOT NULL,
    req_by VARCHAR(255) NOT NULL,
    req_department VARCHAR(255) NOT NULL,
    req_reason TEXT NOT NULL,
    req_status VARCHAR(50) DEFAULT 'Pending',
    req_remarks VARCHAR(255),
    req_timestamp TIMESTAMP
);



CREATE TABLE admin (
    supervisor_id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    supervisor_email VARCHAR(255) UNIQUE NOT NULL,
    supervisor_password VARCHAR(255) NOT NULL,
    supervisor_verified BOOLEAN DEFAULT FALSE,
    supervisor_token VARCHAR(255) UNIQUE,
    role_name VARCHAR (255),
    CONSTRAINT chk_supervisor_count CHECK (
        (SELECT COUNT(*) FROM supervisor) <= 2
    )
);



CREATE TABLE supervisor (
    supervisor_id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    supervisor_email VARCHAR(255) UNIQUE NOT NULL,
    supervisor_password VARCHAR(255) NOT NULL,
    supervisor_verified BOOLEAN DEFAULT FALSE,
    supervisor_token VARCHAR(255) UNIQUE,
    role_name VARCHAR (255),
    CONSTRAINT chk_supervisor_count CHECK (
        (SELECT COUNT(*) FROM supervisor) <= 2
    )
);

create table

CREATE TABLE emp (
    emp_id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    emp_name VARCHAR(255) NOT NULL,
    emp_email VARCHAR(255) NOT NULL,
    emp_password VARCHAR(255) NOT NULL,
    emp_shift VARCHAR(255) NOT NULL,
    emp_location VARCHAR (255) NOT NULL,
    role_name VARCHAR(255) DEFAULT '$41321d54CK$$#I/GWvExCVl/JVF0T1Of0BwwdqBWn2JqVdPVjRmQVxctMYhJZ6',
    emp_phone VARCHAR(20),
    emp_verified BOOLEAN DEFAULT FALSE
);




Create table

CREATE TABLE supervisor (
    supervisor_id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    supervisor_email VARCHAR(255) UNIQUE NOT NULL,
    supervisor_password VARCHAR(255) NOT NULL,
    supervisor_verified BOOLEAN DEFAULT FALSE,
    supervisor_token VARCHAR(255) UNIQUE,
    role_name VARCHAR (255)
);


ALTER TABLE supervisor
ALTER COLUMN role_name SET DEFAULT 'default_role_name',



CREATE TABLE admin (
    admin_id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    admin_email VARCHAR(255) UNIQUE NOT NULL,
    admin_password VARCHAR(255) NOT NULL,
    admin_verified BOOLEAN DEFAULT FALSE,
    admin_token VARCHAR(255) UNIQUE,
    role_name VARCHAR (255) DEFAULT
);