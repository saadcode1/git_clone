import React,{useState,useEffect} from 'react'
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './update.css';
function Update() {
    const {id}=useParams();
    const [repo,setRepo]=useState(null);
    const userId=localStorage.getItem('userId');

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        visibility: true,
        content: '',
        owner:userId,
        file: null
      });


    

    useEffect(()=>{
        const fetchRepo=async ()=>{
            const res=await axios.get(`http://localhost:8000/repo/${id}`);
            console.log(res.data.name);
           setFormData(res.data)
            console.log(formData);
        }
        fetchRepo();
    },[id]);


 
      const handleChange = (e) => {
        e.preventDefault();
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
      };

      const handleFileChange = (e) => {
        e.preventDefault();
        const file = e.target.files[0]; // Changed from e.target.file[0] to e.target.files[0]
        setFormData({ ...formData, file: file });
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
            formDataToSend.append(key, formData[key] === true || formData[key] === 'true'); // Changed to handle both boolean and string values
          } else {
            formDataToSend.append(key, formData[key]);
          }
        });
      
        try {
          const res = await axios.post(`http://localhost:8000/repo/update/${id}`, formDataToSend, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
          console.log(res.data);
          // Add success handling here (e.g., show a success message or redirect)
        } catch (error) {
          console.error('Error updating repository:', error);
          // Add error handling here (e.g., show an error message to the user)
        }
      };


  return (
    <>
     <h1 style={{textAlign:'center',padding:'20px'}}>Update</h1>
    {formData && (
      <div className="create-form-container">
        <form onSubmit={handleSubmit} className="create-form">
          <div className="form-group">
            <label htmlFor="name">Repository Name:</label>
            <input
              type="text"
              id="name"
              name='name'
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="description">Description:</label>
            <textarea
              id="description"
              name='description'
              value={formData.description}
              onChange={handleChange}
              required
            ></textarea>
          </div>
          <div className="form-group">
            <label htmlFor="content">Content:</label>
            <textarea
              id="content"
              name='content'
              value={formData.content}
              onChange={handleChange}
              required
            ></textarea>
          </div>
          <div className="form-group">
            <label htmlFor="visibility">Visibility:</label>
            <select
              id="visibility"
              name='visibility'
              value={formData.visibility}
              onChange={handleChange}
              required
            >
              <option value="true">Public</option>
              <option value="false">Private</option>
            </select>
          </div>
          <div className="form-group">  
            <label htmlFor="file">File</label>
              {/* <p>Current file: {formData.files[0].filename}</p> */}
            <input
              type="file"
              id="file"
              name='file'
              onChange={handleFileChange}
              multiple
            />
           
          </div>
          <button type="submit" className="submit-btn">Update Repository</button>
        </form>
      </div>
    )}
   
    </>
  )
}

export default Update;