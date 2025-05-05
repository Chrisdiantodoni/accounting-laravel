import { usePage } from "@inertiajs/react";
import React, { useEffect } from "react";
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
        }
    }, [flash]);

    return null;
};

export default Flasher;
