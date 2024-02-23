'use client'
import React, { useState, useEffect } from 'react';
// import 'boxicons';
import '@picocss/pico'
if (typeof window !== 'undefined') {
  require('boxicons');
}


const Home = () => {
  const [employees, setEmployees] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    contact: '',
    dob: '',
    gender: '',
    department: '',
    designation: '',
    salary: ''
  });
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  useEffect(() => {
    fetchData();
  }, [currentPage]); // Fetch data whenever currentPage changes

  const fetchData = async () => {
    try {
      const res = await fetch(`http://localhost:5000/employees?page=${currentPage}&pageSize=${pageSize}`);
      const data = await res.json();
      setEmployees(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };


  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      let res;
      if (selectedEmployeeId) {
        res = await fetch(`http://localhost:5000/employees/${selectedEmployeeId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
      } else {
        res = await fetch('http://localhost:5000/employees', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
      }
      if (res.ok) {
        window.alert(selectedEmployeeId ? 'Employee updated successfully' : 'Employee added successfully');
        setFormData({
          name: '',
          age: '',
          contact: '',
          dob: '',
          gender: '',
          department: '',
          designation: '',
          salary: ''
        });
        setSelectedEmployeeId(null);
        fetchData();
      } else {
        window.alert('Submission not successful, please try again');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleUpdate = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/employees/${id}`);
      const data = await res.json();
      setFormData(data);
      setSelectedEmployeeId(id);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/employees/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        window.alert('Employee deleted successfully');
        fetchData();
      } else {
        window.alert('Error deleting employee');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
  };

  return (
    <main>
      <div className='container'>
        <h2 className='container-fluid'>Employee Database Management System</h2>
        <div>
          <form onSubmit={handleSubmit}>
            <div>
              <label htmlFor="name">Name</label>
              <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} required />
            </div>
            <div>
              <label htmlFor="age">Age</label>
              <input type="number" name="age" id="age" value={formData.age} onChange={handleChange} required />
            </div>
            <div>
              <label htmlFor="contact">Contact</label>
              <input type="number" name="contact" id="contact" value={formData.contact} onChange={handleChange} required />
            </div>
            <div>
              <label htmlFor="dob">DOB</label>
              <input type="date" name="dob" id="dob" value={formatDate(formData.dob)} onChange={handleChange} required />
            </div>
            <div>
              <label>Gender</label>
              <div>
                <input type="radio" name="gender" value="male" checked={formData.gender === 'male'} onChange={handleChange} required />
                <label htmlFor="male">Male</label>
              </div>
              <div>
                <input type="radio" name="gender" value="female" checked={formData.gender === 'female'} onChange={handleChange} required />
                <label htmlFor="female">Female</label>
              </div>
              <div>
                <input type="radio" name="gender" value="other" checked={formData.gender === 'other'} onChange={handleChange} required />
                <label htmlFor="other">Other</label>
              </div>
            </div>
            <div>
              <label htmlFor="department">Department</label>
              <select name="department" id="department" value={formData.department} onChange={handleChange} required>
                <option value="">Select Department</option>
                <option value="CSE">CSE</option>
                <option value="MECH">MECH</option>
                <option value="CIVIL">CIVIL</option>
                <option value="EEE">EEE</option>
                <option value="ECE">ECE</option>
                <option value="AIDS">AIDS</option>
                <option value="MCT">MCT</option>
                <option value="CSBS">CSBS</option>
              </select>
            </div>
            <div>
              <label htmlFor="designation">Designation</label>
              <input type="text" name="designation" id="designation" value={formData.designation} onChange={handleChange} required />
            </div>
            <div>
              <label htmlFor="salary">Salary</label>
              <input type="number" name="salary" id="salary" value={formData.salary} onChange={handleChange} required step="0.01" />
            </div>
            <button type="submit">Submit</button>
          </form>
        </div>
        <figure className='overflow-auto'>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Age</th>
                <th>Contact</th>
                <th>DOB</th>
                <th>Gender</th>
                <th>Department</th>
                {/* <th>Designation</th> */}
                <th>Salary</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((employee) => (
                <tr key={employee.employee_id}>
                  <td>{employee.employee_id}</td>
                  <td>{employee.name}</td>
                  <td>{employee.age}</td>
                  <td>{employee.contact}</td>
                  <td>{formatDate(employee.dob)}</td>
                  <td>{employee.gender}</td>
                  <td>{employee.department}</td>
                  {/* <td>{employee.designation}</td> */}
                  <td>{employee.salary}</td>
                  <td>
                    <button onClick={() => handleUpdate(employee.employee_id)}>
                      <box-icon name='edit' size="xs" type='solid' color='#ffffff'></box-icon>
                    </button>
                    <button onClick={() => handleDelete(employee.employee_id)}>
                      <box-icon name='x-circle' size="xs" color='#ffffff'></box-icon>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </figure>
        <div className='container'>
        <button onClick={handlePrevPage} disabled={currentPage === 1}>Previous Page</button>
        <button onClick={handleNextPage}>Next Page</button>
      </div>
      </div>
    </main>
  );
};

export default Home;
