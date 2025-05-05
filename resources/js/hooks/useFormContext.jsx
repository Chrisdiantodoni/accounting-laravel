import React, { useContext } from "react";
import { useForm } from "@inertiajs/react";

export const FormContext = React.createContext();

export const FormContextProvider = ({ children }) => {
    const formMethods = useForm();

    return (
        <FormContext.Provider value={formMethods}>
            {children}
        </FormContext.Provider>
    );
};

export const useFormContext = () => {
    return useContext(FormContext);
};
