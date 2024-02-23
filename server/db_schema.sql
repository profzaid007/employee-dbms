-- 1. Employee name: Text box
-- 2. ⁠Employee id: Text box
-- 3. ⁠Department : Drop down to select 
-- 4. ⁠DoB: Text box
-- 5. ⁠Gender: Radio button
-- 6. ⁠Designation : text Box
-- 7. ⁠Salary : Text box 
-- 8. ⁠submit: button 

CREATE TABLE employees (
  employee_id SERIAL PRIMARY KEY,
  name VARCHAR(30) NOT NULL,
  age INTEGER,
  contact BIGINT,
  dob DATE,
  gender VARCHAR(10) CHECK (gender IN ('male', 'female', 'other')),
  department VARCHAR(100) CHECK (department IN ('CSE', 'MECH', 'CIVIL', 'EEE', 'ECE', 'AIDS', 'MCT', 'CSBS')),
  designation VARCHAR(100),
  salary DECIMAL(10, 2)
);


