import Table from "@/components/ui/Table";
import pdfPreview from "@/assets/images/pdf-preview.png";

const OtherInformation = ({ other_information }) => {
    const openPdfInNewTab = (file) => {
        window.open(file, "_blank");
    };
    return (
        <div className="grid grid-cols-12 gap-4">
            <div className="col-span-12">
                <p className="detail-title">Additional Document</p>
                <hr />
            </div>
            <div className="col-span-12 ">
                <div className="grid lg:grid-cols-4 grid-cols-1 gap-4">
                    {other_information?.files?.map((item, index) => (
                        <div
                            key={index}
                            className="flex flex-col items-center p-4 border rounded-md shadow"
                        >
                            {item.file_url?.endsWith === "pdf" ? (
                                <img
                                    src={pdfPreview}
                                    alt={`Document ${index + 1}`}
                                    className="w-full object-cover"
                                    onClick={() => openPdfInNewTab(item?.file)}
                                />
                            ) : (
                                <img
                                    src={item?.file_url}
                                    alt={`Document ${index + 1}`}
                                    className="w-full object-cover"
                                />
                            )}
                        </div>
                    ))}
                </div>
            </div>
            <div className="col-span-12">
                <p className="detail-title">Additional Information</p>
                <hr />
            </div>
            <div className="col-span-3">
                <p className="detail-label">Jenis SIM</p>
            </div>
            <div className="col-span-3 flex items-center gap-2">
                <p className="detail-label hidden lg:block">:</p>
                <p className="detail-label">{other_information?.sim_type}</p>
            </div>
            <div className="col-span-3">
                <p className="detail-label">No. SIM</p>
            </div>
            <div className="col-span-3 flex items-center gap-2">
                <p className="detail-label hidden lg:block">:</p>
                <p className="detail-label">{other_information?.sim_number}</p>
            </div>
            <div className="col-span-3">
                <p className="detail-label">Kemampuan Bahasa Asing</p>
            </div>
            <div className="col-span-3 flex items-center gap-2">
                <p className="detail-label hidden lg:block">:</p>
                <p className="detail-label">
                    {other_information?.foreign_language}
                </p>
            </div>
            <div className="col-span-3">
                <p className="detail-label">Hobi</p>
            </div>
            <div className="col-span-3 flex items-center gap-2">
                <p className="detail-label hidden lg:block">:</p>
                <p className="detail-label">{other_information?.hobbies}</p>
            </div>
            <div className="col-span-3">
                <p className="detail-label">Riwayat Kesehatan</p>
            </div>
            <div className="col-span-3 flex items-center gap-2">
                <p className="detail-label hidden lg:block">:</p>
                <p className="detail-label">
                    {other_information?.health_history}
                </p>
            </div>
            <div className="col-span-12 mt-5">
                <p className="detail-title">Social Media Information</p>
                <hr />
            </div>
            <div className="col-span-3">
                <p className="detail-label">LinkedIn</p>
            </div>
            <div className="col-span-3 flex items-center gap-2">
                <p className="detail-label hidden lg:block">:</p>
                <p className="detail-label">{other_information?.linkedin}</p>
            </div>
            <div className="col-span-3">
                <p className="detail-label">Twitter/X</p>
            </div>
            <div className="col-span-3 flex items-center gap-2">
                <p className="detail-label hidden lg:block">:</p>
                <p className="detail-label">{other_information?.twitter}</p>
            </div>
            <div className="col-span-3">
                <p className="detail-label">Facebook</p>
            </div>
            <div className="col-span-3 flex items-center gap-2">
                <p className="detail-label hidden lg:block">:</p>
                <p className="detail-label">{other_information?.facebook}</p>
            </div>
            <div className="col-span-3">
                <p className="detail-label">Instagram</p>
            </div>
            <div className="col-span-3 flex items-center gap-2">
                <p className="detail-label hidden lg:block">:</p>
                <p className="detail-label">{other_information?.instagram}</p>
            </div>
            <div className="col-span-12 mt-5">
                <p className="detail-title">Training and Certificates</p>
                <hr />
            </div>
            <div className="col-span-12">
                <Table
                    headers={headersCertificates}
                    data={other_information?.training_certificates}
                />
            </div>

            <div className="col-span-12 mt-5">
                <p className="detail-title">Previous Work Information</p>
                <hr />
            </div>
            <div className="col-span-12">
                <Table
                    headers={headersPreviousWorks}
                    data={other_information?.previous_works}
                />
            </div>
        </div>
    );
};

const headersCertificates = [
    {
        title: "Nama Training / Sertifikat",
        key: "name",
    },
    {
        title: "Periode",
        key: "period",
    },
];

const headersPreviousWorks = [
    {
        title: "Nama Perusahaan",
        key: "company_name",
    },
    {
        title: "Jabatan",
        key: "position",
    },
    {
        title: "Periode",
        key: "work_period",
    },
];

export default OtherInformation;
