import axios from "axios";
import { useMutation } from "@tanstack/react-query";

const useCheckDuplicateEntry = (id) => {
    if (id) {
        return useMutation({
            mutationFn: async (body) => {
                body = {
                    document_number: body,
                };
                const response = await axios.post(
                    route("check.duplicate.entries.edit", id),
                    body,
                );
                return response;
            },
        });
    }
    return useMutation({
        mutationFn: async (body) => {
            body = {
                document_number: body,
            };
            const response = await axios.post(
                route("check.duplicate.entries"),
                body,
            );
            return response;
        },
    });
};

export default useCheckDuplicateEntry;
