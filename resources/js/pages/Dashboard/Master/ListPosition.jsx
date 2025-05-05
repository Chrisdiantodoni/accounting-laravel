import React from "react";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import ModalAddPosition from "@/components/ui/Modal/ModalAddPosition";
import Pagination from "@/components/ui/Pagination";
import Search from "@/components/ui/Search";
import Select from "@/components/ui/Select";
import Table from "@/components/ui/Table";
import createStore from "@/context";
import { useUserPermission } from "@/hooks/usePermission";
import { Head, router, usePage } from "@inertiajs/react";
import { useEffect, useState } from "react";

export default function ListPosition() {
    const [paging, setPaging] = useState({
        totalPage: 10,
        currentPage: 1,
    });
    const { hasPermission } = useUserPermission();

    const { filters, positions } = usePage().props;
    const [status, setStatus] = useState(null);
    const [isSearch, setIsSearch] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const [search, setSearch] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const { handleModal } = createStore();

    const getUsers = async () => {
        const response = await router.get(
            route("list.position"),
            {
                q: search,
                status: status === "all" ? "" : status,
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

    return (
        <Card
            title={"List Position"}
            headerslot={
                hasPermission("add_master_position") && (
                    <Button
                        text={"Add New Position"}
                        className="btn-dark"
                        onClick={() => handleModal("modalAddPosition", true)}
                    />
                )
            }
            noborder
        >
            <ModalAddPosition />
            <Head title="List Position" />
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
                                    value: "active",
                                },
                                {
                                    label: "Non-Active",
                                    value: "non-active",
                                },
                            ]}
                            value={status}
                            onChange={(e) => {
                                setStatus(e.target.value);
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
                            headers={headerPosition}
                            data={positions?.data?.map((item, index) => ({
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
                                            item?.status === "active"
                                                ? "bg-success-500 text-white"
                                                : "bg-danger-500 text-white"
                                        }
                                    >
                                        {item?.status === "active"
                                            ? "Active"
                                            : "Non-Active"}
                                    </Badge>
                                ),

                                action: (
                                    <Button
                                        disabled={
                                            hasPermission(
                                                "edit_master_position",
                                            )
                                                ? false
                                                : true
                                        }
                                        text={"Detail"}
                                        className="btn-outline-dark py-1"
                                        onClick={() =>
                                            handleModal(
                                                "modalAddPosition",
                                                true,
                                                item,
                                            )
                                        }
                                    />
                                ),
                            }))}
                        />
                    </div>
                    <div className="col-span-12">
                        <Pagination
                            currentPage={paging.currentPage}
                            currentPageItems={positions?.data?.length}
                            totalPages={positions?.last_page}
                            totalItems={positions?.per_page}
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

const headerPosition = [
    {
        title: "no",
        key: "no",
    },
    {
        title: "Nama Position",
        key: "position_name",
    },
    {
        title: "status",
        key: "status",
    },
    {
        title: "Action",
        key: "action",
    },
];
