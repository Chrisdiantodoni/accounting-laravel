import { dayJsFormatDate } from "@/utils/dayjs";

const PersonalInformation = ({ personal_information }) => {
    console.log(personal_information);
    return (
        <div className="grid grid-cols-12 gap-4">
            <div className="col-span-12">
                <p className="detail-title">Personal Information</p>
                <hr />
            </div>
            <div className="col-span-6">
                <p className="detail-label">Nama Lengkap</p>
            </div>
            <div className="col-span-6 flex items-center gap-2">
                <p className="detail-label hidden lg:block">:</p>
                <p className="detail-label">
                    {personal_information?.full_name}
                </p>
            </div>
            <div className="col-span-6">
                <p className="detail-label">Tempat, Tanggal Lahir</p>
            </div>
            <div className="col-span-6 flex items-center gap-2">
                <p className="detail-label hidden lg:block">:</p>
                <p className="detail-label">
                    {personal_information?.place_of_birth},{" "}
                    {dayJsFormatDate(personal_information?.date_of_birth)}
                </p>
            </div>
            <div className="col-span-6">
                <p className="detail-label">Jenis Kelamin</p>
            </div>
            <div className="col-span-6 flex items-center gap-2">
                <p className="detail-label hidden lg:block">:</p>
                <p className="detail-label">
                    {personal_information?.gender === "man"
                        ? "Laki-laki"
                        : "Perempuan"}
                </p>
            </div>
            <div className="col-span-6">
                <p className="detail-label">Alamat KTP</p>
            </div>
            <div className="col-span-6 flex items-start gap-2">
                <p className="detail-label hidden lg:block">:</p>
                <p className="detail-label">
                    {personal_information?.id_card_address}
                </p>
            </div>
            <div className="col-span-6">
                <p className="detail-label">Alamat Domisili</p>
            </div>
            <div className="col-span-6 flex items-start gap-2">
                <p className="detail-label hidden lg:block">:</p>
                <p className="detail-label">
                    {personal_information?.domicile_address}
                </p>
            </div>
            <div className="col-span-6">
                <p className="detail-label">Nomor KTP</p>
            </div>
            <div className="col-span-6 flex items-center gap-2">
                <p className="detail-label hidden lg:block">:</p>
                <p className="detail-label">{personal_information?.nik}</p>
            </div>
            <div className="col-span-6">
                <p className="detail-label">Nomor NPWP</p>
            </div>
            <div className="col-span-6 flex items-center gap-2">
                <p className="detail-label hidden lg:block">:</p>
                <p className="detail-label">{personal_information?.npwp}</p>
            </div>
            <div className="col-span-6">
                <p className="detail-label">No. BPJS Kesehatan</p>
            </div>
            <div className="col-span-6 flex items-center gap-2">
                <p className="detail-label hidden lg:block">:</p>
                <p className="detail-label">
                    {personal_information?.bpjs_health_number}
                </p>
            </div>
            <div className="col-span-6">
                <p className="detail-label">No. BPJS Ketenagakerjaan</p>
            </div>
            <div className="col-span-6 flex items-center gap-2">
                <p className="detail-label hidden lg:block">:</p>
                <p className="detail-label">
                    {personal_information?.bpjs_employment_number}
                </p>
            </div>
            <div className="col-span-6">
                <p className="detail-label">Status Pernikahan</p>
            </div>
            <div className="col-span-6 flex items-center gap-2">
                <p className="detail-label hidden lg:block">:</p>
                <p className="detail-label">
                    {personal_information?.marital_status}
                </p>
            </div>
            <div className="col-span-6">
                <p className="detail-label">Nama Pasangan</p>
            </div>
            <div className="col-span-6 flex items-center gap-2">
                <p className="detail-label hidden lg:block">:</p>
                <p className="detail-label">
                    {personal_information?.partners_name}
                </p>
            </div>
            <div className="col-span-6">
                <p className="detail-label">Jumlah Pertanggungan</p>
            </div>
            <div className="col-span-6 flex items-center gap-2">
                <p className="detail-label hidden lg:block">:</p>
                <p className="detail-label">
                    {personal_information?.dependents_number}
                </p>
            </div>
            <div className="col-span-6">
                <p className="detail-label">Golongan Darah</p>
            </div>
            <div className="col-span-6 flex items-center gap-2">
                <p className="detail-label hidden lg:block">:</p>
                <p className="detail-label">
                    {personal_information?.blood_type}
                </p>
            </div>
            <div className="col-span-6">
                <p className="detail-label">Foto Karyawan</p>
            </div>
            <div className="col-span-6 flex items-center gap-2">
                <img
                    src={personal_information?.employee_photo_url || "-"}
                ></img>
            </div>
        </div>
    );
};

export default PersonalInformation;
