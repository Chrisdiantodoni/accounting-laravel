import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import ModalLedger from "@/components/ui/Modal/ModalLedger";
import Pagination from "@/components/ui/Pagination";
import Search from "@/components/ui/Search";
import Select from "@/components/ui/Select";
import Table from "@/components/ui/Table";
import { dayJsFormatDate } from "@/utils/dayjs";
import { formatRupiah } from "@/utils/formatter";
import { Head, router, usePage } from "@inertiajs/react";
import React, { useEffect, useState } from "react";

export default function ListCloseBook() {
    const { filters, closings } = usePage().props;

    const [search, setSearch] = useState("");
    const [isSearch, setIsSearch] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [paging, setPaging] = useState({
        currentPage: 1,
        totalPage: 10,
    });

    const ClosingBook = async () => {
        await router.post(route("close.book"));
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
        <Card
            title={"Daftar Tutup Buku"}
            headerslot={
                <div className="space-x-2">
                    <Button
                        icon={"material-symbols:add"}
                        text={"Tutup Buku"}
                        className="btn-outline-dark p-2"
                        onClick={ClosingBook}
                    />
                </div>
            }
            noborder
        >
            <ModalLedger />
            <Head title="Daftar Tutup Buku" />
            <div className="space-y-6">
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
                                location: item?.location?.location_name,
                                user: item?.user?.name,
                                debit: formatRupiah(item?.debit),
                                credit: formatRupiah(item?.credit),
                                created_at: dayJsFormatDate(item?.created_at),
                                action: (
                                    <Button
                                        text={"Detail"}
                                        className="btn-outline-dark py-1"
                                        link={route("show.entries", item?.id)}
                                    />
                                ),
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
        key: "document_number",
    },
    {
        title: "Bulan",
        key: "location",
    },
    {
        title: "Tahun",
        key: "location",
    },
    {
        title: "Staff",
        key: "user",
    },
    {
        title: "Action",
        key: "debit",
    },
    {
        title: "Notes",
        key: "credit",
    },
];
