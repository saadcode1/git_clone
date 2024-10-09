'use client'
import { useEffect, useState } from "react";
import "../user/profile.css";
import axios from "axios";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from "react-router-dom";

export default function GitHubProfile() {
  const [user, setUser] = useState({});
  const [deleted,setDeleted]=useState(false);
  const navigate=useNavigate();
  useEffect(() => {
    async function getUserProfile() {
      try {
        const userId = localStorage.getItem("userId");
        const res = await axios.get(`http://localhost:8000/getUserProfile/${userId}`);
        console.log(res.data.user);
        setUser(res.data.user); // Changed this line
      } catch (err) {
        console.error("Error fetching user profile:", err);
      }
    }
    getUserProfile();

   
  }, [deleted]); // Added dependency array

  const handleDelete = async (repoId) => {
    try {
     const res= await axios.get(`http://localhost:8000/repo/delete/${repoId}`);
      toast.success("Repository deleted successfully!");
      setDeleted(true);
      // setTimeout(() => {
      //   window.location.reload();
      // }, 1500);
    } catch (err) {
      console.error("Error deleting repository:", err);
      if (err.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        toast.error(`Error: ${err.response.data.message || 'An error occurred while deleting the repository.'}`);
      } else if (err.request) {
        // The request was made but no response was received
        toast.error("Unable to connect to the server. Please check your internet connection and try again.");
      } else {
        // Something happened in setting up the request that triggered an Error
        toast.error("An error occurred while deleting the repository. Please try again later.");
      }
    }
  };


  return (
    <div className="github-profile">
      <ToastContainer />
      <div className="profile-header">
        <img src="https://cdn.worldvectorlogo.com/logos/github-icon-2.svg" alt="User avatar" className="avatar" />
        <div className="user-info">
          <h1>{user.username ? user.username : 'No username'}</h1>
          <h2>{user.email ? user.email : '-----'}</h2>
          <p>{user.bio ? user.bio : '------'}</p>
          <button className="edit-profile">Edit profile</button>
        </div>
      </div>

      <div className="profile-stats">
        <div className="stat">
          <span className="stat-count">{user.followers || 0}</span> followers
        </div>
        <div className="stat">
          <span className="stat-count">{user.following || 0}</span> following
        </div>
      </div>

      <div className="profile-content">
        <div className="repos-section">
          <h3>Popular repositories</h3>
          {user.repositories && user.repositories.map((repo) => (
            <>
            <Link to={`/repo/${repo._id}`} key={repo._id}>
            <div key={repo._id} className="repo-item">
              <h4 className="repo-name">{repo.name}</h4>
              <p className="repo-description">{repo.description || 'No description'}</p>
              <div className="repo-meta">
                <span className="repo-visibility">{repo.visibility}</span>
                <span className="repo-language">{repo.language || 'Unknown'}</span>
                <span className="repo-stars">{repo.stars || 0} stars</span>
              </div>
            </div>

            </Link>
            <div key={repo._id} className="repo-actions">
                <button onClick={() => navigate(`/update/${repo._id}`)} className="update-repo-btn">Update</button>
                <button onClick={() => handleDelete(repo._id)} className="delete-repo-btn">Delete</button>
              </div>
            </>
          ))}
        </div>
      </div>
    </div>
  );
}