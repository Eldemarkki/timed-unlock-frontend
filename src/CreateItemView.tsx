import axios from "axios";
import { Item, NewItem } from "./type";
import Datetime from 'react-datetime';
import moment from "moment";
import { Button } from "./components/Button";
import { Input } from "./components/Input";
import { WidgetContainer } from "./components/styled/containers";
import styled from "styled-components";
import { WidgetHeader } from "./components/styled/text";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { FormErrorNotification } from "./components/forms/FormErrorNotification";

interface CreateItemViewProps {
    projectId: string;
    onCreateItem: (item: Item) => void;
}

const DatetimeEditorContainer = styled.div``

const FormField = styled.div``

export const InputLabel = styled.span`
    display: block;
    margin-bottom: 5px;
`

export const FormFieldContainer = styled.div`
    margin-bottom: 15px;
`

export const CreateItemValidationSchema = Yup.object().shape({
    itemData: Yup.string().required("Item data is required"),
    unlockDate: Yup.date().required("Unlock date is required")
})

export const CreateItemView = (props: CreateItemViewProps) => {

    const createItem = (data: string, unlockDate: Date) => {
        const item: NewItem = { data, unlockDate };
        axios.post<Item>(`projects/${props.projectId}/items`, item).then(response => {
            const rawItem = response.data;
            // Dates come as strings, so they have to be parsed
            const parsedItem: Item = {
                ...rawItem,
                unlockDate: new Date(rawItem.unlockDate)
            };

            props.onCreateItem(parsedItem);
        });
    };

    return <WidgetContainer>
        <WidgetHeader>Create new item</WidgetHeader>
        <Formik
            initialValues={{ itemData: "", unlockDate: new Date() }}
            validationSchema={CreateItemValidationSchema}
            onSubmit={values => createItem(values.itemData, values.unlockDate)}
        >
            {({ errors, values, setFieldValue, isValid, initialValues }) => <Form>
                <FormFieldContainer>
                    <FormField>
                        <InputLabel>Item data:</InputLabel>
                        <Input type="text" placeholder="Item data" value={values.itemData} onChange={e => setFieldValue("itemData", e.target.value)} hasErrors={Boolean(errors.itemData)} />
                    </FormField>
                    <FormErrorNotification error={errors.itemData} />
                </FormFieldContainer>
                <FormFieldContainer>
                    <FormField>
                        <InputLabel>Unlock date:</InputLabel>
                        <DatetimeEditorContainer>
                            <Datetime
                                initialValue={moment(initialValues.unlockDate)}
                                onChange={d => setFieldValue("unlockDate", moment(d).toDate())} />
                        </DatetimeEditorContainer>
                    </FormField>
                    <FormErrorNotification error={errors.unlockDate ? "Unlock date is required" : undefined} />
                </FormFieldContainer>
                <Button type="submit" colorUsage="primary" disabled={!isValid}>Create</Button>
            </Form>}
        </Formik>
    </WidgetContainer>;
};
