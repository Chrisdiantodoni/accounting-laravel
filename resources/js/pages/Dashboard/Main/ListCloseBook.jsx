import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import SelectComponent from "@/components/ui/Master/Select";
import Pagination from "@/components/ui/Pagination";
import Search from "@/components/ui/Search";
import Select from "@/components/ui/Select";
import Table from "@/components/ui/Table";
import { dayjsFormatDateTime } from "@/utils/dayjs";
import { yupResolver } from "@hookform/resolvers/yup";
import { Head, router, usePage } from "@inertiajs/react";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import * as yup from "yup";

const schema = yup.object().shape({
    location: yup.object().nullable().required("Lokasi wajib dipilih"),
});

export default function ListCloseBook() {
    const { filters, closings, auth } = usePage().props;

    const [search, setSearch] = useState("");
    const [isSearch, setIsSearch] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [paging, setPaging] = useState({
        currentPage: 1,
        totalPage: 10,
    });

    const {
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

    const ClosingBook = async (data) => {
        Swal.fire({
            title: "Yakin ingin tutup buku?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Ya, tutup!",
            cancelButtonText: "Batal",
        }).then(async (result) => {
            if (result.isConfirmed) {
                await router.post(route("close.book"), {
                    month: data.monthYear,
                    location_id: data.location?.value?.id,
                });
            }
        });
    };
    const openBook = async (data) => {
        Swal.fire({
            title: "Yakin ingin buka buku?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Ya, buka!",
            cancelButtonText: "Batal",
        }).then(async (result) => {
            if (result.isConfirmed) {
                await router.post(route("open.book"), {
                    month: data.monthYear,
                    location_id: data.location?.value?.id,
                });
            }
        });
    };

    const getEntries = async () => {
        const response = await router.get(
            route("list.close.book"),
            {
                q: search,
                limit: paging.totalPage,
                page: paging.currentPage,
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
        if (isMounted) {
            if (isSearch) {
                const timeoutId = setTimeout(() => {
                    getEntries();
                    setIsSearch(false);
                    setIsMounted(false);
                }, 500);
                return () => clearTimeout(timeoutId);
            } else {
                getEntries();
            }
            setIsMounted(false);
        }
    }, [isMounted, paging.currentPage, paging.totalPage, search]);

    const handlePageChange = async (page) => {
        await setPaging((prevState) => ({
            ...prevState,
            currentPage: page,
        }));
        await setIsMounted(true);
    };

    const handleFilterChange = async () => {
        await setPaging((prevState) => ({
            ...prevState,
            currentPage: 1,
        }));
        await setIsMounted(true);
    };

    useEffect(() => {
        if (filters.q) {
            setSearch(filters.q);
        }
        if (filters.limit) {
            setPaging((prev) => ({
                ...prev,
                totalPage: filters.limit,
            }));
        }
    }, [filters]);

    return (
        <Card title={"Daftar Tutup Buku"} noborder>
            <Head title="Daftar Tutup Buku" />

            <div className="space-y-6">
                <div className="grid grid-cols-12 gap-6">
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
                    <div className="lg:col-span-6 col-span-12 flex flex-wrap gap-4 items-end">
                        <Button
                            icon="material-symbols:lock"
                            text="Tutup Buku"
                            className="btn-outline-dark p-2"
                            onClick={handleSubmit(ClosingBook)}
                        />
                        <Button
                            icon="material-symbols:lock-open"
                            text="Buka Buku"
                            className="btn-dark p-2"
                            onClick={handleSubmit(openBook)}
                        />
                    </div>
                </div>
                <div className="grid grid-cols-12 gap-6">
                    <div className="col-span-12">
                        <div className="grid grid-cols-12 gap-5">
                            <div className="col-span-12 lg:col-span-6  flex-wrap lg:flex gap-2 items-center">
                                <p>Show</p>
                                <Select
                                    placeholder=""
                                    options={[
                                        { label: "10", value: "10" },
                                        { label: "25", value: "25" },
                                        { label: "50", value: "50" },
                                    ]}
                                    className="w-full lg:w-20 min-w-min"
                                    value={paging.totalPage}
                                    onChange={(e) => {
                                        setPaging((prevState) => ({
                                            ...prevState,
                                            totalPage: e.target.value,
                                        }));
                                        handleFilterChange();
                                    }}
                                />
                                <p>Entries</p>
                            </div>
                            <div className="col-span-12 lg:col-span-6">
                                <Search
                                    value={search}
                                    onChange={(e) => {
                                        setSearch(e);
                                        setIsSearch(true);
                                        handleFilterChange();
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="col-span-12">
                        <Table
                            isLoading={isLoading}
                            headers={headersEntry}
                            data={closings?.data?.map((item, index) => ({
                                no: (
                                    <span>
                                        {(paging?.currentPage - 1) *
                                            parseInt(paging.totalPage) +
                                            index +
                                            1}
                                    </span>
                                ),
                                ...item,
                                created_at: dayjsFormatDateTime(
                                    item?.created_at,
                                ),
                                month: months[item?.month - 1],
                                location: item?.location?.location_name,
                                user: item?.user?.name,
                            }))}
                        />
                    </div>
                    <div className="col-span-12">
                        <Pagination
                            currentPage={paging.currentPage}
                            currentPageItems={closings?.data?.length}
                            totalPages={closings?.last_page}
                            totalItems={closings?.per_page}
                            handlePageChange={(page) => {
                                handlePageChange(page);
                            }}
                        />
                    </div>
                </div>
            </div>
        </Card>
    );
}

const headersEntry = [
    {
        title: "no",
        key: "no",
    },
    {
        title: "Waktu",
        key: "created_at",
    },
    {
        title: "Lokasi",
        key: "location",
    },
    {
        title: "Bulan",
        key: "month",
    },
    {
        title: "Tahun",
        key: "year",
    },
    {
        title: "Staff",
        key: "user",
    },
    {
        title: "Action",
        key: "action",
    },
    {
        title: "Notes",
        key: "notes",
    },
];
