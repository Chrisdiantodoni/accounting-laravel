import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Textarea from "@/components/ui/Textarea";
import Textinput from "@/components/ui/Textinput";
import { useForm, usePage } from "@inertiajs/react";
import React, { useEffect } from "react";
import EntryRow from "./EntryRow";
import { formatRupiah } from "../../../../utils/formatter";
import useCheckDuplicateEntry from "@/hooks/useCheckDuplicateEntry";
import { toast } from "react-toastify";
import { useDebounce } from "@/hooks/useDebounce";

function Entry() {
    const { entry } = usePage().props;
    const { data, setData, processing, post, transform, errors } = useForm({
        document_number: "",
        entries_date: "",
        notes: "",

        entries: [
            {
                type: "debit",
                ledger: null,
                debit: "",
                credit: "",
                notes: "",
            },
            {
                type: "kredit",
                ledger: null,
                debit: "",
                credit: "",
                notes: "",
            },
        ],
    });
    console.log({ errors });

    const handleChangeEntry = (index, field, value) => {
        const updated = [...data.entries];
        updated[index][field] = value;
        setData("entries", updated);
    };

    console.log(data?.entries);

    const addRow = () => {
        setData("entries", [
            ...data.entries,
            { type: "debit", ledger: null, debit: "", credit: "", note: "" },
        ]);
    };

    const removeRow = (index) => {
        const updated = data.entries.filter((_, i) => i !== index);
        setData("entries", updated);
    };

    const parseCurrency = (value) => {
        if (typeof value === "string") {
            const cleaned = value.replace(/\./g, "").replace(",", ".");
            const parsed = parseFloat(cleaned);
            return isNaN(parsed) ? 0 : Math.floor(parsed);
        }

        if (typeof value === "number") {
            return Math.floor(value);
        }

        return 0;
    };

    const totalDebit = data?.entries.reduce((sum, entry) => {
        return sum + parseCurrency(entry.debit);
    }, 0);
    const totalCredit = data?.entries.reduce((sum, entry) => {
        return sum + parseCurrency(entry.credit);
    }, 0);
    //    balance: data?.balance.replace(/\./g, ""),

    transform((data) => ({
        ...data,
        debit: totalDebit,
        credit: totalCredit,
        entries: data?.entries?.map((item) => ({
            ...item,
            id: item?.id,
            type: item?.type.toLowerCase(),
            debit:
                typeof item?.debit === "string"
                    ? item.debit.replace(/\./g, "")
                    : (item?.debit ?? 0),
            credit:
                typeof item?.credit === "string"
                    ? item.credit.replace(/\./g, "")
                    : (item?.credit ?? 0),
            ledger_id: item?.ledger?.value?.id,
        })),
    }));

    const onSubmit = () => {
        if (entry) {
            post(route("update.entries", entry?.id));
        } else {
            post(route("store.entries"));
        }
    };

    const { mutate: checkDuplicate } = useCheckDuplicateEntry(entry?.id);

    const debouncedSearchDocuments = useDebounce(data?.document_number, 500);

    useEffect(() => {
        if (entry) {
            checkDuplicate(debouncedSearchDocuments, {
                onSuccess: (res) => {
                    if (res.data?.meta?.code != "200") {
                        toast.warn(res?.data?.meta?.message);
                        setData("document_number", entry?.document_number);
                    }
                },
                onError: (err) => {
                    toast.warn(err?.response?.data?.meta?.message);

                    setData("document_number", entry?.document_number);
                },
            });
        } else {
            checkDuplicate(debouncedSearchDocuments, {
                onSuccess: (res) => {
                    if (res.data?.meta?.code != "200") {
                        toast.warn(res?.data?.meta?.message);
                        setData("document_number", "");
                    }
                },
                onError: (err) => {
                    toast.warn(err?.response?.data?.meta?.message);

                    setData("document_number", "");
                },
            });
        }
    }, [debouncedSearchDocuments]);

    useEffect(() => {
        if (entry) {
            setData({
                document_number: entry?.document_number,
                entries_date: entry?.entries_date,
                notes: entry?.notes,
                entries: entry?.entry_items?.map((item) => ({
                    id: item?.id,
                    type: item?.type?.toLowerCase(),
                    ledger: {
                        label: `[${item?.ledger?.ledger_code}] ${item?.ledger?.ledger_name}`,
                        value: {
                            id: item?.ledger?.id,
                            ledger_name: item?.ledger?.ledger_name,
                        },
                    },
                    debit: item?.debit,
                    credit: item?.credit,
                    notes: item?.notes,
                })),
            });
        }
    }, [entry]);

    console.log(data.entries);

    const transformErrors = (errors) => {
        const result = {};
        Object.entries(errors || {}).forEach(([key, val]) => {
            const match = key.match(/^entries\.(\d+)\.(\w+)$/);
            if (match) {
                const [, index, field] = match;
                if (!result[index]) result[index] = {};
                result[index][field] = val;
            }
        });
        return result;
    };

    const transformedErrors = transformErrors(errors);

    return (
        <Card title={`${entry ? "Edit Entry" : "Buat Entry"} `}>
            <div className="grid grid-cols-12 gap-5">
                <div className="col-span-4">
                    <Textinput
                        placeholder="No. Bukti"
                        label={"No. Bukti"}
                        value={data.document_number}
                        className="w-full"
                        error={errors.document_number}
                        onChange={(e) =>
                            setData("document_number", e.target.value)
                        }
                    />
                </div>
                <div className="col-span-4">
                    <Textinput
                        hasicon={true}
                        type={"date"}
                        label={"Tanggal"}
                        value={data.entries_date}
                        className="w-full"
                        error={errors.entries_date}
                        onChange={(e) =>
                            setData("entries_date", e.target.value)
                        }
                    />
                </div>
                <div className="col-span-12 overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-100 table-fixed dark:divide-slate-700">
                        <thead className="whitespace-nowrap bg-slate-200 dark:bg-slate-700">
                            <tr>
                                {headers.map((column, i) => (
                                    <th
                                        key={i}
                                        scope="col"
                                        className=" table-th py-3"
                                    >
                                        {column.label}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-slate-100 dark:bg-slate-800 dark:divide-slate-700">
                            {data?.entries.map((row, index) => (
                                <EntryRow
                                    key={row.id}
                                    row={row}
                                    errors={transformedErrors?.[index] || {}}
                                    onChange={(field, value) =>
                                        handleChangeEntry(index, field, value)
                                    }
                                    onDelete={() => removeRow(index)}
                                />
                            ))}

                            <tr className="text-center text-sm">
                                <td
                                    className="table-td text-center py-1"
                                    colSpan={2}
                                >
                                    Total
                                </td>
                                <td
                                    className={`table-td py-1 ${totalDebit - totalCredit != 0 ? "bg-danger-200" : ""}`}
                                >
                                    {formatRupiah(totalDebit)}
                                </td>
                                <td
                                    className={`table-td py-1 ${totalDebit - totalCredit != 0 ? "bg-danger-200" : ""}`}
                                >
                                    {formatRupiah(totalCredit)}
                                </td>
                                <td className="table-td py-1"></td>
                                <td className="table-td py-1 flex items-center justify-center ">
                                    <Button
                                        className="btn-outline-primary p-1"
                                        icon="mdi:add"
                                        onClick={addRow}
                                    />
                                </td>
                            </tr>
                            <tr className="text-center text-sm">
                                <td
                                    className="table-td text-center py-1"
                                    colSpan={2}
                                >
                                    Differences
                                </td>
                                <td colSpan={2} className="table-td py-1">
                                    {formatRupiah(totalDebit - totalCredit)}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div className="col-span-12">
                    <Textarea
                        label={"Note"}
                        value={data.notes}
                        className="w-full"
                        onChange={(e) => setData("notes", e.target.value)}
                    />
                </div>
                <div className="flex gap-x-2">
                    <Button
                        text={"Submit"}
                        disabled={totalDebit - totalCredit != 0}
                        className="btn-dark py-2"
                        isLoading={processing}
                        onClick={() => onSubmit()}
                    />
                    <Button
                        text={"Cancel"}
                        className="btn-danger py-2"
                        link={route("list.users")}
                    />
                </div>
            </div>
        </Card>
    );
}

const headers = [
    {
        label: "Debet/Kredit",
        key: "typeEntry",
    },
    {
        label: "Perkiraan",
        key: "ledger",
    },
    {
        label: "Jlh Debet (Rp.)",
        key: "ledger",
    },
    {
        label: "Jlh Kredit (Rp.)",
        key: "ledger",
    },
    {
        label: "Keterangan",
        key: "ledger",
    },
    {
        label: "Action",
        key: "ledger",
    },
];

export default Entry;
