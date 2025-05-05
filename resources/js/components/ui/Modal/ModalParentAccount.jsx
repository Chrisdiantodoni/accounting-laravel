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

const ModalParentAccount = (props) => {
    const { handleModal, modal } = createStore();
    const { post, processing, data, setData, errors, reset } = useForm({
        parent_account_code: "",
        parent_account_name: "",
    });

    const onSubmit = async () => {
        post(route("store.parent.accounts"), {
            onSuccess: (res) => {
                if (res?.props.flash.message?.type === "success") {
                    handleModal("modalParentAccount", false);
                    reset();
                }
            },
            onError: () => {
                handleModal("modalParentAccount", true);
            },
        });
    };

    return (
        <Modal
            title="Tambah Akun Induk"
            activeModal={modal.modalParentAccount}
            centered={true}
            onClose={() => handleModal("modalParentAccount", false)}
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
                        label={"Kode Akun Induk"}
                        value={data.parent_account_code}
                        onChange={(e) =>
                            setData("parent_account_code", e.target.value)
                        }
                        placeholder="Kode Akun Induk"
                        error={errors.parent_account_code}
                    />
                </div>
                <div className="col-span-12">
                    <Textinput
                        label={"Nama Akun Induk"}
                        value={data.parent_account_name}
                        onChange={(e) =>
                            setData("parent_account_name", e.target.value)
                        }
                        placeholder="Nama Akun Induk"
                        error={errors.parent_account_name}
                    />
                </div>
            </div>
        </Modal>
    );
};

export default ModalParentAccount;
