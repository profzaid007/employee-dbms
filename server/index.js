const express = require('express');
const cors = require('cors');
const pool = require("./db");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// POST
app.post('/employees', async (req, res) => {
    try {
        const { name, age, contact, dob, gender, department, designation, salary } = req.body;
        const newEmployee = await pool.query(
            'INSERT INTO employees (name, age, contact, dob, gender, department, designation, salary) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
            [name, age, contact, dob, gender, department, designation, salary]
        );

        res.json(newEmployee.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// GET

app.get('/employees', async (req, res) => {
    try {
      const page = req.query.page || 1;
      const pageSize = req.query.pageSize || 5;
      const offset = (page - 1) * pageSize;
  
      const result = await pool.query('SELECT * FROM employees LIMIT $1 OFFSET $2', [pageSize, offset]);
  
      res.json(result.rows);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  });

// app.get('/employees', async (req, res) => {
//     try {
//         const allEmployees = await pool.query('SELECT * FROM employees');
//         res.json(allEmployees.rows);
//     } catch (err) {
//         console.error(err.message);
//         res.status(500).send('Server Error');
//     }
// });

// GET BY ID
app.get('/employees/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const result = await pool.query('SELECT * FROM employees WHERE employee_id = $1', [id]);
        const employee = result.rows[0];

        if (!employee) {
            res.status(404).send('Employee not found');
        } else {
            res.send(employee);
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Error retrieving employee');
    }
});

// PUT
app.put('/employees/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, age, contact, dob, gender, department, designation, salary } = req.body;
        const updateEmployee = await pool.query(
            'UPDATE employees SET name = $1, age = $2, contact = $3, dob = $4, gender = $5, department = $6, designation = $7, salary = $8 WHERE employee_id = $9 RETURNING *',
            [name, age, contact, dob, gender, department, designation, salary, id]
        );

        if (updateEmployee.rows.length === 0) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        res.json(updateEmployee.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// DELETE
app.delete('/employees/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deleteEmployee = await pool.query('DELETE FROM employees WHERE employee_id = $1 RETURNING *', [id]);

        if (deleteEmployee.rows.length === 0) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        res.json({ message: 'Employee deleted successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// ROOT
app.get('/', (req, res) => {
    res.send('The Fugging Server Runs!');
});

app.listen(PORT, () => {
    console.log("Server Served @ port:5000");
});
