import axios from 'axios';
import React from 'react'
import { WidgetContainer } from '../styled/containers';
import { WidgetHeader } from '../styled/text';
import { Project } from "../../type"
import styled from 'styled-components';
import { Button } from '../Button';
import { Input } from '../Input';
import { Form, Formik } from 'formik';
import * as Yup from "yup";
import { FormErrorNotification } from '../forms/FormErrorNotification';

interface CreateProjectViewProps {
    onCreateProject: (project: Project) => void;
}

const CreateButton = styled(Button)`
    min-width: 80px;
`

const CreateProjectValidationSchema = Yup.object().shape({
    projectName: Yup.string().required("Project name is required")
})

const FormField = styled.div``

export const InputLabel = styled.span`
    display: block;
    margin-bottom: 5px;
`

export const FormFieldContainer = styled.div`
    margin-bottom: 15px;
`

export const CreateProjectView = (props: CreateProjectViewProps) => {
    const createProject = (projectName: string) => {
        axios.post<Project>("projects", { projectName }).then(response => {
            const project = response.data;
            props.onCreateProject(project);
        })
    }

    return (
        <WidgetContainer>
            <WidgetHeader>Create new project</WidgetHeader>
            <Formik
                initialValues={{ projectName: "" }}
                validationSchema={CreateProjectValidationSchema}
                onSubmit={values => createProject(values.projectName)} >
                {({ errors, values, setFieldValue, isValid }) => <Form>
                    <FormFieldContainer>
                        <FormField>
                            <InputLabel>Project name</InputLabel>
                            <Input required type="text" placeholder="Project name" onChange={e => setFieldValue("projectName", e.target.value)} value={values.projectName} hasErrors={Boolean(errors.projectName)} />
                        </FormField>
                        <FormErrorNotification error={errors.projectName} />
                    </FormFieldContainer>
                    <CreateButton type="submit" colorUsage="primary" disabled={!isValid}>Create</CreateButton>
                </Form>}
            </Formik>
        </WidgetContainer>
    )
}
