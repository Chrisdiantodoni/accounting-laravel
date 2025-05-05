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

    const monthOptions = [
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
    ].map((month, index) => ({
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
            <div className="space-y-6">
                {isLoading ? (
                    <>
                        <LoaderCircle />
                    </>
                ) : (
                    <div className="grid grid-cols-12 gap-6">
                        <div className="col-span-12">
                            {JSON.stringify(data)}
                        </div>
                    </div>
                )}
            </div>
        </Card>
    );
}

export default ProfitLoss;
