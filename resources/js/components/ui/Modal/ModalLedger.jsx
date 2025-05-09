import React, { useEffect } from "react";
import createStore from "@/context";
import Modal from "../Modal";
import Button from "../Button";
import Textinput from "../Textinput";
import { router, useForm, usePage } from "@inertiajs/react";
import SelectComponent from "../Master/Select";
import Select from "../Select";
import Textarea from "../Textarea";
import InputGroup from "../InputGroup";
import Swal from "sweetalert2";
import { isInteger } from "lodash";

const ModalLedger = () => {
    const { handleModal, modal, modalItem } = createStore();
    const { post, processing, data, setData, errors, reset, transform, put } =
        useForm({
            ledger_code_prefix: "",
            ledger_name: "",
            child_account: "",
            balance: "",
            type_start_balance: "",
            notes: "",
        });
    const { child_accounts } = usePage().props;

    transform((data) => ({
        ...data,
        balance: isInteger(data?.balance)
            ? data?.balance
            : data?.balance.replace(/\./g, ""),
        child_account_id: data?.child_account?.value?.id,
        ledger_code: data?.child_account
            ? `${data?.child_account?.value?.child_account_code?.replace(
                  /000$/,
                  "",
              )}${data?.ledger_code_prefix}`
            : null,
    }));

    const onSubmit = async () => {
        if (modalItem) {
            put(route("update.ledgers", modalItem?.id), {
                onSuccess: (res) => {
                    if (res?.props.flash.message?.type === "success") {
                        handleModal("modalLedgers", false);
                        reset();
                    }
                },
                onError: () => {
                    handleModal("modalLedgers", true);
                },
            });
        } else {
            post(route("store.ledgers"), {
                onSuccess: (res) => {
                    if (res?.props.flash.message?.type === "success") {
                        handleModal("modalLedgers", false);
                        reset();
                    }
                },
                onError: () => {
                    handleModal("modalLedgers", true);
                },
            });
        }
    };

    const onDelete = async () => {
        Swal.fire({
            title: "Apakah Anda yakin?",
            text: "Data Ledger yang dihapus tidak bisa dikembalikan!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Ya, hapus!",
            cancelButtonText: "Batal",
        }).then((result) => {
            if (result.isConfirmed) {
                handleModal("modalLedgers", false);
                router.delete(route("delete.ledgers", modalItem?.id));
            }
        });
    };

    useEffect(() => {
        if (modalItem?.id) {
            setData({
                ledger_name: modalItem?.ledger_name,
                balance: modalItem?.balance,
                type_start_balance: modalItem?.type_start_balance,
                notes: modalItem?.notes,
                ledger_code_prefix: modalItem?.ledger_code?.split("-").pop(),
                child_account: {
                    label: modalItem?.child_account?.child_account_name,
                    value: modalItem?.child_account,
                },
            });
        }
    }, [modalItem]);

    return (
        <Modal
            title="Tambah Ledger"
            // className="max-w-4xl"
            activeModal={modal.modalLedgers}
            centered={true}
            onClose={() => handleModal("modalLedgers", false)}
            footerContent={
                <div className="lg:flex lg:flex-row flex-col w-full">
                    <div>
                        <Button
                            text={modalItem ? "Edit" : "Submit"}
                            className="btn-dark w-full lg:w-auto py-1 m-1"
                            isLoading={processing}
                            onClick={() => onSubmit()}
                        />
                    </div>
                    {modalItem && (
                        <div>
                            <Button
                                text={"Hapus Ledger"}
                                className="btn-danger w-full lg:w-auto py-1 m-1"
                                isLoading={processing}
                                onClick={() => onDelete()}
                            />
                        </div>
                    )}
                </div>
            }
        >
            <div className="grid grid-cols-12 gap-5">
                <div className="col-span-12">
                    <SelectComponent
                        label={"Kode Anak"}
                        options={child_accounts?.map((item) => ({
                            label: `[${item?.child_account_code}] ${item?.child_account_name} / ${item?.location?.location_name}`,
                            value: item,
                        }))}
                        onChange={(e) => setData("child_account", e)}
                        value={data.child_account}
                        placeholder="Kode Anak"
                        error={errors.child_account_id}
                        disabled={modalItem?.id ? true : false}
                    />
                </div>

                <div className="col-span-12">
                    <InputGroup
                        type="text"
                        prepend={
                            <span className="text-black-500">
                                {data?.child_account
                                    ? data?.child_account?.value?.child_account_code?.replace(
                                          /000$/,
                                          "",
                                      )
                                    : null}
                            </span>
                        }
                        isMask
                        options={{
                            numericOnly: true,
                        }}
                        label={"Kode Ledger"}
                        value={data.ledger_code_prefix}
                        onChange={(e) =>
                            setData("ledger_code_prefix", e.target.value)
                        }
                        disabled={modalItem?.id ? true : false}
                        error={errors.ledger_code}
                    />
                </div>
                <div className="col-span-12">
                    <Textinput
                        label={"Nama Ledger"}
                        value={data.ledger_name}
                        onChange={(e) => setData("ledger_name", e.target.value)}
                        placeholder="Nama Ledger"
                        error={errors.ledger_name}
                    />
                </div>
                <div className="col-span-12">
                    <Select
                        label={"Saldo Awal"}
                        placeholder="Pilih Saldo Awal"
                        value={data.type_start_balance}
                        onChange={(e) =>
                            setData("type_start_balance", e.target.value)
                        }
                        options={[
                            { label: "Debet", value: "Debet" },
                            { label: "Kredit", value: "Kredit" },
                        ]}
                        error={errors.type_start_balance}
                    />
                </div>
                <div className="col-span-12">
                    <Textinput
                        label={"Jumlah"}
                        isMask={true}
                        options={{
                            numeral: true,
                            numeralThousandsGroupStyle: "thousand",
                            delimiter: ".",
                            numeralDecimalMark: ",",
                        }}
                        value={data.balance}
                        onChange={(e) => setData("balance", e.target.value)}
                        placeholder="Jumlah"
                        error={errors.balance}
                    />
                </div>
                <div className="col-span-12">
                    <Textarea
                        label={"Notes"}
                        value={data.notes}
                        onChange={(e) => setData("notes", e.target.value)}
                        placeholder="Keterangan..."
                        error={errors.notes}
                    />
                </div>
            </div>
        </Modal>
    );
};

export default ModalLedger;
