import { FormErrorText } from "./FormErrorText";

export interface FormErrorNotificationProps {
    error?: string;
}

export const FormErrorNotification = ({ error }: FormErrorNotificationProps): JSX.Element | null => {
  if (!error) return null;
  return <FormErrorText>{error}</FormErrorText>;
};