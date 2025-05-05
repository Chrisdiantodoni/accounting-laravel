// hooks/useLedgerSelect.ts
import { useState } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import useGetLedgers from "@/hooks/useGetLedgers";

export const useLedgerSelect = () => {
    const [search, setSearch] = useState("");
    const debouncedSearch = useDebounce(search, 500);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [selected, setSelected] = useState([]);

    const { data, isFetching } = useGetLedgers(debouncedSearch, isMenuOpen);
    const options = data?.data?.data?.map((item) => ({
        label: item?.ledger_name,
        value: item,
    }));

    return {
        selected,
        setSelected,
        search,
        setSearch,
        isMenuOpen,
        setIsMenuOpen,
        options,
        isLoading: isFetching,
    };
};
