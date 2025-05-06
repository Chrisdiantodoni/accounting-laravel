import LoaderCircle from "@/components/Loader-circle";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import SelectComponent from "@/components/ui/Master/Select";
import Select from "@/components/ui/Select";
import { Head, router, usePage } from "@inertiajs/react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const schema = yup.object().shape({
    monthYear: yup.string().required("Bulan wajib dipilih"),
    location: yup.object().nullable().required("Lokasi wajib dipilih"),
});

function ProfitLoss() {
    const { data, auth } = usePage().props;
    const [isLoading, setIsLoading] = useState(false);
    console.log({ data });

    const {
        register,
        handleSubmit,
        control,
        watch,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            location: null,
            monthYear: "", // pastikan tidak langsung pilih Januari
        },
    });

    console.log(watch("monthYear"));

    const yearUser = auth?.user?.years?.find(
        (find) => find?.pivot?.isSelected == 1,
    )?.year;

    const mappingProfitLoss = [
        {
            label: "PENJUALAN",
            value: "sales",
        },
        {
            label: "HARGA POKOK PENJUALAN",
            value: "cogs",
        },
        {
            label: "BIAYA - BIAYA",
            value: "costs",
        },
        {
            label: "BIAYA LAIN - LAIN",
            value: "other_costs",
        },
        {
            label: "PENDAPATAN",
            value: "revenues",
        },
    ];
    const months = [
        "Januari",
        "Februari",
        "Maret",
        "April",
        "Mei",
        "Juni",
        "Juli",
        "Agustus",
        "September",
        "Oktober",
        "November",
        "Desember",
    ];

    const monthOptions = months.map((month, index) => ({
        label: `${month} ${yearUser}`,
        value: String(index + 1),
    }));

    const getEntries = async (data) => {
        const response = await router.get(
            route("reports.profit.loss"),
            {
                location_id: data?.location?.value?.id,
                year: yearUser,
                month: data?.monthYear,
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

    return (
        <Card title={"Laporan Laba Rugi"} noborder>
            <Head title="Laporan Laba Rugi" />
            <div className="grid grid-cols-12 gap-4">
                <div className="col-span-3">
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
                <div className="col-span-3">
                    <Select
                        register={register}
                        placeholder="Pilih Bulan"
                        error={errors.monthYear?.message}
                        name={"monthYear"}
                        label={"Pilih Bulan"}
                        options={monthOptions}
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
            <div className="space-y-6 mt-5">
                {isLoading ? (
                    <>
                        <LoaderCircle />
                    </>
                ) : (
                    <div className="grid grid-cols-12 gap-6">
                        <div className="col-span-12">
                            <table className="min-w-full divide-y divide-slate-100 table-fixed dark:divide-slate-700 border border-slate-200">
                                <thead className="whitespace-nowrap bg-slate-200 dark:bg-slate-700">
                                    <tr>
                                        <th
                                            scope="col"
                                            className=" table-th py-3"
                                        >
                                            Nama Perkiraan
                                        </th>

                                        <th
                                            scope="col"
                                            className=" table-th py-3"
                                        >
                                            {`${months[watch("monthYear") - 1]} ${yearUser}`}
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className=" bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 ">
                                    {mappingProfitLoss.map((category) => (
                                        <React.Fragment key={category.value}>
                                            <tr className="bg-slate-100 dark:bg-slate-700">
                                                <td
                                                    colSpan="3"
                                                    className="table-th py-1 text-sm "
                                                >
                                                    {category.label}
                                                </td>
                                            </tr>
                                            {(data[category.value] || []).map(
                                                (ledger, index) => (
                                                    <tr
                                                        key={index}
                                                        className="border border-slate-200 dark:border-slate-600 text-xs"
                                                    >
                                                        <td className="table-td py-1">
                                                            {ledger.ledger_name}
                                                        </td>
                                                        <td className="table-td py-1">
                                                            {ledger.total_debit}
                                                        </td>
                                                    </tr>
                                                ),
                                            )}
                                        </React.Fragment>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </Card>
    );
}

export default ProfitLoss;
