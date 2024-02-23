# Employee Database Management System

This project consists of a frontend developed with Next.js and a backend developed with Node.js, Express, and PostgreSQL.

## Frontend

### Features

- *View Employees:* Displays a table of employees fetched from the backend.
- *Add Employee:* Allows users to submit a form to add new employees to the database.

### Getting Started

1. Clone the repository.
2. Navigate to the client directory.
3. Install dependencies: npm install
4. Run the frontend: npm run dev

Make sure the backend server is running.

## Backend

### Features

- *Add New Employee:* API endpoint to insert new employee data into the database.
- *Retrieve All Employees:* API endpoint to fetch a list of all employees from the database.

### Getting Started

1. Clone the repository.
2. Navigate to the `server' directory.
3. Install dependencies: npm install
4. Set up a PostgreSQL database and update the connection details in db.js.
5. Run the backend: npm start

Make sure the PostgreSQL server is running.

## Prerequisites

- [Node.js](https://nodejs.org/)
- [PostgreSQL](https://www.postgresql.org/)

---

## Frontend Code (Next.js - Home.tsx)

tsx
// frontend/pages/index.tsx

'use client'
import React, { useState, useEffect, FormEvent } from 'react';
import '@picocss/pico'

interface Employee {
    employee_id: number;
    name: string;
    email: string;
    designation: string;
    salary: number;
    age: number;
    hire_date: string;
}

const Home: React.FC = () => {
    const [employees, setEmployees] = useState<Employee[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch('http://localhost:5000/employees', { method: 'GET' });
                const data = await res.json();
                setEmployees(data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchData();
    }, []);

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();
        const formdata = new FormData(event.target as HTMLFormElement);
        const requestBody: Partial<Employee> = {};
        formdata.forEach((value, key) => {
            requestBody[key] = value;
        });

        try {
            const res = await fetch('http://localhost:5000/employees', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                  },
                body: JSON.stringify(requestBody),
            });
            if (res.ok) {
                window.alert('Successfully data added');
                window.location.reload();
            } else {
                window.alert("Submission Not Made Please Try again")
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    // ... rest of the Home component code
};

export default Home;


## Backend - index.js (Node.js and Express):

js
// backend/index.js

const express = require('express');
const cors = require('cors');
const app = express();
const pool = require("./db")

app.use(cors());
app.use(express.json());

// Create a new employee
app.post('/employees', async (req, res) => {
    try {
      const { name, email, designation, salary, age, hire_date} = req.body;
      const newEmployee = await pool.query(
        'INSERT INTO employees (name, email, designation, salary, age, hire_date) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
        [name, email, designation, salary, age, hire_date]
      );
  
      res.json(newEmployee.rows[0]);
    } catch (err) {
      console.error(err.message);
    }
});

// Get all employees
app.get('/employees', async (req, res) => {
    try {
      const allEmployees = await pool.query('SELECT * FROM employees');
      res.json(allEmployees.rows);
    } catch (err) {
      console.error(err.message);
    }
});

app.listen(5000,() => {
    console.log("Server Served @ port:5000");
});
