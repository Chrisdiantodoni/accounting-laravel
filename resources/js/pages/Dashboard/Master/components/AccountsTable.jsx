import SkeletonTable from "@/components/skeleton/Table";
import Button from "@/components/ui/Button";
import { router } from "@inertiajs/react";
import React from "react";
import Swal from "sweetalert2";

const AccountsTable = ({ headers, data, isLoading, action, className }) => {
    const deleteAccounts = (id, type) => {
        if (type == "parents") {
            Swal.fire({
                title: "Apakah Anda yakin?",
                text: "Data Akun Induk yang dihapus tidak bisa dikembalikan!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#d33",
                cancelButtonColor: "#3085d6",
                confirmButtonText: "Ya, hapus!",
                cancelButtonText: "Batal",
            }).then((result) => {
                if (result.isConfirmed) {
                    router.delete(route("delete.parent.accounts", id));
                }
            });
        } else {
            Swal.fire({
                title: "Apakah Anda yakin?",
                text: "Data Akun Anak yang dihapus tidak bisa dikembalikan!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#d33",
                cancelButtonColor: "#3085d6",
                confirmButtonText: "Ya, hapus!",
                cancelButtonText: "Batal",
            }).then((result) => {
                if (result.isConfirmed) {
                    router.delete(route("delete.child.accounts", id));
                }
            });
        }
    };

    return (
        <div className="overflow-x-auto">
            {isLoading ? (
                <SkeletonTable count={headers.length} headers={headers} />
            ) : (
                <table className="min-w-full divide-y divide-slate-100 table-fixed dark:divide-slate-700">
                    <thead className="whitespace-nowrap bg-slate-200 dark:bg-slate-700">
                        <tr>
                            {headers.map((item, index) => (
                                <th
                                    key={index}
                                    scope="col"
                                    className={`table-th py-3`}
                                >
                                    {item.title}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-100 dark:bg-slate-800 dark:divide-slate-700 min-h-52">
                        {data?.length > 0 ? (
                            data.map((item, index) => (
                                <React.Fragment key={index}>
                                    {/* Parent row */}
                                    <tr
                                        className="border-t border-stroke py-4.5 px-4 md:px-6 2xl:px-7.5 items-center"
                                        key={index}
                                    >
                                        <td
                                            className={`table-td text-sm items-center text-black py-2`}
                                        >
                                            {item.parent_account_code}
                                        </td>
                                        <td
                                            className={`table-td text-sm items-center text-black py-2`}
                                        >
                                            {item.parent_account_name}
                                        </td>
                                        <td
                                            className={`table-td text-sm items-center text-black py-2`}
                                        >
                                            {item.coa_group}
                                        </td>
                                        <td
                                            className={`table-td text-sm items-center text-black py-2`}
                                        ></td>
                                        <td
                                            className={`table-td text-sm items-center text-black py-2`}
                                        >
                                            <Button
                                                icon={"mdi:trash"}
                                                className="p-1 btn-danger"
                                                onClick={() =>
                                                    deleteAccounts(
                                                        item?.id,
                                                        "parents",
                                                    )
                                                }
                                            />
                                        </td>
                                    </tr>

                                    {/* Child rows */}
                                    {item.child_accounts?.map((child, idx) => (
                                        <tr
                                            key={`child-${idx}`}
                                            className="border-t border-stroke py-4.5 px-4 md:px-6 2xl:px-7.5 "
                                        >
                                            <td
                                                className={`table-td text-sm  text-black py-2 px-10`}
                                            >
                                                {child.child_account_code}
                                            </td>
                                            <td
                                                className={`table-td text-sm items-center text-black py-2`}
                                            >
                                                {child.child_account_name}
                                            </td>
                                            <td
                                                className={`table-td text-sm items-center text-black py-2`}
                                            >
                                                {item.coa_group}
                                            </td>
                                            <td
                                                className={`table-td text-sm items-center text-black py-2`}
                                            >
                                                {child.location?.code}{" "}
                                                {child.location?.location_name}
                                            </td>
                                            <td
                                                className={`table-td text-sm items-center text-black py-2`}
                                            >
                                                <Button
                                                    icon={"mdi:trash"}
                                                    className="p-1 btn-danger"
                                                    onClick={() =>
                                                        deleteAccounts(
                                                            child?.id,
                                                            "childs",
                                                        )
                                                    }
                                                />
                                            </td>
                                        </tr>
                                    ))}
                                </React.Fragment>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan={headers.length}
                                    className="text-center py-4"
                                >
                                    Tidak ada data tersedia
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default AccountsTable;
