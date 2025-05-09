/* eslint-disable react/prop-types */
import React from "react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import SelectComponent from "@/components/ui/Master/Select";
import Textinput from "@/components/ui/Textinput";

import { useEffect, useState } from "react";
import { router, useForm } from "@inertiajs/react";
import Badge from "@/components/ui/Badge";

export default function DetailUser({ user, locations, years }) {
    const [userLocation, setUserLocation] = useState([]);
    const [userYear, setUserYear] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingReset, setIsLoadingReset] = useState(false);

    const { data, setData, processing, put } = useForm({
        username: user?.username || "",
        name: user?.name || "",
    });

    useEffect(() => {
        if (user) {
            setData("username", user.username);
            setData("name", user.name);
            setUserLocation(
                user?.locations.map((item) => ({
                    label: item.location_name,
                    value: item,
                })),
            );
            setUserYear(
                user?.years.map((item) => ({
                    label: item.year,
                    value: item,
                })),
            );
        }
    }, [user]);

    const handleChangeUserStatus = () => {
        put(route("change.status.user", user?.user_id));
    };

    const handleResetPassword = () => {
        setIsLoadingReset(true);
        router.put(
            route("reset.password", user?.user_id),
            {},
            {
                onSuccess: (res) => {
                    if (res?.props?.flash?.message?.type === "success") {
                        setIsLoadingReset(false);
                    } else {
                        setIsLoadingReset(false);
                    }
                },
                onError: () => {
                    setIsLoadingReset(false);
                },
            },
        );
    };

    const handleEditUser = () => {
        setIsLoading(true);
        router.put(
            route("edit.user", user?.user_id),
            {
                ...data,
                locations: userLocation,
                years: userYear,
            },
            {
                onSuccess: (res) => {
                    if (res?.props?.flash?.message?.type === "success") {
                        setIsLoading(false);
                    } else {
                        setIsLoading(false);
                    }
                },
                onError: () => {
                    setIsLoading(false);
                },
            },
        );
    };

    // const groupPermissionsByGroupName = (permissions) => {
    //     return permissions.reduce((acc, permission) => {
    //         const { group_name } = permission;
    //         if (!acc[group_name]) {
    //             acc[group_name] = [];
    //         }
    //         acc[group_name].push(permission);
    //         return acc;
    //     }, {});
    // };

    // const permissionGroups = groupPermissionsByGroupName(permissions || []);

    return (
        <Card
            title={`Detail User`}
            subtitle={
                user?.status === 1 ? (
                    <Badge
                        className="bg-success-500 text-white"
                        label="Active"
                    ></Badge>
                ) : (
                    <Badge
                        className="bg-danger-500 text-white"
                        label="Non-Active"
                    ></Badge>
                )
            }
            headerslot={
                <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-x-5 gap-y-2">
                    <Button
                        text={user?.status === 1 ? "Non-Active" : "Active"}
                        onClick={handleChangeUserStatus}
                        isLoading={processing}
                        className={`py-2 ${
                            user?.status === 1 ? "btn-danger" : "btn-success"
                        }`}
                    />
                    <Button
                        text={"Reset Password"}
                        onClick={handleResetPassword}
                        isLoading={isLoadingReset}
                        className={`py-2 btn-danger`}
                        disabled={!user?.password_reset_at ? false : true}
                    />
                </div>
            }
        >
            <div className="grid grid-cols-12 gap-5">
                <div className="col-span-3">
                    <p className="detail-label">Nama User</p>
                </div>
                <div className="col-span-9 flex items-center gap-2">
                    <p className="detail-label hidden lg:block">:</p>
                    <p className="detail-label w-full">
                        <Textinput
                            value={data.name}
                            onChange={(e) => setData("name", e.target.value)}
                        />
                    </p>
                </div>
                <div className="col-span-3">
                    <p className="detail-label">Username</p>
                </div>
                <div className="col-span-9 flex items-center gap-2">
                    <p className="detail-label hidden lg:block">:</p>
                    <p className="detail-label w-full">
                        <Textinput value={data.username} />
                    </p>
                </div>

                <div className="col-span-3">
                    <p className="detail-label">Dealer</p>
                </div>
                <div className="col-span-9 flex items-center gap-2">
                    <p className="detail-label hidden lg:block">:</p>
                    <p className="detail-label w-full">
                        <SelectComponent
                            isMulti
                            closeMenuOnSelect={false}
                            options={locations
                                .filter(
                                    (location) =>
                                        !userLocation?.some(
                                            (selected) =>
                                                selected?.value?.id ===
                                                location?.id,
                                        ),
                                )
                                .map((location) => ({
                                    label: location?.location_name,
                                    value: location, // value pakai ID saja
                                }))}
                            value={userLocation}
                            onChange={(e) => setUserLocation(e)}
                        />
                    </p>
                </div>
                <div className="col-span-3">
                    <p className="detail-label">Tahun</p>
                </div>
                <div className="col-span-9 flex items-center gap-2">
                    <p className="detail-label hidden lg:block">:</p>
                    <p className="detail-label w-full">
                        <SelectComponent
                            isMulti
                            closeMenuOnSelect={false}
                            options={years
                                .filter(
                                    (year) =>
                                        !userYear?.some(
                                            (selected) =>
                                                selected?.value?.id ===
                                                year?.id,
                                        ),
                                )
                                .map((year) => ({
                                    label: year?.year,
                                    value: year, // value pakai ID saja
                                }))}
                            value={userYear}
                            onChange={(e) => setUserYear(e)}
                        />
                    </p>
                </div>
                {/* <div className="col-span-12">Wewenang</div>
                <div className="col-span-12">
                    {Object.entries(permissionGroups).map(
                        ([groupName, groupPermissions], index) => (
                            <div key={index}>
                                <span className="detail-label font-medium text-base">
                                    {groupName}
                                </span>
                                <div className="flex flex-wrap mt-2">
                                    {groupPermissions?.map((item) => (
                                        <div
                                            key={item?.id}
                                            className="flex flex-wrap p-2"
                                        >
                                            <Checkbox
                                                label={item?.alias_name}
                                                value={permissionUser.some(
                                                    (p) => p.id === item.id,
                                                )}
                                                onChange={(e) =>
                                                    handlePermissionChange(
                                                        e.target.checked,
                                                        item,
                                                    )
                                                }
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ),
                    )}
                </div> */}

                <div className="flex gap-x-2">
                    <Button
                        text={"Edit"}
                        className="btn-info py-2"
                        isLoading={isLoading}
                        onClick={() => handleEditUser()}
                    />
                    <Button
                        text={"Cancel"}
                        className="btn-danger py-2"
                        link={route("list.users")}
                    />
                </div>
            </div>
        </Card>
    );
}
