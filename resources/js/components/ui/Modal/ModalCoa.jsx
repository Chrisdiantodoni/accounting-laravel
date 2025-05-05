import React, { useEffect } from "react";
import Button from "../Button";
import createStore from "@/context";
import { useForm } from "@inertiajs/react";
import Textarea from "../Textarea";
import Modal from "../Modal";
import Textinput from "../Textinput";
import Select from "../Select";

function ModalCoa() {
    const { handleModal, modal, modalItem } = createStore();
    const { post, processing, data, setData, errors, reset, put } = useForm({
        group_code: "",
        group_description: "",
        group_type: "",
        upper_account_code: "",
        lower_account_code: "",
    });

    useEffect(() => {
        reset();
        if (modalItem) {
            setData({
                location_name: modalItem?.location_name || "",
                location_code: modalItem?.code || "",
                address: modalItem?.address || "",
            });
        }
    }, [modal?.modalCoa]);

    const onSubmit = async () => {
        post(route("store.coa", modalItem?.id), {
            onSuccess: (res) => {
                if (res?.props.flash.message?.type === "success") {
                    handleModal("modalCoa", false);
                    reset();
                }
            },
            onError: () => {
                handleModal("modalCoa", true);
            },
        });
    };

    return (
        <Modal
            title={
                modalItem ? "Edit Group Perkiraan" : "Tambah Group Perkiraan"
            }
            activeModal={modal.modalCoa}
            centered={true}
            onClose={() => handleModal("modalCoa", false)}
            footerContent={
                <div className="lg:flex lg:flex-row flex-col w-full">
                    <Button
                        text={"Submit"}
                        className="btn-dark w-full lg:w-auto py-1 m-1"
                        isLoading={processing}
                        onClick={() => onSubmit()}
                    />
                </div>
            }
        >
            <div className="grid grid-cols-12 gap-5">
                <div className="col-span-12">
                    <Textinput
                        label={"Kode Group"}
                        value={data.group_code}
                        onChange={(e) => setData("group_code", e.target.value)}
                        placeholder="Kode Group"
                        error={errors.group_code}
                    />
                </div>
                <div className="col-span-12">
                    <Textinput
                        label={"Keterangan Group"}
                        value={data.group_description}
                        onChange={(e) =>
                            setData("group_description", e.target.value)
                        }
                        placeholder="Keterangan Group"
                        error={errors.group_description}
                    />
                </div>
                <div className="col-span-12">
                    <Select
                        placeholder="Pilih Jenis Group"
                        label={"Jenis Group"}
                        value={data.group_type}
                        onChange={(e) => setData("group_type", e.target.value)}
                        error={errors.group_type}
                        options={[
                            { label: "Neraca", value: "Neraca" },
                            { label: "Laba/Rugi", value: "Laba/Rugi" },
                        ]}
                    />
                </div>
                <div className="col-span-12">
                    <Textinput
                        options={{
                            numericOnly: true,
                        }}
                        isMask={true}
                        label={"Kode Akun Bawah"}
                        value={data.lower_account_code}
                        onChange={(e) =>
                            setData("lower_account_code", e.target.value)
                        }
                        placeholder="Kode Akun Bawah"
                        error={errors.lower_account_code}
                    />
                </div>
                <div className="col-span-12">
                    <Textinput
                        isMask={true}
                        options={{
                            numericOnly: true,
                        }}
                        label={"Kode Akun Atas"}
                        value={data.upper_account_code}
                        onChange={(e) =>
                            setData("upper_account_code", e.target.value)
                        }
                        placeholder="Kode Akun Atas"
                        error={errors.upper_account_code}
                    />
                </div>
            </div>
        </Modal>
    );
}

export default ModalCoa;
