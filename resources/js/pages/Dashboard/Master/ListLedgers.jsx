import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import ModalLedger from "@/components/ui/Modal/ModalLedger";
import Pagination from "@/components/ui/Pagination";
import Search from "@/components/ui/Search";
import Select from "@/components/ui/Select";
import Table from "@/components/ui/Table";
import createStore from "@/context";
import { Head, router, usePage } from "@inertiajs/react";
import React, { useEffect, useState } from "react";

export default function ListLedgers() {
    const { filters, ledgers } = usePage().props;
    const { handleModal } = createStore();

    const [search, setSearch] = useState("");
    const [isSearch, setIsSearch] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [paging, setPaging] = useState({
        currentPage: 1,
        totalPage: 10,
    });

    const getLedgers = async () => {
        const response = await router.get(
            route("list.ledgers"),
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
                    getLedgers();
                    setIsSearch(false);
                    setIsMounted(false);
                }, 500);
                return () => clearTimeout(timeoutId);
            } else {
                getLedgers();
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

    const ShowModal = () => {
        handleModal("modalLedgers", true);
    };

    return (
        <Card
            title={"Daftar Ledger"}
            headerslot={
                <div className="space-x-2">
                    <Button
                        icon={"material-symbols:add"}
                        text={"Buat Ledger"}
                        className="btn-outline-dark p-2"
                        onClick={() => ShowModal()}
                    />
                </div>
            }
            noborder
        >
            <ModalLedger />
            <Head title="Daftar Ledger" />
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
                            headers={headerLedgers}
                            data={ledgers?.data?.map((item, index) => ({
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
                                action: (
                                    <Button
                                        text={"Detail"}
                                        className="btn-outline-dark py-1"
                                        onClick={() =>
                                            handleModal(
                                                "modalLedgers",
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
                            currentPageItems={ledgers?.data?.length}
                            totalPages={ledgers?.last_page}
                            totalItems={ledgers?.per_page}
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

const headerLedgers = [
    {
        title: "no",
        key: "no",
    },
    {
        title: "Kode Akun",
        key: "ledger_code",
    },
    {
        title: "Nama Akun",
        key: "ledger_name",
    },
    {
        title: "Lokasi",
        key: "location",
    },
    {
        title: "Action",
        key: "action",
    },
];
