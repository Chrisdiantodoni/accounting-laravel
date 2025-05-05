import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import SelectComponent from "@/components/ui/Master/Select";
import Pagination from "@/components/ui/Pagination";
import Search from "@/components/ui/Search";
import Select from "@/components/ui/Select";
import Table from "@/components/ui/Table";
import { Head, router, usePage } from "@inertiajs/react";
import { useEffect, useState } from "react";
import { useUserPermission } from "@/hooks/usePermission";
import { filter } from "lodash";

export default function ListEmployee() {
    const { filters, departments, positions, employees, auth } =
        usePage().props;
    const [department, setDepartment] = useState(null);
    const [dealers, setDealers] = useState(null);
    const [position, setPosition] = useState("");
    const [search, setSearch] = useState("");
    const [isSearch, setIsSearch] = useState(false);
    const [paging, setPaging] = useState({
        currentPage: 1,
        totalPage: 10,
    });
    const [isMounted, setIsMounted] = useState(false);
    const { hasPermission } = useUserPermission();
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (filters.department_id) {
            const findDepartment = departments.find(
                (find) => find.department_id === filters.department_id
            );
            if (findDepartment) {
                setDepartment({
                    label: findDepartment?.department_name,
                    value: findDepartment?.department_id,
                });
            }
        }
        if (filters.position_id) {
            const findPosition = positions.find(
                (find) => find.position_id === filters.position_id
            );
            if (findPosition) {
                setPosition({
                    label: findPosition?.position_name,
                    value: findPosition?.position_id,
                });
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
        if (filters.dealer_id) {
            setDealers({
                label: filters?.dealer_id?.label,
                value: filters?.dealer_id?.value,
            });
        }
    }, [filters]);

    useEffect(() => {
        if (isMounted) {
            if (isSearch) {
                const timeoutId = setTimeout(() => {
                    getListEmployee();
                    setIsSearch(false);
                    setIsMounted(false);
                }, 500);
                return () => clearTimeout(timeoutId);
            } else {
                getListEmployee();
            }
            setIsMounted(false);
        }
    }, [
        isMounted,
        department,
        position,
        paging.currentPage,
        paging.totalPage,
        search,
    ]);

    const getListEmployee = async () => {
        const response = await router.get(
            route("list.employee"),
            {
                q: search,
                department_id: department?.value,
                position_id: position?.value,
                limit: paging.totalPage,
                page: paging.currentPage,
                dealer_id: {
                    label: dealers?.value?.dealer_name,
                    value: dealers?.value?.dealer_id,
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
            }
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

    return (
        <Card
            title={"List Employee"}
            headerslot={
                hasPermission("add_new_employee") && (
                    <Button
                        text={"Add New Employee"}
                        className="btn-dark"
                        link={route("add.new.employee")}
                    />
                )
            }
            noborder
        >
            <Head title="List Employee" />
            <div className="space-y-6">
                <div className="grid grid-cols-12 gap-6">
                    <div className="col-span-3">
                        <SelectComponent
                            options={departments?.map((item) => ({
                                label: item?.department_name,
                                value: item?.department_id,
                            }))}
                            placeholder={"Pilih Departemen"}
                            label={"Departemen"}
                            value={department}
                            onChange={(e) => {
                                setDepartment(e);
                                handleFilterChange();
                            }}
                        />
                    </div>
                    <div className="col-span-3">
                        <SelectComponent
                            options={positions?.map((item) => ({
                                label: item?.position_name,
                                value: item?.position_id,
                            }))}
                            placeholder={"Pilih Jabatan"}
                            label={"Jabatan"}
                            value={position}
                            onChange={(e) => {
                                setPosition(e);
                                handleFilterChange();
                            }}
                        />
                    </div>
                    <div className="col-span-3">
                        <SelectComponent
                            options={auth?.user?.dealers?.map((item) => ({
                                label: item?.dealer_name,
                                value: item,
                            }))}
                            placeholder={"Pilih Dealer"}
                            label={"Dealer"}
                            value={dealers}
                            onChange={(e) => {
                                setDealers(e);
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
                            headers={headersEmployee}
                            data={employees?.data?.map((item, index) => ({
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
                                        disabled={
                                            hasPermission("show_employee")
                                                ? false
                                                : true
                                        }
                                        text={"Detail"}
                                        className="btn-outline-dark py-1"
                                        link={
                                            hasPermission("show_employee")
                                                ? route(
                                                      "show.employee",
                                                      item?.employee_id
                                                  )
                                                : "#"
                                        }
                                    />
                                ),
                            }))}
                        />
                    </div>
                    <div className="col-span-12">
                        <Pagination
                            currentPage={paging.currentPage}
                            currentPageItems={employees?.data?.length}
                            totalPages={employees?.last_page}
                            totalItems={employees?.per_page}
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

const headersEmployee = [
    { title: "No.", key: "no" },
    { title: "NIP.", key: "job_information.nip" },
    { title: "Nama Karyawan", key: "personal_information.full_name" },
    { title: "Dealer", key: "job_information.dealer_name" },
    { title: "Departemen", key: "job_information.department.department_name" },
    { title: "Jabatan", key: "job_information.position.position_name" },
    { title: "Status", key: "employee_status" },
    { title: "Aksi", key: "action" },
];
