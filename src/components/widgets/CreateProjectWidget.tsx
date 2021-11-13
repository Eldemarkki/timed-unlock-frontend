import axios from 'axios';
import React, { useState } from 'react'
import { WidgetContainer } from '../styled/containers';
import { WidgetHeader } from '../styled/text';
import { Project } from "../../type"
import styled from 'styled-components';
import { Button } from '../Button';
import { Input } from '../Input';

interface CreateProjectViewProps {
    onCreateProject: (project: Project) => void;
}

const ProjectNameInput = styled(Input)`
    margin-bottom: 15px;
`

const CreateButtonContainer = styled.div`
    display: flex;
    justify-content: flex-end;
`

const CreateButton = styled(Button)`
    min-width: 80px;
`

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
        <WidgetContainer>
            <WidgetHeader>Create new project</WidgetHeader>
            <ProjectNameInput type="text" placeholder="Project name" onChange={e => setProjectName(e.target.value)} value={projectName} />
            <CreateButtonContainer>
                <CreateButton colorUsage="primary" onClick={createProject}>Create</CreateButton>
            </CreateButtonContainer>
        </WidgetContainer>
    )
}
