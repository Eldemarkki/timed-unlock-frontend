import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { API_URL } from "./config";
import { Item, Project } from "./type";
import "react-datetime/css/react-datetime.css";
import { ItemList } from "./ItemList";
import { CreateItemView } from "./CreateItemView";
import { ColoredAnchor, ColoredLink } from "./components/styled/text";

export const ProjectView = () => {
    const { projectId } = useParams();
    const [project, setProject] = useState<Project | undefined>(undefined);

    useEffect(() => {
        if (projectId) {
            axios.get<Project>(`/projects/${projectId}`).then(response => {
                const rawProject = response.data;

                // Dates come as strings, so they have to be parsed
                const parsedProject = {
                    ...rawProject,
                    items: rawProject.items.map(item => ({ ...item, unlockDate: new Date(item.unlockDate) }))
                }

                setProject(parsedProject);
            })
        }
    }, [projectId]);
    
    if (!project || !projectId)
        return <div>Loading...</div>;

    const onEditItem = (newItem: Item) => {
        setProject({
            ...project,
            items: [
                ...project.items.filter(i => i._id !== newItem._id),
                newItem
            ]
        });
    }

    const onCreateItem = (newItem: Item) => {
        setProject({
            ...project,
            items: [...project.items, newItem]
        });
    }

    const apiUrl = `${API_URL}projects/${projectId}/items`;

    return <div>
        <ColoredLink to="/">Back to homepage</ColoredLink>
        <h1>{project.name}</h1>
        <p>API URL: <ColoredAnchor href={apiUrl}>{apiUrl}</ColoredAnchor></p>
        <CreateItemView projectId={projectId} onCreateItem={onCreateItem} />
        <ItemList items={project.items} projectId={projectId!} onEditItem={onEditItem} />
    </div>;
};