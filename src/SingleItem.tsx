import { useEffect, useState } from "react";
import moment from "moment";
// import { EditingButton } from "./ItemList";
import styled from "styled-components";
import { Item } from "./type";
import { Button } from "./components/Button";
import { Input } from "./components/Input";
import Datetime from 'react-datetime';
import axios from "axios";

export interface SingleItemProps {
    item: Item;
    onEditItem: (newItem: Item) => void;
}

const SingleItemViewContainer = styled.div<SingleItemViewContainerProps>`
    padding: 10px;
    max-width: 100%;
    //border-radius: 10px;    
    display: flex;
    flex-direction: row;
    //justify-content: space-between;
    //background-color: ${props => props.unlocked ? props.theme.colors.items.unlockDatePassed : props.theme.colors.items.unlockDateUpcoming}; 
    background-color: white;

`

interface SingleItemViewContainerProps {
    unlocked: boolean;
}

const ProjectData = styled.h3`
    display: block;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin-right: 20px;
    flex-shrink: 1;
    word-break: break-all;
    margin: 0px;
`

const UnlockDate = styled.span`
    margin-right: 20px;
    white-space: nowrap;
`

const UnlockTimeAgo = styled.span`
    margin-right: 20px;
    white-space: nowrap;
    flex-grow: 1;
`

const Separator = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    width: 100%;
`

const EditingContainer = styled.div`
    background-color: ${props => props.theme.colors.foreground};
    padding: 10px;
`

const EditingProjectData = styled(ProjectData)`
    margin-bottom: 10px;
`

const EditLabel = styled.span`
    margin-right: 15px;
`

const EditDataRow = styled.div`
    margin-bottom: 15px;
`

const DatetimeContainer = styled.div`
    display: inline-block;
    max-width: 200px;
`

const EditButton = styled(Button)`
    margin-right: 15px;
`

const RightSide = styled.div`
    display: flex;
    flex-wrap: nowrap;
    align-items: center;
`

export const SingleItem = (props: SingleItemProps) => {
    const [editingItem, setEditingItem] = useState<Item | undefined>(undefined);
    const item = props.item;

    const [dateState, setDateState] = useState(new Date());

    useEffect(() => {
        setInterval(() => setDateState(new Date()), 1000);
    }, []);

    const timeDifference = item.unlockDate.getTime() - dateState.getTime();
    const hourDifference = timeDifference / (1000 * 60 * 60);

    const txt = moment(item.unlockDate).fromNow();

    const saveEditingItem = () => {
        axios.put<Item>(`projects/${item.project}/items/${editingItem?._id}`, editingItem).then(response => {
            setEditingItem(undefined);
            const rawItem = response.data;
            // Dates come as strings, so they have to be parsed
            const parsedItem: Item = {
                ...rawItem,
                unlockDate: new Date(rawItem.unlockDate)
            };
            props.onEditItem(parsedItem);
        });
    };

    if (editingItem) {
        return <EditingContainer>
            <EditingProjectData>{item.data}</EditingProjectData>
            <EditDataRow>
                <EditLabel>Item data</EditLabel>
                <Input type="textarea" placeholder="Item data" value={editingItem.data} onChange={e => setEditingItem({ ...editingItem, data: e.target.value })} />
            </EditDataRow>
            <EditDataRow>
                <EditLabel>Unlock time</EditLabel>
                <DatetimeContainer>
                    <Datetime
                        initialValue={moment(editingItem.unlockDate)}
                        onChange={d => setEditingItem({ ...editingItem, unlockDate: moment(d).toDate() })} />
                </DatetimeContainer>
            </EditDataRow>
            <div>
                <EditButton onClick={() => setEditingItem(undefined)}>Cancel</EditButton>
                <EditButton onClick={saveEditingItem} colorUsage="primary">Save</EditButton>
            </div>
        </EditingContainer>
    }

    return <SingleItemViewContainer unlocked={hourDifference <= 0}>
        <Separator>
            <ProjectData title={item.data}>{item.data}</ProjectData>
            <RightSide>
                <UnlockDate>Unlocks at {item.unlockDate.toLocaleString()}</UnlockDate>
                <UnlockTimeAgo>{hourDifference < 0 ? `Unlocked ${txt}` : `Unlocks ${txt}`}</UnlockTimeAgo>
                <Button onClick={() => setEditingItem(item)}>Edit</Button>
            </RightSide>
        </Separator>
    </SingleItemViewContainer>;
};
