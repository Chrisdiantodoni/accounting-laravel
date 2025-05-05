import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import ModalCoa from "@/components/ui/Modal/ModalCoa";
import Pagination from "@/components/ui/Pagination";
import Search from "@/components/ui/Search";
import Select from "@/components/ui/Select";
import Table from "@/components/ui/Table";
import createStore from "@/context";
import { Head, router, usePage } from "@inertiajs/react";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";

export default function ListCoa() {
    const { filters, coa } = usePage().props;
    const { handleModal } = createStore();
    console.log({ coa });

    const [search, setSearch] = useState("");
    const [isSearch, setIsSearch] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [paging, setPaging] = useState({
        currentPage: 1,
        totalPage: 10,
    });

    const getCoa = async () => {
        const response = await router.get(
            route("list.coa"),
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
                    getCoa();
                    setIsSearch(false);
                    setIsMounted(false);
                }, 500);
                return () => clearTimeout(timeoutId);
            } else {
                getCoa();
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
        handleModal("modalCoa", true);
    };

    const deleteCoa = (id) => {
        Swal.fire({
            title: "Apakah Anda yakin?",
            text: "Data COA yang dihapus tidak bisa dikembalikan!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Ya, hapus!",
            cancelButtonText: "Batal",
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(route("delete.coa", id));
            }
        });
    };
    return (
        <Card
            title={"Daftar Group Perkiraan"}
            headerslot={
                <div className="space-x-2">
                    <Button
                        icon={"material-symbols:add"}
                        text={"Buat Group Perkiraan"}
                        className="btn-outline-dark p-2"
                        onClick={() => ShowModal()}
                    />
                </div>
            }
            noborder
        >
            <ModalCoa />
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
                        <Table
                            isLoading={isLoading}
                            headers={headers}
                            data={coa?.data?.map((item, index) => ({
                                no: (
                                    <span>
                                        {(paging?.currentPage - 1) *
                                            parseInt(paging.totalPage) +
                                            index +
                                            1}
                                    </span>
                                ),
                                ...item,

                                action: (
                                    <Button
                                        icon={"mdi:trash"}
                                        className="p-1 btn-danger"
                                        onClick={() => deleteCoa(item?.id)}
                                    />
                                ),
                            }))}
                        />
                    </div>
                    <div className="col-span-12">
                        <Pagination
                            currentPage={paging.currentPage}
                            currentPageItems={coa?.data?.length}
                            totalPages={coa?.last_page}
                            totalItems={coa?.per_page}
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

const headers = [
    {
        title: "no",
        key: "no",
    },
    {
        title: "Kode Group",
        key: "group_code",
    },
    {
        title: "Ket. Group",
        key: "group_description",
    },
    {
        title: "Jenis Group",
        key: "group_type",
    },
    {
        title: "Kode Akun Bawah",
        key: "lower_account_code",
    },
    {
        title: "Kode Akun Atas",
        key: "upper_account_code",
    },
    {
        title: "Action",
        key: "action",
    },
];
