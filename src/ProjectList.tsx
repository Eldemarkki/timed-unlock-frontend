import axios from "axios"
import { useEffect, useState } from "react"
// import { useLocation } from "react-router"
import { Link } from "react-router-dom"

export interface Project {
    _id: string;
    name: string;
    items: Item[];
    admin: string;
    description?: string;
}

export interface Item {
    _id: string;
    data: string;
    unlockDate: Date;
    project: string;
    admin: string;
}

export const ProjectList = () => {
    const [projects, setProjects] = useState<Project[]>([])
    // let location = useLocation();

    useEffect(() => {
        axios.get("/projects").then(response => {
            setProjects(response.data);
        })
    }, [])

    return <div>
        <ul>
            {projects.map(p => {
                return <li key={p._id}>
                    {p.name}
                    <Link to={`/projects/${p._id}`}>View</Link>
                    {/* <Link to={`/projects/${p._id}/edit`} state={{ backgroundLocation: location }}>Edit</Link> */}
                </li>
            })}
        </ul>
    </div>
}