import axios from "axios";
import { useMutation } from "@tanstack/react-query";

const useCheckDuplicateChildAccount = () => {
    return useMutation({
        mutationFn: async (body) => {
            body = {
                child_account_code: body,
            };
            const response = await axios.post(
                route("check.duplicate.child.account"),
                body,
            );
            return response;
        },
    });
};

export default useCheckDuplicateChildAccount;
