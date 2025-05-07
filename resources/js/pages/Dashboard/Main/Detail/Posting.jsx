import Card from "@/components/ui/Card";
import { formatRupiah } from "@/utils/formatter";
import { router, usePage } from "@inertiajs/react";
import React, { useState } from "react";
import { dayJsFormatDate, dayjsFormatDateTime } from "../../../../utils/dayjs";
import Table from "@/components/ui/Table";
import Button from "@/components/ui/Button";
import Swal from "sweetalert2";

function Posting() {
    const { posting } = usePage().props;
    const [isLoading, setIsLoading] = useState({
        posting: false,
        deleteEntry: false,
    });

    const postingEntry = () => {
        Swal.fire({
            title: "Apakah Anda yakin?",
            text: "Data Entry dilakukan Posting",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Ya, Unposting!",
            cancelButtonText: "Batal",
        }).then((result) => {
            if (result.isConfirmed) {
                router.post(
                    route("update.entries.unposting", posting?.id, {
                        onStart: () => {
                            setIsLoading((prev) => ({
                                ...prev,
                                posting: true,
                            }));
                        },
                        onSuccess: () => {
                            setIsLoading((prev) => ({
                                ...prev,
                                posting: false,
                            }));
                        },
                        onError: () => {
                            setIsLoading((prev) => ({
                                ...prev,
                                posting: false,
                            }));
                        },
                    }),
                );
            }
        });
    };

    return (
        <Card title={"Detail Entry"}>
            <div className="grid grid-cols-12 gap-y-1">
                <div className="lg:col-span-6 col-span-12">
                    <div className="grid grid-cols-12 gap-y-1">
                        {[
                            {
                                label: "No. Bukti",
                                value: posting?.document_number || "-",
                            },
                            {
                                label: "Status",
                                value: posting?.status?.toUpperCase() || "-",
                            },
                            {
                                label: "Tanggal",
                                value:
                                    dayJsFormatDate(posting?.entries_date) ||
                                    "-",
                            },
                            {
                                label: "Lokasi",
                                value: posting?.location?.location_name,
                            },
                            {
                                label: "Notes",
                                value: posting?.notes,
                            },
                        ].map((item, index) => (
                            <>
                                <div
                                    className="col-span-4 flex justify-between text-sm"
                                    key={index}
                                >
                                    <p className="text-bold m-0">
                                        {item.label}
                                    </p>
                                </div>
                                <div className="col-span-7  flex">
                                    <p className="">:</p>
                                    <p className="ml-2">{item.value || "-"}</p>
                                </div>
                            </>
                        ))}
                    </div>
                </div>
                <div className="lg:col-span-6 col-span-12">
                    <div className="grid grid-cols-12 gap-y-1">
                        {[
                            {
                                label: "Tgl Buat",
                                value:
                                    dayjsFormatDateTime(posting?.created_at) ||
                                    "-",
                            },
                            {
                                label: "User Buat",
                                value: posting?.user?.name || "-",
                            },
                            {
                                label: "Tgl Edit",
                                value:
                                    dayjsFormatDateTime(posting?.edited_at) ||
                                    "-",
                            },
                            {
                                label: "User Edit",
                                value: posting?.user_edit?.name ?? "SYSTEM",
                            },
                            {
                                label: "Tgl Posting",
                                value:
                                    dayjsFormatDateTime(posting?.posting_at) ||
                                    "-",
                            },
                            {
                                label: "User Posting",
                                value: posting?.user_posting?.name || "-",
                            },
                        ].map((item, index) => (
                            <>
                                <div
                                    className="col-span-4 flex justify-between text-sm"
                                    key={index}
                                >
                                    <p className="text-bold m-0">
                                        {item.label}
                                    </p>
                                </div>
                                <div className="col-span-7  flex">
                                    <p className="">:</p>
                                    <p className="ml-2">{item.value || "-"}</p>
                                </div>
                            </>
                        ))}
                    </div>
                </div>
                <div className="col-span-12 mt-2 overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-100 table-fixed dark:divide-slate-700 border border-slate-200">
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
                        <tbody className=" bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 ">
                            {posting?.entry_items.map((row, index) => (
                                <tr
                                    key={index}
                                    className="border border-slate-200 dark:border-slate-600 text-center text-xs"
                                >
                                    <td className="table-td text-center py-1  text-xs">
                                        {row.type == "Debit"
                                            ? "Debet"
                                            : "Kredit"}
                                    </td>
                                    <td className="table-td text-center py-1  text-xs">
                                        <td className="table-td text-center py-1  text-xs">
                                            {`[${row?.ledger?.ledger_code}] ${row.ledger?.ledger_name}`}
                                        </td>
                                    </td>
                                    <td className="table-td text-center py-1  text-xs">
                                        {formatRupiah(row.debit)}
                                    </td>
                                    <td className="table-td text-center py-1  text-xs">
                                        {formatRupiah(row.credit)}
                                    </td>
                                    <td className="table-td text-center py-1  text-xs">
                                        {row.notes}
                                    </td>
                                    <td className="table-td text-center py-1  text-xs">
                                        {row.user?.name ?? "SYSTEM"}
                                    </td>
                                    <td className="table-td text-center py-1  text-xs">
                                        {dayjsFormatDateTime(row.created_at)}
                                    </td>
                                </tr>
                            ))}

                            <tr className="text-center text-sm border border-slate-200 bg-slate-50 dark:bg-slate-700 whitespace-nowrap">
                                <td
                                    className="table-td text-center py-1"
                                    colSpan={2}
                                >
                                    Total
                                </td>
                                <td className={`table-td py-1 `}>
                                    {formatRupiah(posting?.debit)}
                                </td>
                                <td className={`table-td py-1 `}>
                                    {formatRupiah(posting?.credit)}
                                </td>
                                <td className="table-td py-1" colSpan={3}></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                {posting?.user_id != null && (
                    <div className="col-span-12 lg:flex lg:flex-wrap gap-3 grid grid-cols-1 mt-2">
                        <Button
                            text={"Unposting"}
                            className="py-2 btn-warning"
                            isLoading={isLoading.posting}
                            onClick={postingEntry}
                        />
                    </div>
                )}
                <div className="col-span-12 mt-2">
                    <div className="py-2">
                        <span className="text-lg py">Log</span>
                    </div>
                    <Table
                        headers={headersLog}
                        data={posting?.entry_logs?.map((item) => ({
                            date: dayjsFormatDateTime(item?.created_at),
                            user: item?.user?.name ?? "SYSTEM",
                            action: item?.action,
                        }))}
                    />
                </div>
            </div>
        </Card>
    );
}

const headersLog = [
    {
        title: "Tanggal",
        key: "date",
    },
    {
        title: "User",
        key: "user",
    },
    {
        title: "Aksi",
        key: "action",
    },
];

const headers = [
    {
        label: "Debet/Kredit",
    },
    {
        label: "Perkiraan",
    },
    {
        label: "Jlh Debet (Rp.)",
    },
    {
        label: "Jlh Kredit (Rp.)",
    },
    {
        label: "Keterangan",
    },
    {
        label: "Staff Input",
    },
    {
        label: "Waktu Input",
    },
];

export default Posting;
