import axios from 'axios';
import React, { useState } from 'react'
import { Project } from "./type"

interface CreateProjectViewProps {
    onCreateProject: (project: Project) => void;
}

export const CreateProjectView = (props: CreateProjectViewProps) => {
    const [projectName, setProjectName] = useState("");

    const createProject = () => {
        axios.post<Project>("projects", { projectName }).then(response => {
            const project = response.data;
            props.onCreateProject(project);
            setProjectName("");
        })
    }

    return (
        <div>
            <h2>Create new project</h2>
            <input type="text" placeholder="Project name" onChange={e => setProjectName(e.target.value)} value={projectName} />
            <button onClick={createProject}>Create</button>
        </div>
    )
}
