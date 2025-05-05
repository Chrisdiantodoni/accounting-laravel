import axios from "axios";
import { useQuery } from "@tanstack/react-query";

const useGetLedgers = (q, isMenuOpen, type) => {
    return useQuery({
        queryKey: ["getLedgerList", q],
        queryFn: async () => {
            const response = await axios.get(route("list.master.ledgers"), {
                params: { q, type },
            });
            return response.data;
        },
        enabled: !!q || isMenuOpen,
    });
};

export default useGetLedgers;
