import { usePage } from "@inertiajs/react";
import { useEffect } from "react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

const Flasher = () => {
    const { flash } = usePage().props;
    console.log({ flash });
    useEffect(() => {
        if (flash?.message?.type === "success") {
            Swal.fire({
                icon: "success",
                title: "Success",
                text: flash.message?.message,
            });
        } else if (flash?.message?.type === "error") {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: flash.message?.message,
            });
        } else if (flash?.message?.alert_type === "toast") {
            const type = flash?.message?.toast_type; // "success", "error", "info", etc.
            const message = flash?.message?.message;

            if (toast[type]) {
                toast[type](message);
            } else {
                toast.info(message); // fallback kalau tipe tidak dikenal
            }
        }
    }, [flash]);

    return null;
};

export default Flasher;
