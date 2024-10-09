import React, { useState, useEffect } from "react"
import { BrowserRouter as Router, Link, useNavigate } from "react-router-dom"
import { Search, Star, GitFork, Calendar } from "lucide-react"
import "./Dashboard.css"
export default function Dashboard() {
  const [repositories, setRepositories] = useState([])
  const [searchQuery, setSearchQuery] = useState("")
  const [suggestedRepositories, setSuggestedRepositories] = useState([])
  const [searchResults, setSearchResults] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    const userId = localStorage.getItem("userId")

    const fetchRepositories = async () => {
      try {
        const response = await fetch(`http://localhost:8000/repo/user/${userId}`)
        const data = await response.json()
        console.log(data);
        setRepositories(data.repositories)
      } catch (err) {
        console.error("Error while fetching repositories: ", err)
      }
    }

    const fetchSuggestedRepositories = async () => {
      try {
        const response = await fetch(`http://localhost:8000/repo/all`)
        const data = await response.json()
        setSuggestedRepositories(data)
      } catch (err) {
        console.error("Error while fetching repositories: ", err)
      }
    }

    fetchRepositories()
    fetchSuggestedRepositories()
  }, [])

  useEffect(() => {
    if (searchQuery === "") {
      setSearchResults(suggestedRepositories)
    } else {
      const filteredRepo = suggestedRepositories.filter((repo) =>
        repo.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
      setSearchResults(filteredRepo)
    }
  }, [searchQuery, suggestedRepositories])

  const handleRepoClick = (repoId) => {
    navigate(`/repo/${repoId}`)
  }

  return (
    <div className="dashboard-container">
      <nav className="navbar">
        <Link to="/" className="logo">
          GitClone
        </Link>
        <div className="search-form">
          <input
            type="text"
            placeholder="Search repositories..."
            className="search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search className="search-icon" size={20} />
        </div>
        <div style={{display:"flex",gap:"10px",}}>
        <button className="new-button">
              <Link style={{textDecoration:"none",color:"white"}} to="/create">New</Link>
            </button>
            <button className="new-button">
              <Link style={{textDecoration:"none",color:"white"}} to="/profile">Profile</Link>
            </button>
            </div>
      </nav>

      <div className="main-content">
        <div className="repositories-section">
          <h2 className="section-title">Suggested Repositories</h2>
          <div className="card">
            { searchResults ? searchResults.map((repo) => (
              <div key={repo._id} onClick={() => handleRepoClick(repo._id)} className="repo-item">
                <h3 className="repo-name">{repo.name}</h3>
                <p className="repo-description">{repo.description}</p>
                <div className="repo-meta">
                  <div>
                    <Star size={16} />
                    {repo.stars || 0}
                  </div>
                  <div>
                    <GitFork size={16} />
                    {repo.forks || 0}
                  </div>
                  <div>Updated {new Date(repo.updatedAt).toLocaleDateString()}</div>
                </div>
              </div>
            )):null}
          </div>
        </div>
        <div className="sidebar">
          <h2 className="section-title">Your Repositories</h2>
          <div className="card">
            {repositories ? repositories.map((repo) => (
              <div key={repo._id} onClick={() => handleRepoClick(repo._id)} className="repo-item">
                <h3 className="repo-name">{repo.name}</h3>
                <p className="repo-description">{repo.description}</p>
              </div>
            )):null}
          </div>

          <h2 className="section-title">Upcoming Events</h2>
          <div className="card">
            <ul className="event-list">
              <li className="event-item">
                <Calendar className="event-icon" size={20} />
                <div className="event-details">
                  <p className="event-title">Tech Conference</p>
                  <p className="event-date">Dec 15</p>
                </div>
              </li>
              <li className="event-item">
                <Calendar className="event-icon" size={20} />
                <div className="event-details">
                  <p className="event-title">Developer Meetup</p>
                  <p className="event-date">Dec 25</p>
                </div>
              </li>
              <li className="event-item">
                <Calendar className="event-icon" size={20} />
                <div className="event-details">
                  <p className="event-title">React Summit</p>
                  <p className="event-date">Jan 5</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
        <div>
        </div>
      </div>
    </div>
  )
}

