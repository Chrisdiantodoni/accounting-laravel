import React, { useState } from "react";
import Icon from "@/components/ui/Icon";
import Button from "@/components/ui/Button";

const Step = ({ pages, currentPage }) => {
    return (
        <div>
            <div className="mx-auto flex flex-wrap gap-y-5 z-[5]">
                {pages.map((page, i) => (
                    <div key={i} className="relative  z-[1] flex items-center">
                        <div
                            className={`w-full flex items-center ${
                                currentPage >= i ? "text-primary-500" : ""
                            }`}
                        >
                            <div className="flex mx-2 items-center justify-center">
                                <span
                                    className={`w-7 h-7 flex items-center justify-center rounded-full border ${
                                        currentPage >= i
                                            ? "border-primary-500 bg-primary-500 text-white"
                                            : "border-slate-500 bg-gray-100"
                                    }`}
                                >
                                    {i + 1}
                                </span>
                                <div className="ml-2">
                                    <span className="font-medium text-base">
                                        {page.title}
                                    </span>
                                    <br />
                                    <span className="text-xs text-gray-500">
                                        {page.subtitle}
                                    </span>
                                </div>
                            </div>
                        </div>
                        {i !== pages.length - 1 && (
                            <div
                                className={`justify-center text-2xl mx-5 ${
                                    currentPage >= i
                                        ? "text-primary-500"
                                        : "text-gray-500"
                                }`}
                            >
                                <Icon icon={"mdi:chevron-double-right"} />
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <div className="mt-10">{pages[currentPage].content}</div>
        </div>
    );
};

export default Step;
