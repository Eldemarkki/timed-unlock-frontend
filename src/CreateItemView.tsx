import axios from "axios";
import { useState } from "react";
import { Item, NewItem } from "./type";
import Datetime from 'react-datetime';
import moment from "moment";
import { Button } from "./components/Button";
import { Input } from "./components/Input";
import { WidgetContainer } from "./components/styled/containers";
import styled from "styled-components";
import { WidgetHeader } from "./components/styled/text";

interface CreateItemViewProps {
    projectId: string;
    onCreateItem: (item: Item) => void;
}

const ItemDataInput = styled(Input)`
    margin-bottom: 15px;
`

const DatetimeEditorContainer = styled.div`
    margin-bottom: 15px;
`

export const CreateItemView = (props: CreateItemViewProps) => {
    const [data, setData] = useState<string>("");
    const [unlockDate, setUnlockDate] = useState(new Date());

    const createItem = () => {
        const item: NewItem = { data, unlockDate };
        axios.post<Item>(`projects/${props.projectId}/items`, item).then(response => {
            const rawItem = response.data;
            // Dates come as strings, so they have to be parsed
            const parsedItem: Item = {
                ...rawItem,
                unlockDate: new Date(rawItem.unlockDate)
            };
            setData("")
            setUnlockDate(new Date())
            props.onCreateItem(parsedItem);
        });
    };

    return <WidgetContainer>
        <WidgetHeader>Create new item</WidgetHeader>
        <ItemDataInput type="text" placeholder="Item data" value={data} onChange={e => setData(e.target.value)} />
        <DatetimeEditorContainer>
            <Datetime
                initialValue={moment(unlockDate)}
                onChange={d => setUnlockDate(moment(d).toDate())} />
        </DatetimeEditorContainer>
        <Button colorUsage="primary" onClick={createItem}>Create</Button>
    </WidgetContainer>;
};
