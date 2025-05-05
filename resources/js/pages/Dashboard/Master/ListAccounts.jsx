import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import ModalChildAccount from "@/components/ui/Modal/ModalChildAccount";
import ModalParentAccount from "@/components/ui/Modal/ModalParentAccount";
import Pagination from "@/components/ui/Pagination";
import Search from "@/components/ui/Search";
import Select from "@/components/ui/Select";
import Table from "@/components/ui/Table";
import createStore from "@/context";
import { Head, router, usePage } from "@inertiajs/react";
import React, { useEffect, useState } from "react";
import AccountsTable from "./components/AccountsTable";

export default function ListAccounts() {
    const { filters, accounts } = usePage().props;
    const { handleModal } = createStore();
    console.log({ accounts });

    const [search, setSearch] = useState("");
    const [isSearch, setIsSearch] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [paging, setPaging] = useState({
        currentPage: 1,
        totalPage: 10,
    });

    const getListLocation = async () => {
        const response = await router.get(
            route("list.accounts"),
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
                    getListLocation();
                    setIsSearch(false);
                    setIsMounted(false);
                }, 500);
                return () => clearTimeout(timeoutId);
            } else {
                getListLocation();
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
        handleModal("modalParentAccount", true);
    };

    return (
        <Card
            title={"Daftar Akun"}
            headerslot={
                <div className="space-x-2">
                    <Button
                        icon={"material-symbols:add"}
                        text={"Buat Akun Induk"}
                        className="btn-outline-dark p-2"
                        onClick={() => ShowModal()}
                    />
                    <Button
                        icon={"material-symbols:add"}
                        text={"Buat Akun Anak"}
                        className="btn-dark p-2"
                        onClick={() => handleModal("modalChildAccount", true)}
                    />
                </div>
            }
            noborder
        >
            <ModalParentAccount />
            <ModalChildAccount />
            <Head title="Daftar Akun" />
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
                        <AccountsTable
                            headers={headersAccount}
                            isLoading={isLoading}
                            data={accounts?.data}
                        />
                        {/* <Table
                            isLoading={isLoading}
                            headers={headersAccount}
                            data={accounts?.data?.map((item, index) => ({
                                no: (
                                    <span>
                                        {(paging?.currentPage - 1) *
                                            parseInt(paging.totalPage) +
                                            index +
                                            1}
                                    </span>
                                ),
                                ...item,
                                code: item?.parent_account_code,
                                account: item?.parent_account_name,
                                coa: item?.coa_group,
                                action: (
                                    <Button
                                        text={"Detail"}
                                        className="btn-outline-dark py-1"
                                        onClick={() =>
                                            handleModal(
                                                "modalAddLocation",
                                                true,
                                                item,
                                            )
                                        }
                                    />
                                ),
                            }))}
                        /> */}
                    </div>
                    <div className="col-span-12">
                        <Pagination
                            currentPage={paging.currentPage}
                            currentPageItems={accounts?.data?.length}
                            totalPages={accounts?.last_page}
                            totalItems={accounts?.per_page}
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

const headersAccount = [
    {
        title: "Kode",
        key: "code",
    },
    {
        title: "Akun",
        key: "account",
    },
    {
        title: "Group Perkiraan",
        key: "coa",
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
