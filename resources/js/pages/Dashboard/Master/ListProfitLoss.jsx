import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Pagination from "@/components/ui/Pagination";
import Search from "@/components/ui/Search";
import Select from "@/components/ui/Select";
import Table from "@/components/ui/Table";
import { Head, router, usePage } from "@inertiajs/react";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";

export default function ListProfitLoss() {
    const { filters, profit_loss } = usePage().props;
    const [search, setSearch] = useState("");
    const [isSearch, setIsSearch] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [paging, setPaging] = useState({
        currentPage: 1,
        totalPage: 10,
    });

    useEffect(() => {
        if (isMounted) {
            if (isSearch) {
                const timeoutId = setTimeout(() => {
                    getListProfitLossStatements();
                    setIsSearch(false);
                    setIsMounted(false);
                }, 500);
                return () => clearTimeout(timeoutId);
            } else {
                getListProfitLossStatements();
            }
            setIsMounted(false);
        }
    }, [isMounted, paging.currentPage, paging.totalPage, search]);
    const getListProfitLossStatements = async () => {
        const response = await router.get(
            route("list.profitloss.statements"),
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

    const onDelete = async (item) => {
        Swal.fire({
            title: "Apakah Anda yakin?",
            text: "Template Laba Rugi yang dihapus tidak bisa dikembalikan!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Ya, hapus!",
            cancelButtonText: "Batal",
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(route("delete.profitloss.statements", item?.id));
            }
        });
    };

    return (
        <Card
            title={"Daftar Laba Rugi"}
            headerslot={
                <Button
                    text={"Tambah Laba Rugi"}
                    className="btn-dark"
                    link={route("add.profitloss.statements")}
                />
            }
            noborder
        >
            <Head title="Daftar Laba Rugi" />
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
                            headers={headerProfitLoss}
                            data={profit_loss?.data?.map((item, index) => ({
                                no: (
                                    <span>
                                        {(paging?.currentPage - 1) *
                                            parseInt(paging.totalPage) +
                                            index +
                                            1}
                                    </span>
                                ),
                                ...item,
                                location_name: item?.location?.location_name,
                                action: (
                                    <div className="flex-wrap space-x-2">
                                        <Button
                                            icon={"mdi:pencil"}
                                            className="btn-outline-primary p-1"
                                            link={route(
                                                "show.profitloss.statements",
                                                item?.id,
                                            )}
                                        />
                                        <Button
                                            icon={"mdi:trash"}
                                            className="btn-outline-danger p-1"
                                            onClick={() => onDelete(item)}
                                        />
                                    </div>
                                ),
                            }))}
                        />
                    </div>
                    <div className="col-span-12">
                        <Pagination
                            currentPage={paging.currentPage}
                            currentPageItems={profit_loss?.data?.length}
                            totalPages={profit_loss?.last_page}
                            totalItems={profit_loss?.per_page}
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

const headerProfitLoss = [
    {
        title: "no",
        key: "no",
    },
    {
        title: "Nama Lokasi",
        key: "location_name",
    },

    {
        title: "Action",
        key: "action",
    },
];
