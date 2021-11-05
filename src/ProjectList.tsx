import axios from "axios"
import { useEffect, useState } from "react"
import { API_URL } from "./config"

export interface Project {
    _id: string;
    name: string;
    items: string[];
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

interface ProjectViewProps {
    project: Project;
}

export const ProjectView = ({ project }: ProjectViewProps) => {
    const [items, setItems] = useState<Item[]>([])

    useEffect(() => {
        axios.get(`/projects/${project._id}/items`).then(response => {
            setItems(response.data);
        })
    }, [project._id])

    return <div>
        <h2>{project.name}</h2>
        <p>API URL: {API_URL}projects/{project._id}/items</p>
        <ul>
            {items.map(i => {
                const unlocksAt = new Date(i.unlockDate);
                return <li>
                    <h3>{i.data}</h3>
                    <p>Unlocks at {unlocksAt.toLocaleString()}</p>
                </li>
            })}
        </ul>
    </div>
}

export const ProjectList = () => {
    const [projects, setProjects] = useState<Project[]>([])
    const [selectedProject, setSelectedProject] = useState<Project | undefined>(undefined)

    useEffect(() => {
        axios.get("/projects").then(response => {
            setProjects(response.data);
        })
    }, [])

    if (selectedProject) {
        return <div>
            {selectedProject && <button onClick={e => { e.preventDefault(); setSelectedProject(undefined) }}>Back to all projects</button>}
            <ProjectView project={selectedProject} />
        </div>
    }
    return <div>
        <ul>
            {projects.map(p => {
                return <li key={p._id}>
                    {p.name}
                    <button onClick={e => { e.preventDefault(); setSelectedProject(p) }}>View</button>
                </li>
            })}
        </ul>
    </div>
}