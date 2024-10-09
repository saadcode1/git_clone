import React, { useState,useContext } from 'react';
import axios from 'axios';
import './Create.css';
import { useNavigate } from 'react-router-dom';


function Create() {
  const navigate=useNavigate();
     const userId=localStorage.getItem('userId');
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        visibility: true,
        content: '',
        owner:userId,
        file: null
      });

      const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
      };
      
      const handleFileChange = (e) => {
        const file = e.target.files[0];
        setFormData({ ...formData, file });
      };    

      const handleSubmit = async (e) => {
        e.preventDefault();
        const formDataToSend = new FormData();
        
        // Append form fields to FormData
        Object.keys(formData).forEach(key => {
          if (key === 'file') {
            if (formData.file) {
              formDataToSend.append('file', formData.file);
            }
          } else if (key === 'visibility') {
            formDataToSend.append(key, formData[key] === 'true');
          } else {
            formDataToSend.append(key, formData[key]);
          }
        });
      
        try {
          const response = await axios.post('http://localhost:8000/repo/create', formDataToSend);
          console.log('Repository created:', response.data);
          navigate('/');
          // Consider adding some user feedback here, like a success message
        } catch (error) {
          console.error('Error creating repository:', error);
          // Consider adding some user feedback here, like an error message
        }
      };
      
      


  return (
    <>
    <div className="create-repository-form">
      <h2>Create New Repository</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Repository Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="visibility">Visibility:</label>
          <select
            id="visibility"
            name="visibility"
            value={formData.visibility}
            onChange={handleChange}
          >
            <option value="true">Public</option>
            <option value="fales">Private</option>
          </select>
        </div>
        <div>
          <label htmlFor="content">Initial Content:</label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="file">Upload File:</label>
          <input
            type="file"
            id="file"
            name="file"
            onChange={handleFileChange}
            multiple
           
          />
        </div>
        <button type="submit">Create Repository</button>
      </form>
    </div>
    </>
  )
}

export default Create;