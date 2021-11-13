import React from 'react'
import styled from 'styled-components'
import { API_URL } from '../../config'
import { Project } from '../../type'
import { WidgetContainer } from '../styled/containers'
import { ColoredAnchor, ColoredLink, WidgetHeader } from '../styled/text'

const ProjectListContainer = styled.ul`
    background-color: ${props => props.theme.colors.foreground}; 
    list-style-type: none;
    padding: 0px;
    margin: 0px;
`

const ProjectContainer = styled.li`
    min-height: 30px;
`

const ProjectName = styled.span`
    display: inline-block;
    margin: 0px 20px 0px 0px;
    font-size: 1.2rem;
    font-weight: bold;
`

const ViewProjectLink = styled(ColoredLink)`
    margin-right: 20px;
`

export interface ProjectListWidgetProps {
    projects: Project[];
}

export const ProjectListWidget = (props: ProjectListWidgetProps) => {
    return (
        <WidgetContainer>
            <WidgetHeader>Projects</WidgetHeader>
            <ProjectListContainer>
                {props.projects.map(project => {
                    return <ProjectContainer key={project._id}>
                        <ProjectName>{project.name}</ProjectName>
                        <ViewProjectLink to={`/projects/${project._id}`}>View project</ViewProjectLink>
                        <ColoredAnchor href={`${API_URL}projects/${project._id}/items`}>Unlocked Items API</ColoredAnchor>
                    </ProjectContainer>
                })}
            </ProjectListContainer>
        </WidgetContainer>
    )
}
