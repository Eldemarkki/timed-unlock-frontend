import axios from "axios";
import { useEffect, useState } from "react";
import { Item } from "./type";
import Datetime from 'react-datetime';
import moment from "moment";
import styled from "styled-components";

export interface ItemListProps {
    items: Item[],
    projectId: string;
    onEditItem: (item: Item) => void;
}

const ItemListContainer = styled.ul`
    list-style-type: none;
    padding: 10px;
`

const SingleItemContainer = styled.li`
    :not(:last-child) {
        margin-bottom: 30px;
    }
`

const EditingButton = styled.button`
    margin-right: 10px;
`

const DataLabel = styled.span`
    margin-right: 10px;
`

const EditDataContainer = styled.div`
    :not(:last-child) {
        margin-bottom: 20px;
    }
`

interface SingleItemProps {
    item: Item;
    onClickEdit: () => void;
}

interface SingleItemViewContainerProps {
    unlocked: boolean;
}

const BaseItemContainer = styled.div`
    background-color: ${props => props.theme.colors.items.editing}; 
    padding: 10px;
    border-radius: 10px;
`

const SingleItemViewContainer = styled(BaseItemContainer)<SingleItemViewContainerProps>`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    background-color: ${props => props.unlocked ? props.theme.colors.items.unlockDatePassed : props.theme.colors.items.unlockDateUpcoming}; 
`

export const SingleItem = (props: SingleItemProps) => {
    const item = props.item;

    const [dateState, setDateState] = useState(new Date());

    useEffect(() => {
        setInterval(() => setDateState(new Date()), 1000);
    }, []);

    const timeDifference = item.unlockDate.getTime() - dateState.getTime();
    const hourDifference = timeDifference / (1000 * 60 * 60);

    const txt = moment(item.unlockDate).fromNow();

    return <SingleItemViewContainer unlocked={hourDifference <= 0}>
        <div>
            <h3>{item.data}</h3>
            <p>Unlocks at {item.unlockDate.toLocaleString()}</p>
            <EditingButton onClick={props.onClickEdit}>Edit</EditingButton>
        </div>
        <div>
            <p>
                {hourDifference < 0 ? `Unlocked ${txt}` : `Unlocks ${txt}`}
            </p>
        </div>
    </SingleItemViewContainer>
}

export const ItemList = (props: ItemListProps) => {
    const [editingItem, setEditingItem] = useState<Item | undefined>(undefined);
    const sortedItems = props.items.sort((a, b) => new Date(b.unlockDate).getTime() - new Date(a.unlockDate).getTime());

    const saveEditingItem = () => {
        axios.put<Item>(`projects/${props.projectId}/items/${editingItem?._id}`, editingItem).then(response => {
            setEditingItem(undefined);
            props.onEditItem(response.data);
        });
    };

    return <ItemListContainer>
        <h2>Items</h2>
        {sortedItems.map(item => {
            return <SingleItemContainer key={item._id}>
                {editingItem?._id === item._id ? <BaseItemContainer>
                    <h3>{item.data}</h3>
                    <EditDataContainer>
                        <DataLabel>Item data</DataLabel>
                        <input type="text" placeholder="Item data" value={editingItem.data} onChange={e => setEditingItem({ ...editingItem, data: e.currentTarget.value })} />
                    </EditDataContainer>
                    <EditDataContainer>
                        <DataLabel>Unlock date</DataLabel>
                        <Datetime
                            initialValue={moment(editingItem.unlockDate)}
                            onChange={d => setEditingItem({ ...editingItem, unlockDate: moment(d).toDate() })} />
                    </EditDataContainer>
                    <EditDataContainer>
                        <EditingButton onClick={() => saveEditingItem()}>Save</EditingButton>
                        <EditingButton onClick={() => setEditingItem(undefined)}>Cancel</EditingButton>
                    </EditDataContainer>
                </BaseItemContainer> : <SingleItem item={item} onClickEdit={() => setEditingItem(item)} />}
            </SingleItemContainer>;
        })}
    </ItemListContainer>;
};
