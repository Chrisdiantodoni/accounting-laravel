import React, { useEffect } from "react";
import Button from "../Button";
import createStore from "@/context";
import { useForm } from "@inertiajs/react";
import Textarea from "../Textarea";
import Modal from "../Modal";
import Textinput from "../Textinput";

function ModalAddLocation() {
    const { handleModal, modal, modalItem } = createStore();
    const { post, processing, data, setData, errors, reset, put } = useForm({
        location_name: "",
        address: "",
        location_code: "",
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
    }, [modal?.modalAddLocation]);

    const onSubmit = async () => {
        if (modalItem) {
            put(route("update.locations", modalItem?.id), {
                onSuccess: (res) => {
                    if (res?.props.flash.message?.type === "success") {
                        handleModal("modalAddLocation", false);
                        reset();
                    }
                },
                onError: () => {
                    handleModal("modalAddLocation", true);
                },
            });
        } else {
            post(route("store.locations"), {
                onSuccess: (res) => {
                    if (res?.props.flash.message?.type === "success") {
                        handleModal("modalAddLocation", false);
                        reset();
                    }
                },
                onError: () => {
                    handleModal("modalAddLocation", true);
                },
            });
        }
    };

    return (
        <Modal
            title={modalItem ? "Edit Lokasi" : "Tambah Lokasi"}
            activeModal={modal.modalAddLocation}
            centered={true}
            onClose={() => handleModal("modalAddLocation", false)}
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
                        label={"Nama Lokasi"}
                        value={data.location_name}
                        onChange={(e) =>
                            setData("location_name", e.target.value)
                        }
                        placeholder="Nama Lokasi"
                        error={errors.location_name}
                    />
                </div>
                <div className="col-span-12">
                    <Textinput
                        label={"Kode Lokasi"}
                        value={data.location_code}
                        onChange={(e) =>
                            setData("location_code", e.target.value)
                        }
                        placeholder="Kode Lokasi"
                        error={errors.location_code}
                    />
                </div>
                <div className="col-span-12">
                    <Textarea
                        label={"Alamat Lokasi"}
                        value={data.address}
                        onChange={(e) => setData("address", e.target.value)}
                        placeholder="Alamat Lokasi"
                        error={errors.address}
                    />
                </div>
            </div>
        </Modal>
    );
}

export default ModalAddLocation;
