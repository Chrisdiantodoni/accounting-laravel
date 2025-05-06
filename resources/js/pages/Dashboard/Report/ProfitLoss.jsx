import LoaderCircle from "@/components/Loader-circle";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import SelectComponent from "@/components/ui/Master/Select";
import Select from "@/components/ui/Select";
import { Head, router, usePage } from "@inertiajs/react";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { formatRupiah } from "../../../utils/formatter";

const schema = yup.object().shape({
    monthYear: yup.string().required("Bulan wajib dipilih"),
    location: yup.object().nullable().required("Lokasi wajib dipilih"),
});

function ProfitLoss() {
    const { data, auth, filters } = usePage().props;
    const [isLoading, setIsLoading] = useState(false);
    console.log({ data });

    const {
        register,
        handleSubmit,
        control,
        watch,
        setValue,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            location: null,
            monthYear: "", // pastikan tidak langsung pilih Januari
        },
    });

    const totalPenjualanBersih = data?.sales?.reduce(
        (acc, ledger) => acc + ledger.total,
        0,
    );
    const totalCogs = data?.cogs?.reduce(
        (acc, ledger) => acc + ledger.total,
        0,
    );
    const totalLabaKotor = totalPenjualanBersih - totalCogs;
    const totalBiayaAdmDanUmum = data?.costs?.reduce(
        (acc, ledger) => acc + ledger.total,
        0,
    );
    const totalBiayaLain = data?.other_costs?.reduce(
        (acc, ledger) => acc + ledger.total,
        0,
    );
    const totalSeluruhBiaya = totalBiayaAdmDanUmum + totalBiayaLain;
    const totalLabaSebelumPendapatan = totalLabaKotor - totalSeluruhBiaya;
    const totalPendapatan = data?.revenues?.reduce(
        (acc, ledger) => acc + ledger.total,
        0,
    );
    const totalLabaSesudahPendapatan =
        totalLabaSebelumPendapatan + totalPendapatan;

    const sections = [
        {
            key: "sales",
            title: "Penjualan Bersih",
            totalLabel: "Total Penjualan Bersih",
            totalValue: totalPenjualanBersih,
        },
        {
            key: "cogs",
            title: "Harga Pokok Penjualan",
            totalLabel: "Total Harga Pokok Penjualan",
            totalValue: totalCogs,
        },
        {
            isSpecial: true,
            title: "Laba Kotor",
            totalValue: totalLabaKotor,
            highlight: true,
            bgColor:
                "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200",
        },
        {
            key: "costs",
            title: "Biaya - Biaya",
            totalLabel: "Total Biaya ADM & Umum",
            totalValue: totalBiayaAdmDanUmum,
        },
        {
            key: "other_costs",
            title: "Biaya Lain-lain",
            totalLabel: "Total Biaya Lain-lain",
            totalValue: totalBiayaLain,
        },
        {
            isSpecial: true,
            title: "Total Seluruh Biaya",
            totalValue: totalSeluruhBiaya,
            highlight: true,
            bgColor:
                "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200",
        },
        {
            isSpecial: true,
            title: "Laba Sebelum pendapatan",
            totalValue: totalLabaSebelumPendapatan,
            highlight: true,
            bgColor:
                "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200",
        },
        {
            key: "revenues",
            title: "Pendapatan",
            totalLabel: "Total Pendapatan",
            totalValue: totalPendapatan,
        },
        {
            isSpecial: true,
            title: "Laba Sesudah Pendapatan",
            totalValue: totalLabaSesudahPendapatan,
            highlight: true,
            bgColor:
                "bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200",
        },
    ];

    const yearUser = auth?.user?.years?.find(
        (find) => find?.pivot?.isSelected == 1,
    )?.year;

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

    useEffect(() => {
        if (filters?.location_id) {
            const findLocation = auth?.user?.locations.find(
                (find) => find?.id === filters?.location_id,
            );
            if (findLocation) {
                setValue("location", {
                    label: `${findLocation?.code}-${findLocation?.location_name}`,
                    value: findLocation,
                });
            }
        }
        if (filters?.month) {
            setValue("monthYear", filters?.month);
        }
    }, [filters]);

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
                ) : data?.length == 0 ? null : (
                    <div className="grid grid-cols-12 gap-6">
                        <div className="col-span-12">
                            <div className="overflow-x-auto rounded-xl shadow-md border border-slate-200 dark:border-slate-600">
                                <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700 table-fixed">
                                    <thead className="bg-slate-100 dark:bg-slate-800">
                                        <tr>
                                            <th className="table-th text-left py-3 px-4 text-sm font-semibold tracking-wide">
                                                Nama Perkiraan
                                            </th>
                                            <th className="table-th text-right py-3 px-4 text-sm font-semibold tracking-wide">
                                                {`${months[watch("monthYear") - 1]} ${yearUser}`}
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 text-sm">
                                        {sections.map((section, index) => (
                                            <React.Fragment key={index}>
                                                {section.key && (
                                                    <>
                                                        <tr className="bg-slate-200 dark:bg-slate-800">
                                                            <td
                                                                colSpan="2"
                                                                className="px-4 py-2 font-semibold text-sm underline"
                                                            >
                                                                {section.title}
                                                            </td>
                                                        </tr>
                                                        {data?.[
                                                            section.key
                                                        ]?.map(
                                                            (ledger, idx) => (
                                                                <tr
                                                                    key={idx}
                                                                    className="border-t border-slate-200 dark:border-slate-700"
                                                                >
                                                                    <td className="px-4 py-2">
                                                                        {
                                                                            ledger.ledger_name
                                                                        }
                                                                    </td>
                                                                    <td className="px-4 py-2 text-right">
                                                                        {formatRupiah(
                                                                            ledger.total,
                                                                        )}
                                                                    </td>
                                                                </tr>
                                                            ),
                                                        )}
                                                        <tr className="bg-slate-100 dark:bg-slate-700 font-medium">
                                                            <td className="px-4 py-2 text-left">
                                                                {
                                                                    section.totalLabel
                                                                }
                                                            </td>
                                                            <td className="px-4 py-2 text-right">
                                                                {formatRupiah(
                                                                    section.totalValue,
                                                                )}
                                                            </td>
                                                        </tr>
                                                    </>
                                                )}

                                                {section.isSpecial && (
                                                    <tr
                                                        className={`${section.bgColor} font-semibold`}
                                                    >
                                                        <td className="px-4 py-2">
                                                            {section.title}
                                                        </td>
                                                        <td className="px-4 py-2 text-right">
                                                            {formatRupiah(
                                                                section.totalValue,
                                                            )}
                                                        </td>
                                                    </tr>
                                                )}
                                            </React.Fragment>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </Card>
    );
}

export default ProfitLoss;
