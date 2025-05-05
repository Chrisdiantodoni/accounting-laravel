/* eslint-disable react/prop-types */
// components/LedgerSelectSection.tsx
import React from "react";
import SelectComponent from "@/components/ui/Master/Select";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

const LedgerSelectSection = ({
    title,
    label,
    options,
    isLoading,
    onInputChange,
    onChange,
    onMenuOpen,
    onMenuClose,
    value,
    withAddButton = false,
    onAddClick = () => {},
    children,
}) => {
    return (
        <Card title={title}>
            <div className="grid grid-cols-12 space-y-4">
                <div className="col-span-4">
                    <SelectComponent
                        label={label}
                        options={options}
                        isLoading={isLoading}
                        onInputChange={onInputChange}
                        onChange={onChange}
                        onMenuOpen={onMenuOpen}
                        onMenuClose={onMenuClose}
                        value={value}
                    />
                    {withAddButton && (
                        <Button
                            icon="mdi:add"
                            className="p-1 btn-dark mt-2"
                            onClick={onAddClick}
                        />
                    )}
                </div>
                {children}
            </div>
        </Card>
    );
};

export default LedgerSelectSection;
