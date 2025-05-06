/* eslint-disable react/prop-types */
import React from "react";
import createStore from "@/context";
import Modal from "../Modal";
import Button from "../Button";
import Textinput from "../Textinput";
import { useForm } from "@inertiajs/react";
import SelectComponent from "../Master/Select";

const ModalAddUser = ({ locations, years }) => {
    const { handleModal, modal } = createStore();
    const { post, processing, data, setData, errors, reset } = useForm({
        name: "",
        username: "",
        locations: [],
        years: [],
    });

    const onSubmit = async () => {
        // console.log(data);
        // return;
        post(route("store.users"), {
            onSuccess: (res) => {
                if (res?.props.flash.message?.type === "success") {
                    handleModal("modalAddUser", false);
                    reset();
                }
            },
            onError: () => {
                handleModal("modalAddUser", true);
            },
        });
    };

    return (
        <Modal
            title="Add User"
            activeModal={modal.modalAddUser}
            centered={true}
            onClose={() => handleModal("modalAddUser", false)}
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
                        label={"Name"}
                        value={data.name}
                        onChange={(e) => setData("name", e.target.value)}
                        placeholder="name"
                        error={errors.name}
                    />
                </div>
                <div className="col-span-12">
                    <Textinput
                        label={"Username"}
                        value={data.username}
                        onChange={(e) => setData("username", e.target.value)}
                        placeholder="username"
                        error={errors.username}
                    />
                </div>
                <div className="col-span-12">
                    <SelectComponent
                        isMulti
                        label={"Location"}
                        error={errors.dealers}
                        value={data.dealers}
                        onChange={(e) => setData("locations", e)}
                        options={locations?.map((item) => ({
                            label: item?.location_name,
                            value: item,
                        }))}
                        closeMenuOnSelect={false}
                        menuPortalTarget={document.body}
                    />
                </div>
                <div className="col-span-12">
                    <SelectComponent
                        isMulti
                        label={"Tahun"}
                        error={errors.dealers}
                        value={data.years}
                        onChange={(e) => setData("years", e)}
                        options={years?.map((item) => ({
                            label: item?.year,
                            value: item,
                        }))}
                        closeMenuOnSelect={false}
                        menuPortalTarget={document.body}
                    />
                </div>
            </div>
        </Modal>
    );
};

export default ModalAddUser;
