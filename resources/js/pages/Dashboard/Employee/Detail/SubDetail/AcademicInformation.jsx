const AcademicInformation = ({ academic_information }) => {
    console.log(academic_information);
    return (
        <div className="grid grid-cols-12 gap-4">
            <div className="col-span-12">
                <p className="detail-title">Academic Information</p>
                <hr />
            </div>
            <div className="col-span-6">
                <p className="detail-label">Pendidikan Terakhir</p>
            </div>
            <div className="col-span-6 flex items-center gap-2">
                <p className="detail-label hidden lg:block">:</p>
                <p className="detail-label">
                    {academic_information?.last_education}
                </p>
            </div>
            <div className="col-span-6">
                <p className="detail-label">Nama Institusi</p>
            </div>
            <div className="col-span-6 flex items-center gap-2">
                <p className="detail-label hidden lg:block">:</p>
                <p className="detail-label">
                    {academic_information?.institute_name}
                </p>
            </div>
            <div className="col-span-6">
                <p className="detail-label">Jurusan</p>
            </div>
            <div className="col-span-6 flex items-center gap-2">
                <p className="detail-label hidden lg:block">:</p>
                <p className="detail-label">{academic_information?.major}</p>
            </div>
            <div className="col-span-6">
                <p className="detail-label">Tahun lulus</p>
            </div>
            <div className="col-span-6 flex items-center gap-2">
                <p className="detail-label hidden lg:block">:</p>
                <p className="detail-label">
                    {academic_information?.year_graduate}
                </p>
            </div>
            <div className="col-span-6">
                <p className="detail-label">Gelar</p>
            </div>
            <div className="col-span-6 flex items-start gap-2">
                <p className="detail-label hidden lg:block">:</p>
                <p className="detail-label">
                    {academic_information?.academic_title}
                </p>
            </div>
        </div>
    );
};

export default AcademicInformation;
