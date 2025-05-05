import createStore from "@/context";
import Modal from "../Modal";
import Button from "../Button";
import Textinput from "../Textinput";
import { useForm } from "@inertiajs/react";
import Textarea from "../Textarea";
const ModalReject = ({ deposit_type, id }) => {
    const { handleModal, modal } = createStore();
    const { put, processing, data, setData, errors, setError } = useForm({
        note: "",
        deposit_type,
        status: "reject",
    });

    const onSubmit = async () => {
        if (data?.note) {
            await put(route("cashier.counter.approval.deposit", id));
            handleModal("modalReject", false);
        } else {
            setError("note", { message: "Reason is required" });
        }
    };
    console.log(errors);
    return (
        <Modal
            themeClass="bg-danger-500 "
            title="Reject"
            activeModal={modal.modalReject}
            centered={true}
            onClose={() => handleModal("modalReject", false)}
            footerContent={
                <div className=" grid lg:grid-cols-12 grid-cols-1">
                    <div>
                        <Button
                            text={"Submit"}
                            className="btn-danger w-full lg:w-auto"
                            isLoading={processing}
                            onClick={() => onSubmit()}
                        />
                    </div>
                </div>
            }
        >
            <div className="grid grid-cols-12 gap-5">
                <div className="col-span-12">
                    <Textarea
                        label={"Reason"}
                        value={data.note}
                        onChange={(e) => setData("note", e.target.value)}
                        placeholder="Note"
                        className="min-h-24"
                        error={errors.note}
                    />
                </div>
            </div>
        </Modal>
    );
};

export default ModalReject;
