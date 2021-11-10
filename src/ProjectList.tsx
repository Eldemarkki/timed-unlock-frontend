import axios from "axios"
import { useEffect, useState } from "react"
// import { useLocation } from "react-router"
import { Link, useNavigate } from "react-router-dom"
import { API_URL } from "./config"
import { CreateProjectView } from "./CreateProjectView"
import { Project } from "./type"

export const ProjectList = () => {
    const [projects, setProjects] = useState<Project[]>([])
    const navigate = useNavigate();
    // let location = useLocation();

    useEffect(() => {
        axios.get("projects").then(response => {
            if (response) {
                setProjects(response.data);
            }
        }).catch(error => {
            if (error.response.status === 401) navigate("/login")
        })
    }, [navigate])

    return <div>
        <CreateProjectView onCreateProject={project => setProjects([...projects, project])} />
        <ul>
            {projects.map(p => {
                return <li key={p._id}>
                    {p.name}
                    <Link to={`/projects/${p._id}`}>View</Link>
                    <a href={`${API_URL}projects/${p._id}/items`}>Unlocked Items API</a>
                    {/* <Link to={`/projects/${p._id}/edit`} state={{ backgroundLocation: location }}>Edit</Link> */}
                </li>
            })}
        </ul>
    </div>
}