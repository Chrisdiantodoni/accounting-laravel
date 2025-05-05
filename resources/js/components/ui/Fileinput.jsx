import React from "react";
import pdfPreview from "@/assets/images/pdf-preview.png";
import Button from "./Button";

const Fileinput = ({
    name,
    label = "Browse",
    onChange,
    placeholder = "Choose a file or drop it here...",
    multiple,
    preview,
    className = "custom-class",
    id,
    selectedFile,
    badge,
    selectedFiles,
    accept,
    onDelete,
}) => {
    const openPdfInNewTab = (filePreview) => {
        const url = URL.createObjectURL(filePreview);
        window.open(url, "_blank");
    };

    const handleDeleteFiles = (index) => {
        onDelete(index);
    };

    return (
        <div>
            <div className="filegroup">
                <label>
                    <input
                        type="file"
                        accept={accept}
                        onChange={onChange}
                        className="bg-red-400 w-full hidden"
                        name={name}
                        id={id}
                        multiple={multiple}
                        placeholder={placeholder}
                    />
                    <div
                        className={`w-full h-[40px] file-control flex items-center ${className}`}
                    >
                        {!multiple && (
                            <span className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap">
                                {selectedFile && (
                                    <span
                                        className={
                                            badge
                                                ? " badge-title"
                                                : "text-slate-900 dark:text-white"
                                        }
                                    >
                                        {selectedFile.name}
                                    </span>
                                )}
                                {!selectedFile && (
                                    <span className="text-slate-400">
                                        {placeholder}
                                    </span>
                                )}
                            </span>
                        )}

                        {multiple && (
                            <span className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap">
                                {selectedFiles.length > 0 && (
                                    <span
                                        className={
                                            badge
                                                ? " badge-title"
                                                : "text-slate-900 dark:text-white"
                                        }
                                    >
                                        {selectedFiles.length > 0
                                            ? selectedFiles.length +
                                              " files selected"
                                            : ""}
                                    </span>
                                )}
                                {selectedFiles.length === 0 && (
                                    <span className="text-slate-400">
                                        {placeholder}
                                    </span>
                                )}
                            </span>
                        )}
                        <span className="file-name flex-none cursor-pointer border-l px-4 border-slate-200 dark:border-slate-700 h-full inline-flex items-center bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 text-base rounded-tr rounded-br font-normal">
                            {label}{" "}
                        </span>
                    </div>
                </label>

                {!multiple &&
                    preview &&
                    selectedFile &&
                    (selectedFile?.name?.endsWith(".pdf") ? (
                        <div
                            className="w-[200px] h-[200px] mx-auto mt-6 flex items-center justify-center border p-2 border-slate-200"
                            onClick={() => openPdfInNewTab(file)}
                        >
                            <img
                                src={pdfPreview}
                                className="object-contain w-full h-full rounded"
                                alt={file}
                                onLoad={() => URL.revokeObjectURL(file)}
                            />
                        </div>
                    ) : (
                        <div className="w-[200px] h-[200px] mx-auto mt-6">
                            <img
                                src={selectedFile}
                                className="w-full h-full block rounded object-contain border p-2 border-slate-200"
                                alt={selectedFile.name}
                            />
                        </div>
                    ))}
                {multiple && preview && selectedFiles.length > 0 && (
                    <div className="flex flex-wrap space-x-5 rtl:space-x-reverse">
                        {selectedFiles.map((file, index) => (
                            <div
                                className="xl:w-1/5 md:w-1/3 w-1/2 rounded mt-6 border p-2 border-slate-200"
                                key={index}
                            >
                                {file.type.startsWith("image/") ? (
                                    <div className="w-full h-52 relative flex items-center justify-center text-center">
                                        <img
                                            src={file.file}
                                            className="object-contain w-full h-full rounded"
                                            alt={file.name}
                                            onLoad={() =>
                                                URL.revokeObjectURL(file)
                                            }
                                        />
                                        <Button
                                            className="absolute  top-0 right-0 mt-1 mr-1 text-red-500 rounded-full p-1 hover:bg-slate-100"
                                            onClick={() =>
                                                handleDeleteFiles(index)
                                            }
                                            icon={"mdi:trash"}
                                        />
                                    </div>
                                ) : (
                                    <div
                                        className="w-full h-52 relative flex items-center justify-center text-center cursor-pointer"
                                        onClick={() => openPdfInNewTab(file)}
                                    >
                                        <img
                                            src={pdfPreview}
                                            className="object-contain w-full h-full rounded"
                                            alt={file.name}
                                            onLoad={() =>
                                                URL.revokeObjectURL(file)
                                            }
                                        />
                                        <Button
                                            className="absolute top-0 right-0 mt-1 mr-1 text-red-500 rounded-full p-1 hover:bg-slate-100"
                                            onClick={() =>
                                                handleDeleteFiles(index)
                                            }
                                            icon={"mdi:trash"}
                                        />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Fileinput;
