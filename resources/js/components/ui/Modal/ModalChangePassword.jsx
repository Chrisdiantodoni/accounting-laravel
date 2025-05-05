import createStore from "@/context";
import Modal from "../Modal";
import Button from "../Button";
import Textinput from "../Textinput";
import { useForm } from "@inertiajs/react";
import Textarea from "../Textarea";
import SelectComponent from "../Master/Select";
import { useMutation } from "@tanstack/react-query";
import master from "@/services/api/master";
import { useEffect, useState } from "react";
import queryString from "@/utils/queryString";

const ModalChangePassword = (props) => {
    const { handleModal, modal } = createStore();
    const { put, processing, data, setData, errors, reset } = useForm({
        old_password: "",
        password: "",
        password_confirmation: "",
    });

    const onSubmit = async () => {
        put(route("change.password"), {
            onSuccess: (res) => {
                if (res?.props.flash.message?.type === "success") {
                    handleModal("modalChangePassword", false);
                    reset();
                }
            },
            onError: () => {
                handleModal("modalChangePassword", true);
            },
        });
    };

    return (
        <Modal
            title="Change Password"
            activeModal={
                modal.modalChangePassword ||
                modal.modalChangePasswordAuthenticated
            }
            centered={true}
            onClose={
                modal.modalChangePasswordAuthenticated
                    ? () =>
                          handleModal("modalChangePasswordAuthenticated", false)
                    : null
            }
            footerContent={
                <div className=" grid lg:grid-cols-12 grid-cols-1">
                    <div>
                        <Button
                            text={"Submit"}
                            className="btn-dark w-full lg:w-auto py-1"
                            isLoading={processing}
                            onClick={() => onSubmit()}
                        />
                    </div>
                </div>
            }
        >
            <div className="grid grid-cols-12 gap-5">
                <div className="col-span-12">
                    <Textinput
                        label={"Old Password"}
                        value={data.old_password}
                        onChange={(e) =>
                            setData("old_password", e.target.value)
                        }
                        type={"password"}
                        hasicon={true}
                        placeholder="Old Password"
                        error={errors.old_password}
                    />
                </div>
                <div className="col-span-12">
                    <Textinput
                        label={"New Password"}
                        value={data.password}
                        type={"password"}
                        hasicon={true}
                        onChange={(e) => setData("password", e.target.value)}
                        placeholder="New Password"
                        error={errors.password}
                    />
                </div>
                <div className="col-span-12">
                    <Textinput
                        label={"Confirm New Password"}
                        value={data.password_confirmation}
                        type={"password"}
                        hasicon={true}
                        onChange={(e) =>
                            setData("password_confirmation", e.target.value)
                        }
                        placeholder="Confirm New Password"
                        error={errors.password_confirmation}
                    />
                </div>
            </div>
        </Modal>
    );
};

export default ModalChangePassword;
