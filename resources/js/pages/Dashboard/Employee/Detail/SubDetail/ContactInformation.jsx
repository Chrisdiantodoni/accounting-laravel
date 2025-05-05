const ContactInformation = ({ contact_information }) => {
    console.log(contact_information);
    return (
        <div className="grid grid-cols-12 gap-4">
            <div className="col-span-12">
                <p className="detail-title">Contact Information</p>
                <hr />
            </div>

            <div className="col-span-6">
                <p className="detail-label">Nomor Telepon</p>
            </div>
            <div className="col-span-6 flex items-center gap-2">
                <p className="detail-label hidden lg:block">:</p>
                <p className="detail-label">
                    {contact_information?.tel_number}
                </p>
            </div>
            <div className="col-span-6">
                <p className="detail-label">Nomor Handphone</p>
            </div>
            <div className="col-span-6 flex items-center gap-2">
                <p className="detail-label hidden lg:block">:</p>
                <p className="detail-label">
                    {contact_information?.phone_number}
                </p>
            </div>
            <div className="col-span-6">
                <p className="detail-label">Email</p>
            </div>
            <div className="col-span-6 flex items-center gap-2">
                <p className="detail-label hidden lg:block">:</p>
                <p className="detail-label">{contact_information?.email}</p>
            </div>
        </div>
    );
};

export default ContactInformation;
