/* eslint-disable react/prop-types */
import React from "react";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import SelectComponent from "@/components/ui/Master/Select";
import ModalAddUser from "@/components/ui/Modal/ModalAddUser";
import Pagination from "@/components/ui/Pagination";
import Search from "@/components/ui/Search";
import Select from "@/components/ui/Select";
import Table from "@/components/ui/Table";
import createStore from "@/context";
import { Head, router, usePage } from "@inertiajs/react";
import { useEffect, useState } from "react";

export default function ListUser({ locations, years }) {
    const [paging, setPaging] = useState({
        totalPage: 10,
        currentPage: 1,
    });
    const { filters, users } = usePage().props;

    const [status, setStatus] = useState(null);
    const [isSearch, setIsSearch] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const [search, setSearch] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [dealerMenuOpen, setDealerMenuOpen] = useState(false);
    const [selectedDealer, setSelectedDealer] = useState(null);

    const { handleModal } = createStore();

    const getUsers = async () => {
        const response = await router.get(
            route("list.users"),
            {
                q: search,
                status: status === "all" ? "" : status,
                limit: paging.totalPage,
                page: paging.currentPage,
                location_id: {
                    label: selectedDealer?.value?.location_name,
                    value: selectedDealer?.value?.id,
                },
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
        if (filters.dealer_id) {
            console.log(filters.dealer_id);
            if (filters.dealer_id) {
                const dealers = filters.dealer_id;
                setSelectedDealer({
                    label: dealers.label,
                    value: {
                        dealer_id: dealers.value?.dealer_id,
                    },
                });
            }
        }
        if (filters.status) {
            const status = filters.status;

            if (status) {
                setStatus(status);
            }
        }
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

    const handlePageChange = async (page) => {
        await setPaging((prevState) => ({
            ...prevState,
            currentPage: page,
        }));
        await setIsMounted(true);
    };

    useEffect(() => {
        if (isMounted) {
            if (isSearch) {
                const timeoutId = setTimeout(() => {
                    getUsers();
                    setIsSearch(false);
                    setIsMounted(false);
                }, 500);
                return () => clearTimeout(timeoutId);
            } else {
                getUsers();
            }
            setIsMounted(false);
        }
    }, [isMounted, status, search, paging.currentPage, paging.totalPage]);

    const handleFilterChange = async () => {
        await setPaging((prevState) => ({
            ...prevState,
            currentPage: 1,
        }));
        await setIsMounted(true);
    };

    const handleChangeDealerMenuOpen = () => {
        setDealerMenuOpen(!dealerMenuOpen);
    };

    return (
        <Card
            title={"List User"}
            headerslot={
                <Button
                    text={"Add New User"}
                    className="btn-dark"
                    onClick={() => handleModal("modalAddUser", true)}
                />
            }
            noborder
        >
            <ModalAddUser locations={locations} years={years} />
            <Head title="List User" />
            <div className="space-y-6">
                <div className="grid grid-cols-12 gap-6">
                    <div className="col-span-4">
                        <Select
                            label={"Status"}
                            placeholder={"Pilih Status"}
                            options={[
                                {
                                    label: "Semua",
                                    value: "all",
                                },
                                {
                                    label: "Active",
                                    value: "1",
                                },
                                {
                                    label: "Non-Active",
                                    value: "0",
                                },
                            ]}
                            value={status}
                            onChange={(e) => {
                                setStatus(e.target.value);
                                handleFilterChange();
                            }}
                        />
                    </div>
                    <div className="col-span-4">
                        <SelectComponent
                            // isLoading={isLoadingDealer}
                            label={"Lokasi"}
                            options={locations?.map((item) => ({
                                label: item?.location_name,
                                value: item,
                            }))}
                            placeholder={"Pilih Lokasi"}
                            onMenuOpen={handleChangeDealerMenuOpen}
                            value={selectedDealer}
                            onChange={(e) => {
                                setSelectedDealer(e);
                                handleFilterChange();
                            }}
                        />
                    </div>
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
                            headers={headerUser}
                            data={users?.data?.map((item, index) => ({
                                no: (
                                    <span>
                                        {(paging?.currentPage - 1) *
                                            parseInt(paging.totalPage) +
                                            index +
                                            1}
                                    </span>
                                ),
                                ...item,
                                status: (
                                    <Badge
                                        className={
                                            item?.status === 1
                                                ? "bg-success-500 text-white"
                                                : "bg-danger-500 text-white"
                                        }
                                    >
                                        {item?.status === 1
                                            ? "Active"
                                            : "Non-Active"}
                                    </Badge>
                                ),
                                location: (
                                    <span>
                                        {item?.locations
                                            ?.map((item) => item?.location_name)
                                            ?.join(", ")}
                                    </span>
                                ),
                                action: (
                                    <Button
                                        text={"Detail"}
                                        className="btn-outline-dark py-1"
                                        link={route("show.user", item?.user_id)}
                                    />
                                ),
                            }))}
                        />
                    </div>
                    <div className="col-span-12">
                        <Pagination
                            currentPage={paging.currentPage}
                            currentPageItems={users?.data?.length}
                            totalPages={users?.last_page}
                            totalItems={users?.per_page}
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

const headerUser = [
    {
        title: "no",
        key: "no",
    },
    {
        title: "Nama",
        key: "name",
    },
    {
        title: "username",
        key: "username",
    },
    {
        title: "Lokasi",
        key: "location",
    },
    {
        title: "Status",
        key: "status",
    },
    {
        title: "Action",
        key: "action",
    },
];
