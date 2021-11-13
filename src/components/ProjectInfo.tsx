import React from 'react'
import styled from 'styled-components';
import { API_URL } from '../config';
import { Project } from '../type'
import { WidgetContainer } from './styled/containers';
import { ColoredAnchor } from './styled/text';

export interface ProjectInfoProps {
    project: Project;
}

const Paragraph = styled.p`
    margin: 5px 0px;
`

const ProjectName = styled.h1`
    margin: 15px 0px;
`

export const ProjectInfo = (props: ProjectInfoProps) => {
    const project = props.project;

    const apiUrl = `${API_URL}projects/${project._id}/items`;
    const itemCount = project.items.length;

    const now = new Date();
    const publicItemCount = project.items.reduce((prev, item) => {
        const isPublic = item.unlockDate <= now;
        return prev + (isPublic ? 1 : 0);
    }, 0);

    const privateItemCount = itemCount - publicItemCount;

    const getItemWordForCount = (count: Number) => {
        return count === 1 ? "item" : "items";
    }

    return (
        <WidgetContainer>
            <ProjectName>{project.name}</ProjectName>
            <Paragraph>API URL: <ColoredAnchor href={apiUrl}>{apiUrl}</ColoredAnchor></Paragraph>
            <Paragraph>{itemCount} {getItemWordForCount(itemCount)} ({publicItemCount} public / {privateItemCount} private)</Paragraph>
        </WidgetContainer>
    )
}
