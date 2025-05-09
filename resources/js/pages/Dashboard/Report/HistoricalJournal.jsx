import LoaderCircle from "@/components/Loader-circle";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import SelectComponent from "@/components/ui/Master/Select";
import { Head, router, usePage } from "@inertiajs/react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useDebounce } from "@/hooks/useDebounce";
import useGetLedgers from "@/hooks/useGetLedgers";
import dayjs from "dayjs";
import DatePicker from "@/components/ui/DatePicker";
import Table from "@/components/ui/Table";
import { dayJsFormatDate, dayjsFormatInputDate } from "@/utils/dayjs";
import { formatRupiah } from "@/utils/formatter";
import Search from "@/components/ui/Search";

const schema = yup.object().shape({
    location: yup.object().nullable().required("Lokasi wajib dipilih"),
    ledger: yup.object().nullable().required("Ledger wajib dipilih"),
});

function HistoricalJournal() {
    const {
        auth,
        journals,
        total_in_range,
        start_balance,
        total_in_range_before,
    } = usePage().props;
    const now = dayjs().format("YYYY-MM-DD");
    const oneMonthBefore = dayjs().subtract(1, "month").format("YYYY-MM-DD");
    const [startDate, setStartDate] = useState(oneMonthBefore || "");
    const [endDate, setEndDate] = useState(now || "");
    const [isLoading, setIsLoading] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [searchLedger, setSearchLedger] = useState("");
    const [searchJournal, setSearchJournal] = useState("");
    const {
        handleSubmit,
        control,
        watch,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            location: null,
            ledger: null,
        },
    });

    const getEntries = async (data) => {
        const response = await router.get(
            route("reports.historical.journal"),
            {
                location_id: data?.location?.value?.id,
                ledger_id: data?.ledger?.value?.id,
                start_date: dayjsFormatInputDate(startDate),
                end_date: dayjsFormatInputDate(endDate),
                type: data?.ledger?.value?.child_account?.parent_account
                    ?.coa_group_type,
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
        return response;
    };

    const debouncedSearch = useDebounce(searchLedger, 500);
    const { data, isFetching } = useGetLedgers(debouncedSearch, isMenuOpen);
    const options = data?.data?.data?.map((item) => ({
        label: `[${item?.ledger_code}] ${item?.ledger_name}`,
        value: item,
    }));
    console.log(data);

    const safeNumber = (val) => Number(val) || 0;

    let startBalance =
        safeNumber(start_balance) +
        safeNumber(total_in_range_before?.total_debit) -
        safeNumber(total_in_range_before?.total_credit);

    startBalance =
        watch("ledger")?.child_account?.parent_account?.coa_group_type ==
        "Neraca"
            ? startBalance
            : 0;

    const saldoAkhir =
        startBalance +
        safeNumber(total_in_range?.total_debit) -
        safeNumber(total_in_range?.total_credit);
    return (
        <Card title={"Laporan Historical Journal"} noborder>
            <Head title="Laporan Historical Journal" />
            <div className="grid grid-cols-12 gap-4">
                <div className="lg:col-span-3 col-span-12">
                    <SelectComponent
                        name={"location"}
                        form={true}
                        control={control}
                        error={errors.location?.message}
                        label={"Pilih Lokasi"}
                        className="react-select"
                        classNamePrefix="select"
                        options={auth.user?.locations?.map((item) => ({
                            label: `${item?.code}-${item?.location_name}`,
                            value: item,
                        }))}
                    />
                </div>
                <div className="lg:col-span-3 col-span-12">
                    <SelectComponent
                        label={"Pilih Ledger"}
                        options={options || []}
                        onInputChange={(e) => setSearchLedger(e)}
                        isLoading={isFetching}
                        form={true}
                        control={control}
                        name={"ledger"}
                        onMenuOpen={() => setIsMenuOpen(true)}
                        onMenuClose={() => setIsMenuOpen(false)}
                    />
                </div>
                <div className="lg:col-span-3 col-span-12">
                    <DatePicker
                        value={startDate}
                        label={"Tanggal Mulai"}
                        onChange={(event) => {
                            setStartDate(event);
                        }}
                    />
                </div>
                <div className="lg:col-span-3 col-span-12">
                    <DatePicker
                        value={endDate}
                        label={"Tanggal Akhir"}
                        onChange={(event) => {
                            setEndDate(event);
                        }}
                    />
                </div>
            </div>
            <div className="flex flex-wrap mt-2">
                <Button
                    className="btn-dark py-2 px-4"
                    text="Filter"
                    onClick={handleSubmit(getEntries)}
                />
            </div>
            <div className="space-y-3 mt-5">
                {isLoading ? (
                    <>
                        <LoaderCircle />
                    </>
                ) : journals?.length == 0 ? null : (
                    <div className="grid grid-cols-12 gap-x-6 gap-y-2">
                        <div className="col-span-6"></div>
                        <div className="col-span-6">
                            <Search
                                value={searchJournal}
                                onChange={(e) => setSearchJournal(e)}
                                placeholder="Cari keterangan atau no. bukti..."
                            />
                        </div>
                        <div className="col-span-12">
                            <Table
                                headers={headerHistoricalJournal}
                                data={journals?.entry_items
                                    ?.filter((item) => {
                                        const search =
                                            searchJournal.toLowerCase();

                                        const note =
                                            item?.notes?.toLowerCase() || "";
                                        const ledgerCode =
                                            journals?.ledger_code?.toLowerCase() ||
                                            "";
                                        const ledgerName =
                                            journals?.ledger_name?.toLowerCase() ||
                                            "";
                                        const debit = (
                                            item?.debit || 0
                                        ).toString();
                                        const credit = (
                                            item?.credit || 0
                                        ).toString();
                                        const docNumber =
                                            item?.entry?.document_number?.toLowerCase() ||
                                            "";

                                        return (
                                            note.includes(search) ||
                                            ledgerCode.includes(search) ||
                                            ledgerName.includes(search) ||
                                            debit.includes(search) ||
                                            credit.includes(search) ||
                                            docNumber.includes(search)
                                        );
                                    })
                                    ?.map((item) => ({
                                        ...item,
                                        date: dayJsFormatDate(item?.entry_date),
                                        document_number:
                                            item?.entry?.document_number,
                                        code: journals?.ledger_code,
                                        ledger: journals?.ledger_name,
                                        note: item?.notes,
                                        debit: formatRupiah(item?.debit),
                                        credit: formatRupiah(item?.credit),
                                    }))}
                            />
                        </div>
                        <div className="col-span-12">
                            <hr />
                        </div>
                        <div className="col-span-12">
                            <div className="space-y-1 text-sm font-semibold">
                                <div className="grid grid-cols-[8rem_1rem_1fr]">
                                    <span>Saldo Awal</span>
                                    <span>:</span>
                                    <span>{formatRupiah(startBalance)}</span>
                                </div>
                                <div className="grid grid-cols-[8rem_1rem_1fr]">
                                    <span>Total Debit</span>
                                    <span>:</span>
                                    <span>
                                        {formatRupiah(
                                            total_in_range?.total_debit,
                                        )}
                                    </span>
                                </div>
                                <div className="grid grid-cols-[8rem_1rem_1fr]">
                                    <span>Total Kredit</span>
                                    <span>:</span>
                                    <span>
                                        {formatRupiah(
                                            total_in_range?.total_credit,
                                        )}
                                    </span>
                                </div>
                                <div className="grid grid-cols-[8rem_1rem_1fr]">
                                    <span>Saldo Akhir</span>
                                    <span>:</span>
                                    <span>{formatRupiah(saldoAkhir)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </Card>
    );
}

const headerHistoricalJournal = [
    {
        title: "date",
        key: "date",
    },
    {
        title: "No. Bukti",
        key: "document_number",
    },
    {
        title: "Code",
        key: "code",
    },
    {
        title: "Ledger",
        key: "ledger",
    },
    {
        title: "Keterangan",
        key: "note",
    },
    {
        title: "Debit",
        key: "debit",
    },
    {
        title: "Kredit",
        key: "credit",
    },
];

export default HistoricalJournal;
