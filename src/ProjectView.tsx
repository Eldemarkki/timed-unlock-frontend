import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router";
import { Link } from "react-router-dom";
import { API_URL } from "./config";
import { Item, Project } from "./ProjectList";
import Datetime from 'react-datetime';
import "react-datetime/css/react-datetime.css";
import moment from "moment";

export const ProjectView = () => {
    const { projectId } = useParams();
    const [project, setProject] = useState<Project | undefined>(undefined);
    const [editingItem, setEditingItem] = useState<Item | undefined>(undefined);

    useEffect(() => {
        if (projectId) {
            axios.get(`/projects/${projectId}`).then(response => {
                setProject(response.data);
                console.log(response.data);
            });
        }
    }, [projectId]);


    if (!project)
        return <div>Loading...</div>;

    const apiUrl = `${API_URL}projects/${projectId}/items`;
    const saveEditingItem = () => {
        const url = `${apiUrl}/${editingItem?._id}`
        axios.put(url, editingItem).then(response => {
            setEditingItem(undefined)
            setProject({
                ...project,
                items: [
                    ...project.items.filter(i => i._id !== editingItem?._id),
                    response.data
                ]
            })
        })
    }

    const sortedItems = project.items.sort((a, b) => new Date(b.unlockDate).getTime() - new Date(a.unlockDate).getTime());

    return <div>
        <Link to="/">Back to homepage</Link>
        <h2>{project.name}</h2>
        <p>API URL: <a href={apiUrl}>{apiUrl}</a></p>
        <ul>
            {sortedItems.map(i => {
                const unlocksAt = new Date(i.unlockDate);
                return <li key={i._id}>
                    {editingItem?._id === i._id ? <div>
                        <h3>Editing {i.data}</h3>
                        <input type="text" value={editingItem.data} onChange={e => setEditingItem({ ...editingItem, data: e.currentTarget.value })} />
                        <Datetime
                            initialValue={moment(editingItem.unlockDate)}
                            onChange={d => setEditingItem({ ...editingItem, unlockDate: moment(d).toDate() })} />
                        <button onClick={() => saveEditingItem()}>Save</button>
                        <button onClick={() => setEditingItem(undefined)}>Cancel</button>
                    </div> : <div>
                        <h3>{i.data}</h3>
                        <p>Unlocks at {unlocksAt.toLocaleString()}</p>
                        <button onClick={() => setEditingItem(i)}>Edit</button>
                    </div>}
                </li>;
            })}
        </ul>
    </div>;
};
