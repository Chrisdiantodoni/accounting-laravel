/* eslint-disable react/prop-types */
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import SelectComponent from "@/components/ui/Master/Select";
import { useDebounce } from "@/hooks/useDebounce";
import useGetLedgers from "@/hooks/useGetLedgers";
import { Head, router, usePage } from "@inertiajs/react";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

function LedgerSelector({
    title,
    search,
    setSearch,
    isMenuOpen,
    setIsMenuOpen,
    selected,
    setSelected,
    addedItems,
    setAddedItems,
}) {
    const debouncedSearch = useDebounce(search, 500);
    const { data, isFetching } = useGetLedgers(
        debouncedSearch,
        isMenuOpen,
        "Laba/Rugi",
    );
    const options = data?.data?.data?.map((item) => ({
        label: item?.ledger_name,
        value: item,
    }));

    const checkDuplicateCodes = (item) => {
        return addedItems?.filter(
            (addedItem) => addedItem?.ledger_code == item?.value?.ledger_code,
        );
    };

    const handleAdd = (item) => {
        if (checkDuplicateCodes(item)?.length > 0) {
            toast.warning("Kode Ledger sudah terdaftar");
            return;
        }
        if (item) {
            setAddedItems((prev) => [
                ...prev,
                {
                    ledger_id: item?.value?.id,
                    ledger_code: item?.value?.ledger_code,
                    ledger_name: item?.value?.ledger_name,
                },
            ]);
            setSelected(null);
        }
    };

    const handleRemove = (id) => {
        setAddedItems((prev) => prev.filter((item) => item.ledger_id !== id));
    };

    return (
        <Card title={title}>
            <div className="grid grid-cols-12 space-y-4 ">
                <div className="col-span-4">
                    <SelectComponent
                        label={"Pilih Ledger"}
                        options={options || []}
                        onInputChange={(e) => setSearch(e)}
                        isLoading={isFetching}
                        onChange={setSelected}
                        value={selected}
                        onMenuOpen={() => setIsMenuOpen(true)}
                        onMenuClose={() => setIsMenuOpen(false)}
                    />
                </div>
                <div className="col-span-8 pt-2 ml-2">
                    <Button
                        icon={"mdi:add"}
                        className="p-2 btn-dark mt-2"
                        onClick={() => handleAdd(selected)}
                    />
                </div>
                <div className="col-span-12 flex flex-wrap gap-2">
                    {addedItems.map((item) => (
                        <div
                            key={item?.ledger_id}
                            className="flex items-center justify-between bg-gray-100 p-2 rounded"
                        >
                            <span className="text-xs">{`[${item?.ledger_code}] ${item?.ledger_name}`}</span>
                            <Button
                                className="btn-danger p-1 m-1 ml-2"
                                onClick={() => handleRemove(item.ledger_id)}
                                title="Hapus"
                                icon={"ic:sharp-clear"}
                            ></Button>
                        </div>
                    ))}
                </div>
            </div>
        </Card>
    );
}

