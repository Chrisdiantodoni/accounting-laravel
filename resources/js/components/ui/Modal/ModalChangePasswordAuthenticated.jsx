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
const ModalAddUser = (props) => {
    const { handleModal, modal } = createStore();
    const [dealers, setDealers] = useState([]);
    const { post, processing, data, setData, errors, reset } = useForm({
        name: "",
        username: "",
        dealers: [],
    });

    const onSubmit = async () => {
        post(route("store.user"), {
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

    const dealerQueryString = queryString.stringified({
        limit: 99,
    });
    const { mutate: getDealer, isPending: isLoadingDealer } = useMutation({
        mutationKey: ["getDealer"],
        mutationFn: async () => {
            const response = await master.getDealer(dealerQueryString);
            setDealers(
                response?.data?.data?.map((item) => ({
                    label: item?.dealer_name,
                    value: item,
                }))
            );
            return response;
        },
    });

    useEffect(() => {
        if (modal.modalAddUser) {
            getDealer();
        }
    }, [modal.modalAddUser]);

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
                        label={"Dealer"}
                        error={errors.dealers}
                        value={data.dealers}
                        onChange={(e) => setData("dealers", e)}
                        options={dealers}
                        isLoading={isLoadingDealer}
                        closeMenuOnSelect={false}
                        menuPortalTarget={document.body}
                    />
                </div>
            </div>
        </Modal>
    );
};

export default ModalAddUser;
