import { dayJsFormatDate } from "@/utils/dayjs";
const JobInformation = ({ job_information }) => {
    return (
        <div className="grid grid-cols-12 gap-4">
            <div className="col-span-12">
                <p className="detail-title">Job Information</p>
                <hr />
            </div>
            <div className="col-span-6">
                <p className="detail-label">Jabatan</p>
            </div>
            <div className="col-span-6 flex items-center gap-2">
                <p className="detail-label hidden lg:block">:</p>
                <p className="detail-label">
                    {job_information?.position?.position_name}
                </p>
            </div>
            <div className="col-span-6">
                <p className="detail-label">Departemen</p>
            </div>
            <div className="col-span-6 flex items-center gap-2">
                <p className="detail-label hidden lg:block">:</p>
                <p className="detail-label">
                    {job_information?.department?.department_name}
                </p>
            </div>
            <div className="col-span-6">
                <p className="detail-label">Tanggal Mulai Bekerja</p>
            </div>
            <div className="col-span-6 flex items-center gap-2">
                <p className="detail-label hidden lg:block">:</p>
                <p className="detail-label">
                    {dayJsFormatDate(job_information?.date_start_work)}
                </p>
            </div>
            <div className="col-span-6">
                <p className="detail-label">Status Karyawan</p>
            </div>
            <div className="col-span-6 flex items-center gap-2">
                <p className="detail-label hidden lg:block">:</p>
                <p className="detail-label uppercase">
                    {job_information?.job_status}
                </p>
            </div>
            <div className="col-span-6">
                <p className="detail-label">Dealer</p>
            </div>
            <div className="col-span-6 flex items-start gap-2">
                <p className="detail-label hidden lg:block">:</p>
                <p className="detail-label">{job_information?.dealer_name}</p>
            </div>
            <div className="col-span-6">
                <p className="detail-label">NEQ</p>
            </div>
            <div className="col-span-6 flex items-start gap-2">
                <p className="detail-label hidden lg:block">:</p>
                <p className="detail-label">
                    {job_information?.dealer_neq_name || "-"}
                </p>
            </div>
            <div className="col-span-6">
                <p className="detail-label">NIP</p>
            </div>
            <div className="col-span-6 flex items-start gap-2">
                <p className="detail-label hidden lg:block">:</p>
                <p className="detail-label">{job_information?.nip}</p>
            </div>
            <div className="col-span-6">
                <p className="detail-label">No. Rekening</p>
            </div>
            <div className="col-span-6 flex items-start gap-2">
                <p className="detail-label hidden lg:block">:</p>
                <p className="detail-label">
                    {job_information?.bank_account_number}
                </p>
            </div>
            <div className="col-span-6">
                <p className="detail-label">Nama Bank</p>
            </div>
            <div className="col-span-6 flex items-start gap-2">
                <p className="detail-label hidden lg:block">:</p>
                <p className="detail-label">{job_information?.bank_name}</p>
            </div>
            <div className="col-span-6">
                <p className="detail-label">Cabang Bank</p>
            </div>
            <div className="col-span-6 flex items-start gap-2">
                <p className="detail-label hidden lg:block">:</p>
                <p className="detail-label">
                    {job_information?.branch_of_bank}
                </p>
            </div>
        </div>
    );
};

export default JobInformation;
