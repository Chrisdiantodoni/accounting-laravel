import createStore from "@/context";
import Modal from "../Modal";
import Button from "../Button";
import Textinput from "../Textinput";
import { useForm, usePage } from "@inertiajs/react";
import SelectComponent from "../Master/Select";
import Swal from "sweetalert2";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import useCheckDuplicateChildAccount from "./useCheckDuplicateCode";

const ModalChildAccount = () => {
    const { handleModal, modal } = createStore();
    const { post, processing, data, setData, errors, reset, transform } =
        useForm({
            child_account_code: "",
            child_account_name: "",
            parent_account: "",
        });
    const { parent_accounts, selectedLocations } = usePage().props;

    transform((data) => ({
        ...data,
        parent_account_id: data?.parent_account?.value?.id,
    }));

    const onSubmit = async () => {
        post(route("store.child.accounts"), {
            onSuccess: (res) => {
                if (res?.props.flash.message?.type === "success") {
                    handleModal("modalChildAccount", false);
                    reset();
                }
            },
            onError: () => {
                handleModal("modalChildAccount", true);
            },
        });
    };
    const { mutate: checkDuplicate, isPending } =
        useCheckDuplicateChildAccount();

    const checkDuplicateGroupCode = (e) => {
        if (e != null) {
            const parentAccounts = e?.value?.parent_account_code;
            checkDuplicate(`${parentAccounts}-${selectedLocations?.code}-000`, {
                onSuccess: (res) => {
                    if (res.data?.meta?.code == "200") {
                        setData({
                            parent_account: e,
                            child_account_code: `${parentAccounts}-${selectedLocations?.code}-000`,
                        });
                    } else {
                        Swal.fire({
                            icon: "error",
                            title: "Perhatian",
                            text: res?.data?.meta?.message,
                        });
                        setData({ child_account_code: "", parent_account: "" });
                    }
                },
                onError: (err) => {
                    Swal.fire({
                        icon: "error",
                        title: "Perhatian",
                        text: err?.response?.data?.meta?.message,
                    });
                    setData({ child_account_code: "", parent_account: "" });
                },
            });
        } else {
            setData({ child_account_code: "", parent_account: "" });
        }

        // post(route("check.duplicate.child.account"), {
        //     onSuccess: (res) => {
        //         if (res?.props?.flash?.message?.type == "ok") {
        //             setData({
        //                 parent_account: e,
        //                 child_account_code: `${parentAccounts?.parent_account_code}-${selectedLocations?.code}-000`,
        //             });
        //         }
        //     },
        //     onError: (res) => {
        //         console.log(res);

        //         Swal.fire({
        //             icon: "error",
        //             title: "Perhatian",
        //             text: res?.props?.flash.message?.message,
        //         });
        //         setData({ child_account_code: "", parent_account: "" });
        //     },
        // });
    };

    return (
        <Modal
            title="Tambah Akun Anak"
            activeModal={modal.modalChildAccount}
            centered={true}
            onClose={() => handleModal("modalChildAccount", false)}
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
                    <SelectComponent
                        label={"Kode Induk"}
                        options={parent_accounts?.map((item) => ({
                            label: `[${item?.parent_account_code}] ${item?.parent_account_name}`,
                            value: item,
                        }))}
                        value={data.parent_account}
                        onChange={checkDuplicateGroupCode}
                        placeholder="Kode Induk"
                        error={errors.parent_account}
                    />
                </div>

                <div className="col-span-12">
                    <Textinput
                        label={"Kode Akun Anak"}
                        disabled={true}
                        value={data.child_account_code}
                        onChange={(e) =>
                            setData("child_account_code", e.target.value)
                        }
                        placeholder="Kode Akun Induk"
                        error={errors.child_account_code}
                    />
                </div>
                <div className="col-span-12">
                    <Textinput
                        label={"Nama Akun Anak"}
                        value={data.child_account_name}
                        onChange={(e) =>
                            setData("child_account_name", e.target.value)
                        }
                        placeholder="Nama Akun Induk"
                        error={errors.child_account_name}
                    />
                </div>
            </div>
        </Modal>
    );
};

export default ModalChildAccount;
