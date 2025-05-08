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

function BalanceSheet() {
    const { data, auth, filters } = usePage().props;
    const [isLoading, setIsLoading] = useState(false);

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
            route("reports.balance.sheet"),
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

    console.log(data);

    return (
        <Card title={"Laporan Neraca"} noborder>
            <Head title="Laporan Neraca" />
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
                                    <tbody className="bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-100 text-sm">
                                        {Object.entries(data).map(
                                            ([category, daftarAkun], index) => {
                                                const colors = [
                                                    "bg-blue-50 dark:bg-blue-900",
                                                    "bg-green-50 dark:bg-green-900",
                                                    "bg-yellow-50 dark:bg-yellow-900",
                                                    "bg-purple-50 dark:bg-purple-900",
                                                    "bg-pink-50 dark:bg-pink-900",
                                                    "bg-teal-50 dark:bg-teal-900",
                                                ];
                                                const categoryColor =
                                                    colors[
                                                        index % colors.length
                                                    ];

                                                return (
                                                    <React.Fragment
                                                        key={category}
                                                    >
                                                        <tr
                                                            className={`${categoryColor}`}
                                                        >
                                                            <td
                                                                colSpan="2"
                                                                className="px-4 py-2 font-semibold uppercase text-xs tracking-wider"
                                                            >
                                                                {category}
                                                            </td>
                                                        </tr>
                                                        {daftarAkun.map(
                                                            (akun, idx) => (
                                                                <tr
                                                                    key={idx}
                                                                    className="border-t border-slate-200 dark:border-slate-700"
                                                                >
                                                                    <td className="px-4 py-2">
                                                                        {
                                                                            akun.ledger_name
                                                                        }
                                                                    </td>
                                                                    <td className="px-4 py-2 text-right">
                                                                        {formatRupiah(
                                                                            akun.total_debit -
                                                                                akun?.total_kredit,
                                                                        )}
                                                                    </td>
                                                                </tr>
                                                            ),
                                                        )}
                                                    </React.Fragment>
                                                );
                                            },
                                        )}
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

export default BalanceSheet;
