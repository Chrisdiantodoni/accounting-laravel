import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import DatePicker from "@/components/ui/DatePicker";
import ModalLedger from "@/components/ui/Modal/ModalLedger";
import Pagination from "@/components/ui/Pagination";
import Search from "@/components/ui/Search";
import Select from "@/components/ui/Select";
import Table from "@/components/ui/Table";
import { dayJsFormatDate, dayjsFormatInputDate } from "@/utils/dayjs";
import { formatRupiah } from "@/utils/formatter";
import { Head, router, usePage } from "@inertiajs/react";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";

export default function ListPosting() {
    const { filters, postings } = usePage().props;
    const now = dayjs().format("YYYY-MM-DD");
    const oneMonthBefore = dayjs().subtract(1, "month").format("YYYY-MM-DD");
    const [startDate, setStartDate] = useState(oneMonthBefore || "");
    const [endDate, setEndDate] = useState(now || "");
    const [search, setSearch] = useState("");
    const [isSearch, setIsSearch] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [paging, setPaging] = useState({
        currentPage: 1,
        totalPage: 10,
    });

    const getEntries = async () => {
        const response = await router.get(
            route("list.postings"),
            {
                q: search,
                limit: paging.totalPage,
                page: paging.currentPage,
                start_date: dayjsFormatInputDate(startDate),
                end_date: dayjsFormatInputDate(endDate),
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
    }, [
        isMounted,
        paging.currentPage,
        paging.totalPage,
        search,
        startDate,
        endDate,
    ]);

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
        if (filters.start_date) {
            setStartDate(filters.start_date);
        }
        if (filters.end_date) {
            setEndDate(filters.end_date);
        }
        if (filters.limit) {
            setPaging((prev) => ({
                ...prev,
                totalPage: filters.limit,
            }));
        }
    }, [filters]);

    useEffect(() => {
        if (isMounted) {
            getEntries(); // Load pertama kali
        }
    }, []);

    return (
        <Card
            title={"Daftar Posting"}
            // headerslot={
            //     <div className="space-x-2">
            //         <Button
            //             icon={"material-symbols:add"}
            //             text={"Buat Entry"}
            //             className="btn-outline-dark p-2"
            //             link={route("add.entries")}
            //         />
            //     </div>
            // }
            noborder
        >
            <ModalLedger />
            <Head title="Daftar Posting" />
            <div className="space-y-6">
                <div className="grid grid-cols-12 gap-6">
                    <div className="lg:col-span-3 col-span-12">
                        <DatePicker
                            value={startDate}
                            label={"Tanggal Mulai"}
                            onChange={(event) => {
                                setStartDate(event);
                                handleFilterChange();
                            }}
                        />
                    </div>
                    <div className="lg:col-span-3 col-span-12">
                        <DatePicker
                            value={endDate}
                            label={"Tanggal Akhir"}
                            onChange={(event) => {
                                setEndDate(event);

                                handleFilterChange();
                            }}
                        />
                    </div>
                    <div className="col-span-6"></div>
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
                            data={postings?.data?.map((item, index) => ({
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
                                user: item?.user?.name ?? "SYSTEM",
                                debit: formatRupiah(item?.debit ?? 0),
                                credit: formatRupiah(item?.credit ?? 0),
                                created_at: dayJsFormatDate(item?.entries_date),

                                action: (
                                    <Button
                                        text={"Detail"}
                                        className="btn-outline-dark py-1"
                                        link={route("show.postings", item?.id)}
                                    />
                                ),
                            }))}
                        />
                    </div>
                    <div className="col-span-12">
                        <Pagination
                            currentPage={paging.currentPage}
                            currentPageItems={postings?.data?.length}
                            totalPages={postings?.last_page}
                            totalItems={postings?.per_page}
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
        title: "Tanggal",
        key: "created_at",
    },
    {
        title: "No. Bukti",
        key: "document_number",
    },
    {
        title: "Lokasi",
        key: "location",
    },
    {
        title: "Tgl. Edit",
        key: "edited_at",
    },
    {
        title: "User",
        key: "user",
    },
    {
        title: "Debet",
        key: "debit",
    },
    {
        title: "Kredit",
        key: "credit",
    },
    {
        title: "Action",
        key: "action",
    },
];
