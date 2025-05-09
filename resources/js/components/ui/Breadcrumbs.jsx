import React, { useState, useEffect } from "react";
import { menuItems } from "@/constant/data";
import Icon from "@/components/ui/Icon";
import { Link, usePage } from "@inertiajs/react";

const Breadcrumbs = () => {
    const pages = usePage();
    const locationName = pages.url.replace("/", "");
    const currentLocationName = pages.url
        .replace(/^\/|\/$/g, "") // Remove leading and trailing slashes
        .replace(/-/g, " ") // Replace dashes with spaces
        .replace(/\?.*$/, "") // Remove query parameters
        .replace(/&.*$/, ""); // Remove additional query parameters

    // Split the URL by slashes
    const segments = currentLocationName.split("/");

    // Remove the last segment
    segments.pop();

    // Join the remaining segments back together
    const finalLocationName = segments.join("/");

    const [isHide, setIsHide] = useState(null);
    const [groupTitle, setGroupTitle] = useState("");

    useEffect(() => {
        const currentMenuItem = menuItems.find(
            (item) => item?.link === locationName
        );

        const currentChild = menuItems.find((item) => {
            item.child?.find((child) => child?.link === finalLocationName);
        });
        console.log(locationName);

        if (currentMenuItem) {
            setIsHide(currentMenuItem.isHide);
        } else if (currentChild) {
            setIsHide(currentChild?.isHide || false);
            setGroupTitle(currentChild?.title);
        }
    }, [pages, locationName]);

    return (
        <>
            {!isHide ? (
                <div className="md:mb-6 mb-4 flex space-x-3 rtl:space-x-reverse">
                    <ul className="breadcrumbs">
                        <li className="text-primary-500">
                            <Link href="/dashboard" className="text-lg">
                                <Icon icon="heroicons-outline:home" />
                            </Link>
                            <span className="breadcrumbs-icon rtl:transform rtl:rotate-180">
                                <Icon icon="heroicons:chevron-right" />
                            </span>
                        </li>
                        {groupTitle && (
                            <li className="text-primary-500">
                                <button type="button" className="capitalize">
                                    {groupTitle}
                                </button>
                                <span className="breadcrumbs-icon rtl:transform rtl:rotate-180">
                                    <Icon icon="heroicons:chevron-right" />
                                </span>
                            </li>
                        )}
                        <li className="capitalize text-slate-500 dark:text-slate-400">
                            {pages?.props?.title ||
                                finalLocationName ||
                                currentLocationName}
                        </li>
                    </ul>
                </div>
            ) : null}
        </>
    );
};

export default Breadcrumbs;
