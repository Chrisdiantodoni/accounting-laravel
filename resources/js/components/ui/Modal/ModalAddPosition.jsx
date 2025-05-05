import createStore from "@/context";
import Modal from "../Modal";
import Button from "../Button";
import Textinput from "../Textinput";
import { router, useForm } from "@inertiajs/react";
import Textarea from "../Textarea";
import SelectComponent from "../Master/Select";
import { useMutation } from "@tanstack/react-query";
import master from "@/services/api/master";
import { useEffect, useState } from "react";
import queryString from "@/utils/queryString";
import { useUserPermission } from "@/hooks/usePermission";
const ModalAddPosition = (props) => {
    const { handleModal, modal, modalItem } = createStore();
    const { post, processing, data, setData, errors, reset, put } = useForm({
        position_name: "",
    });
    const [isLoading, setIsLoading] = useState(false);
    const { hasPermission } = useUserPermission();

    const onSubmit = async () => {
        if (modalItem) {
            put(route("update.position", modalItem?.position_id), {
                onSuccess: (res) => {
                    if (res?.props.flash.message?.type === "success") {
                        handleModal("modalAddPosition", false);
                        reset();
                    }
                },
                onError: () => {
                    handleModal("modalAddPosition", true);
                },
            });
        } else {
            post(route("store.position"), {
                onSuccess: (res) => {
                    if (res?.props.flash.message?.type === "success") {
                        handleModal("modalAddPosition", false);
                        reset();
                    }
                },
                onError: () => {
                    handleModal("modalAddPosition", true);
                },
            });
        }
    };

    useEffect(() => {
        if (modalItem) {
            setData("position_name", modalItem?.position_name);
        }
    }, [modalItem]);

    const changeDepartmentStatus = async () => {
        const response = await router.patch(
            route("change.master.status", modalItem?.position_id),
            {
                type: "position",
            },

            {
                onStart: (res) => {
                    setIsLoading(true);
                },
                onSuccess: (res) => {
                    if (res?.props.flash.message?.type === "success") {
                        handleModal("modalAddPosition", false);
                        setIsLoading(false);
                        reset();
                    }
                },
                onError: () => {
                    handleModal("modalAddPosition", true);
                    setIsLoading(false);
                    reset();
                },
            }
        );
        return response;
    };

    return (
        <Modal
            title={modalItem ? "Edit Position" : "Add Position"}
            activeModal={modal.modalAddPosition}
            centered={true}
            onClose={() => handleModal("modalAddPosition", false)}
            footerContent={
                <div className="lg:flex lg:flex-row flex-col w-full">
                    <Button
                        text={"Submit"}
                        className="btn-dark w-full lg:w-auto py-1 m-1"
                        isLoading={processing}
                        onClick={() => onSubmit()}
                    />
                    {hasPermission("put_position_status") && modalItem && (
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
                            onClick={() => changeDepartmentStatus()}
                        />
                    )}
                </div>
            }
        >
            <div className="grid grid-cols-12 gap-5">
                <div className="col-span-12">
                    <Textinput
                        label={"Position Name"}
                        value={data.position_name}
                        onChange={(e) =>
                            setData("position_name", e.target.value)
                        }
                        placeholder="Position Name"
                        error={errors.position_name}
                    />
                </div>
            </div>
        </Modal>
    );
};

export default ModalAddPosition;
