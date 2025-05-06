import Button from "@/components/ui/Button";
import { router } from "@inertiajs/react";
import React from "react";

function CloseBook() {
    const ClosingBook = async () => {
        await router.post(route("close.book"));
    };
    return (
        <div>
            <Button onClick={ClosingBook} />
        </div>
    );
}

export default CloseBook;
