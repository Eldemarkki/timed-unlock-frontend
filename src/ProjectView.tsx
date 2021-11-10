import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import { API_URL } from "./config";
import { Item, NewItem, Project } from "./type";
import Datetime from 'react-datetime';
import "react-datetime/css/react-datetime.css";
import moment from "moment";

export const ProjectView = () => {
    const { projectId } = useParams();
    const [project, setProject] = useState<Project | undefined>(undefined);

    useEffect(() => {
        if (projectId) {
            axios.get<Project>(`/projects/${projectId}`).then(response => {
                setProject(response.data);
                console.log(response.data);
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
        <Link to="/">Back to homepage</Link>
        <h2>{project.name}</h2>
        <p>API URL: <a href={apiUrl}>{apiUrl}</a></p>
        <CreateItemView projectId={projectId} onCreateItem={onCreateItem} />
        <ItemList items={project.items} projectId={projectId!} onEditItem={onEditItem} />
    </div>;
};

interface CreateItemViewProps {
    projectId: string;
    onCreateItem: (item: Item) => void;
}

export const CreateItemView = (props: CreateItemViewProps) => {
    const [data, setData] = useState<string>("");
    const [unlockDate, setUnlockDate] = useState(new Date())

    const createItem = () => {
        const item: NewItem = { data, unlockDate };
        axios.post<Item>(`projects/${props.projectId}/items`, item).then(response => {
            props.onCreateItem(response.data);
        })
    }

    return <div>
        <input type="text" placeholder="Item data" value={data} onChange={e => setData(e.target.value)} />
        <Datetime
            initialValue={moment(unlockDate)}
            onChange={d => setUnlockDate(moment(d).toDate())} />
        <button onClick={createItem}>Create</button>
    </div>
}

interface ItemListProps {
    items: Item[],
    projectId: string;
    onEditItem: (item: Item) => void;
}

export const ItemList = (props: ItemListProps) => {
    const [editingItem, setEditingItem] = useState<Item | undefined>(undefined)
    const sortedItems = props.items.sort((a, b) => new Date(b.unlockDate).getTime() - new Date(a.unlockDate).getTime());

    const saveEditingItem = () => {
        axios.put<Item>(`projects/${props.projectId}/items/${editingItem?._id}`, editingItem).then(response => {
            setEditingItem(undefined)
            props.onEditItem(response.data);
        })
    }

    return <ul>
        {sortedItems.map(i => {
            const unlocksAt = new Date(i.unlockDate);
            return <li key={i._id}>
                {editingItem?._id === i._id ? <div>
                    <h3>Editing {i.data}</h3>
                    <input type="text" placeholder="Item data" value={editingItem.data} onChange={e => setEditingItem({ ...editingItem, data: e.currentTarget.value })} />
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
}