function ProfitLossForm() {
    const { profit_loss } = usePage().props;
    const [isLoading, setIsLoading] = useState(false);
    // States grouped for each category
    const [sales, setSales] = useState({
        search: "",
        isMenuOpen: false,
        selected: null,
        added: [],
    });
    const [cogs, setCogs] = useState({
        search: "",
        isMenuOpen: false,
        selected: null,
        added: [],
    });
    const [costs, setCosts] = useState({
        search: "",
        isMenuOpen: false,
        selected: null,
        added: [],
    });
    const [otherCosts, setOtherCosts] = useState({
        search: "",
        isMenuOpen: false,
        selected: null,
        added: [],
    });
    const [revenues, setRevenues] = useState({
        search: "",
        isMenuOpen: false,
        selected: null,
        added: [],
    });

    const configs = [
        { title: "List Penjualan Bersih", state: sales, setState: setSales },
        { title: "List Harga Pokok Penjualan", state: cogs, setState: setCogs },
        { title: "List Biaya-biaya", state: costs, setState: setCosts },
        {
            title: "List Biaya Lain-lain",
            state: otherCosts,
            setState: setOtherCosts,
        },
        { title: "List Pendapatan", state: revenues, setState: setRevenues },
    ];
    console.log({ profit_loss });

    useEffect(() => {
        if (profit_loss) {
            setSales((prev) => ({
                ...prev,
                added: profit_loss?.sale?.ledgers?.map((item) => ({
                    ledger_id: item?.id,
                    ledger_name: item?.ledger_name,
                    ledger_code: item?.ledger_code,
                })),
            }));
            setCogs((prev) => ({
                ...prev,
                added: profit_loss?.cogs?.ledgers?.map((item) => ({
                    ledger_id: item?.id,
                    ledger_name: item?.ledger_name,
                    ledger_code: item?.ledger_code,
                })),
            }));
            setCosts((prev) => ({
                ...prev,
                added: profit_loss?.cost?.ledgers?.map((item) => ({
                    ledger_id: item?.id,
                    ledger_name: item?.ledger_name,
                    ledger_code: item?.ledger_code,
                })),
            }));
            setOtherCosts((prev) => ({
                ...prev,
                added: profit_loss?.other_cost?.ledgers?.map((item) => ({
                    ledger_id: item?.id,
                    ledger_name: item?.ledger_name,
                    ledger_code: item?.ledger_code,
                })),
            }));
            setRevenues((prev) => ({
                ...prev,
                added: profit_loss?.revenue?.ledgers?.map((item) => ({
                    ledger_id: item?.id,
                    ledger_name: item?.ledger_name,
                    ledger_code: item?.ledger_code,
                })),
            }));
        }
    }, [profit_loss]);

    const onSubmit = async () => {
        if (profit_loss?.id) {
            await router.put(
                route("update.profitloss.statements", profit_loss?.id),
                {
                    sales: sales?.added?.map((item) => ({
                        ledger_id: item?.ledger_id,
                    })),
                    costs: costs?.added?.map((item) => ({
                        ledger_id: item?.ledger_id,
                    })),
                    other_costs: otherCosts?.added?.map((item) => ({
                        ledger_id: item?.ledger_id,
                    })),
                    cogs: cogs?.added?.map((item) => ({
                        ledger_id: item?.ledger_id,
                    })),
                    revenues: revenues?.added?.map((item) => ({
                        ledger_id: item?.ledger_id,
                    })),
                },
                {
                    preserveState: true,
                    replace: true,
                    preserveScroll: true,
                    onStart: () => {
                        setIsLoading(true);
                    },
                    onSuccess: () => {
                        setIsLoading(false);
                    },
                    onError: () => {
                        setIsLoading(false);
                    },
                },
            );
        } else {
            await router.post(
                route("store.profitloss.statements"),
                {
                    sales: sales?.added?.map((item) => ({
                        ledger_id: item?.ledger_id,
                    })),
                    costs: costs?.added?.map((item) => ({
                        ledger_id: item?.ledger_id,
                    })),
                    other_costs: otherCosts?.added?.map((item) => ({
                        ledger_id: item?.ledger_id,
                    })),
                    cogs: cogs?.added?.map((item) => ({
                        ledger_id: item?.ledger_id,
                    })),
                    revenues: revenues?.added?.map((item) => ({
                        ledger_id: item?.ledger_id,
                    })),
                },
                {
                    preserveState: true,
                    replace: true,
                    preserveScroll: true,
                    onStart: () => {
                        setIsLoading(true);
                    },
                    onSuccess: () => {
                        setIsLoading(false);
                    },
                    onError: () => {
                        setIsLoading(false);
                    },
                },
            );
        }
    };

    return (
        <div className="space-y-4">
            <Head title="Form Laba Rugi" />
            {configs.map(({ title, state, setState }, idx) => (
                <LedgerSelector
                    key={idx}
                    title={title}
                    search={state.search}
                    setSearch={(val) =>
                        setState((prev) => ({ ...prev, search: val }))
                    }
                    isMenuOpen={state.isMenuOpen}
                    setIsMenuOpen={(val) =>
                        setState((prev) => ({ ...prev, isMenuOpen: val }))
                    }
                    selected={state.selected}
                    setSelected={(val) =>
                        setState((prev) => ({ ...prev, selected: val }))
                    }
                    addedItems={state.added}
                    setAddedItems={(valFn) =>
                        setState((prev) => ({
                            ...prev,
                            added: valFn(prev.added),
                        }))
                    }
                />
            ))}
            <div className="flex-wrap space-x-3">
                <Button
                    text={profit_loss ? "Edit" : "Submit"}
                    className="btn-dark py-2 px-6"
                    isLoading={isLoading}
                    onClick={() => onSubmit()}
                />
                <Button
                    text={"Cancel"}
                    className="btn-danger py-2 px-6"
                    onClick={() => window.history.back()}
                />
            </div>
        </div>
    );
}

export default ProfitLossForm;
