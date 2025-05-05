import React from "react";
import createStore from "@/context";
import Modal from "../Modal";
import Button from "../Button";
import Textinput from "../Textinput";
import { router, useForm } from "@inertiajs/react";
import { useEffect, useState } from "react";
import { useUserPermission } from "@/hooks/usePermission";

const ModalAddDepartment = () => {
    const { handleModal, modal, modalItem } = createStore();
    const { post, processing, data, setData, errors, reset, put } = useForm({
        department_name: "",
    });
    const [isLoading, setIsLoading] = useState(false);
    const { hasPermission } = useUserPermission();

    const onSubmit = async () => {
        if (modalItem) {
            put(route("update.department", modalItem?.department_id), {
                onSuccess: (res) => {
                    if (res?.props.flash.message?.type === "success") {
                        handleModal("modalAddDepartment", false);
                        reset();
                    }
                },
                onError: () => {
                    handleModal("modalAddDepartment", true);
                },
            });
        } else {
            post(route("store.department"), {
                onSuccess: (res) => {
                    if (res?.props.flash.message?.type === "success") {
                        handleModal("modalAddDepartment", false);
                        reset();
                    }
                },
                onError: () => {
                    handleModal("modalAddDepartment", true);
                },
            });
        }
    };

    useEffect(() => {
        if (modalItem) {
            setData("department_name", modalItem?.department_name);
        }
    }, [modalItem]);

    const changeDeparmentStatus = async () => {
        const response = await router.patch(
            route("change.master.status", modalItem?.department_id),
            {
                type: "department",
            },

            {
                onStart: () => {
                    setIsLoading(true);
                },
                onSuccess: (res) => {
                    if (res?.props.flash.message?.type === "success") {
                        handleModal("modalAddDepartment", false);
                        setIsLoading(false);
                        reset();
                    }
                },
                onError: () => {
                    handleModal("modalAddDepartment", true);
                    setIsLoading(false);
                    reset();
                },
            },
        );
        return response;
    };

    return (
        <Modal
            title={modalItem ? "Edit Department" : "Add Department"}
            activeModal={modal.modalAddDepartment}
            centered={true}
            onClose={() => handleModal("modalAddDepartment", false)}
            footerContent={
                <div className="lg:flex lg:flex-row flex-col w-full">
                    <Button
                        text={"Submit"}
                        className="btn-dark w-full lg:w-auto py-1 m-1"
                        isLoading={processing}
                        onClick={() => onSubmit()}
                    />
                    {hasPermission("put_department_status") && modalItem && (
                        <Button
                            text={
                                modalItem?.status === "active"
                                    ? "Deactivate"
                                    : "Activate"
                            }
                            className={`${
                                modalItem?.status === "active"
                                    ? "btn-danger"
                                    : "btn-success"
                            } w-full lg:w-auto py-1 m-1`}
                            isLoading={isLoading}
                            onClick={() => changeDeparmentStatus()}
                        />
                    )}
                </div>
            }
        >
            <div className="grid grid-cols-12 gap-5">
                <div className="col-span-12">
                    <Textinput
                        label={"Department Name"}
                        value={data.department_name}
                        onChange={(e) =>
                            setData("department_name", e.target.value)
                        }
                        placeholder="Department Name"
                        error={errors.department_name}
                    />
                </div>
            </div>
        </Modal>
    );
};

export default ModalAddDepartment;
