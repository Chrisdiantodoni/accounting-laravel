/* eslint-disable react/prop-types */
import React from "react";
import Icon from "@/components/ui/Icon";
import { Controller } from "react-hook-form";
import Select from "react-select";

const styles = {
    option: (provided) => ({
        ...provided,
        fontSize: "14px",
    }),
    input: (base) => ({
        ...base,
        "input:focus": {
            boxShadow: "none",
        },
    }),
    menu: (provided) => ({
        ...provided,
        zIndex: 9999, // Set your desired z-index value here
    }),

    // Optionally, adjust the z-index for other related components if needed
    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
};

const SelectComponent = ({
    value,
    onChange,
    options,
    label,
    placeholder,
    msgTooltip,
    error,
    form,
    name,
    control,
    isClearable = true,
    className = "",
    classLabel = "form-label",
    classGroup = "",
    stylesSelect,
    required,
    onInputChange,
    ...rest
}) => {
    const errorMessage = error?.message || error;

    return form ? (
        <div className={`${errorMessage ? "has-error" : ""} ${classGroup}`}>
            {label && (
                <label
                    htmlFor={name}
                    className={`block capitalize ${classLabel}`}
                >
                    {label}{" "}
                    {required ? (
                        <span className="text-danger-500">* </span>
                    ) : null}
                </label>
            )}
            <div className={`relative ${className}`}>
                <Controller
                    control={control}
                    name={name}
                    render={({ field: { onChange, value } }) => (
                        <Select
                            {...rest}
                            className={`${
                                errorMessage ? " has-error" : " "
                            } appearance-none `}
                            classNamePrefix="select"
                            isClearable={isClearable}
                            placeholder={placeholder}
                            onChange={onChange}
                            value={value}
                            options={options}
                            styles={styles}
                            menuPortalTarget={document.body}
                        />
                    )}
                />
                <div className="flex text-xl absolute right-[30px] top-1/2 -translate-y-1/2 space-x-1">
                    {errorMessage && (
                        <span className="text-danger-500">
                            <Icon icon="heroicons-outline:information-circle" />
                        </span>
                    )}
                </div>
            </div>
            {errorMessage && (
                <div
                    className={`mt-2 ${
                        msgTooltip
                            ? " inline-block bg-danger-500 text-white text-[10px] px-2 py-1 rounded"
                            : " text-danger-500 block text-sm"
                    }`}
                >
                    {errorMessage}
                </div>
            )}
        </div>
    ) : (
        <div className={`relative ${className}`}>
            {label && (
                <label
                    htmlFor={name}
                    className={`block capitalize ${classLabel}`}
                >
                    {label}
                </label>
            )}
            <Select
                {...rest}
                onInputChange={onInputChange}
                className="react-select"
                classNamePrefix="select"
                isClearable={true}
                placeholder={placeholder}
                onChange={onChange}
                value={value}
                options={options}
                menuPortalTarget={document.body}
                styles={{
                    ...stylesSelect,
                    ...styles,
                }}
            />
            {errorMessage && (
                <div
                    className={`mt-2 ${
                        msgTooltip
                            ? " inline-block bg-danger-500 text-white text-[10px] px-2 py-1 rounded"
                            : " text-danger-500 block text-sm"
                    }`}
                >
                    {errorMessage}
                </div>
            )}
        </div>
    );
};

export default SelectComponent;
