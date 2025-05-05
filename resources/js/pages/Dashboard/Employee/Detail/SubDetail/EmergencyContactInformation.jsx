const EmergencyContactInformation = ({ emergency_contact_information }) => {
    return (
        <div className="grid grid-cols-12 gap-4">
            <div className="col-span-12">
                <p className="detail-title">Emergency Contact Information</p>
                <hr />
            </div>
            <div className="col-span-6">
                <p className="detail-label">Nama</p>
            </div>
            <div className="col-span-6 flex items-center gap-2">
                <p className="detail-label hidden lg:block">:</p>
                <p className="detail-label">
                    {emergency_contact_information?.name}
                </p>
            </div>
            <div className="col-span-6">
                <p className="detail-label">Hubungan</p>
            </div>
            <div className="col-span-6 flex items-center gap-2">
                <p className="detail-label hidden lg:block">:</p>
                <p className="detail-label">
                    {emergency_contact_information?.relation}
                </p>
            </div>
            <div className="col-span-6">
                <p className="detail-label">Nomor Telepon</p>
            </div>
            <div className="col-span-6 flex items-center gap-2">
                <p className="detail-label hidden lg:block">:</p>
                <p className="detail-label">
                    {emergency_contact_information?.tel_number}
                </p>
            </div>
            <div className="col-span-6">
                <p className="detail-label">Nomor Handphone</p>
            </div>
            <div className="col-span-6 flex items-center gap-2">
                <p className="detail-label hidden lg:block">:</p>
                <p className="detail-label">
                    {emergency_contact_information?.phone_number}
                </p>
            </div>
            <div className="col-span-6">
                <p className="detail-label">Alamat</p>
            </div>
            <div className="col-span-6 flex items-start gap-2">
                <p className="detail-label hidden lg:block">:</p>
                <p className="detail-label">
                    {emergency_contact_information?.address}
                </p>
            </div>
        </div>
    );
};

export default EmergencyContactInformation;
