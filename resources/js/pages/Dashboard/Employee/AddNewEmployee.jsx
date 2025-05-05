import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Step from "@/pages/components/progress-bar/step";
import { Head, router, usePage } from "@inertiajs/react";
import { useEffect, useState } from "react";
import PersonalInformationForm from "./SubForm/PersonalInformationForm";
import ContactInformationForm from "./SubForm/ContactInformationForm";
import { FormProvider, useForm } from "react-hook-form";
import { useForm as InertiaForm } from "@inertiajs/react";
import JobInformationForm from "./SubForm/JobInformationForm";
import AcademicInformationForm from "./SubForm/AcademicInformationForm";
import OtherInformationForm from "./SubForm/OtherInformation";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { dayJsFormatDate, dayjsFormatInputDate } from "@/utils/dayjs";
import { toast } from "react-toastify";

const personalInformationSchema = yup.object().shape({
    full_name: yup.string().required("Nama Lengkap wajib diisi"),
    place_of_birth: yup.string().required("Tempat Lahir wajib diisi"),
    date_of_birth: yup.date().required("Tanggal Lahir wajib diisi"),
    card_address: yup.string().required("Alamat KTP wajib diisi"),
    nik: yup.string().required("Nomor KTP wajib diisi"),
});

const contactInformationSchema = yup.object().shape({
    contact_phone_number: yup.string().required("No. Ponsel wajib diisi"),
});
const academicInformationSchema = yup.object().shape({
    last_education: yup.string().required("Pendidikan terakhir wajib diisi"),
});
const jobInformationSchema = yup.object().shape({
    position_id: yup.string().required("Jabatan wajib dipilih"),
    department_id: yup.string().required("Departemen wajib dipilih"),
    job_status: yup.string().required("Status Karyawan wajib dipilih"),
    start_work_date: yup.date().required("Tanggal Mulai Bekerja wajib dipilih"),
    dealer: yup.object().nullable().required("Dealer wajib dipilih"),
    nip: yup.string().required("NIP wajib diisi"),
});
const otherInformationSchema = yup.object().shape({});

export default function AddNewEmployee() {
    const { employee } = usePage().props;
    const [selectedFile, setSelectedFile] = useState("");
    const [uploadFile, setUploadFile] = useState("");
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [errorFoto, setErrorFoto] = useState(false);
    const [uploadFiles, setUploadFiles] = useState([]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setSelectedFile(URL.createObjectURL(file));
        setUploadFile(file);
        setErrorFoto(false);
    };

    const handleFileChangeMultiple = (e) => {
        const files = e.target.files;
        const filesArray = Array.from(files).map((file) => ({
            file: URL.createObjectURL(file),
            type: file?.name?.endsWith(".pdf") ? "pdf" : "image/",
        }));
        const filesArray2 = Array.from(files).map((file) => ({
            file: file,
            type: file?.name?.endsWith(".pdf") ? "pdf" : "image/",
        }));
        setSelectedFiles((prev) => [...prev, ...filesArray]);
        setUploadFiles((prev) => [...prev, ...filesArray2]);
    };

    const handleDeleteFileMultiple = (index) => {
        setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
        setUploadFiles((prev) => prev.filter((_, i) => i !== index));
    };

    const [currentPage, setCurrentPage] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    let currentStepSchema;
    switch (currentPage) {
        case 0:
            currentStepSchema = personalInformationSchema;
            break;
        case 1:
            currentStepSchema = contactInformationSchema;
            break;
        case 2:
            currentStepSchema = academicInformationSchema;
            break;
        case 3:
            currentStepSchema = jobInformationSchema;
            break;
        case 4:
            currentStepSchema = otherInformationSchema;
            break;
        default:
            break;
    }

    const methods = useForm({
        resolver: yupResolver(currentStepSchema),
        mode: "all",
        defaultValues: {
            date_of_birth: new Date(),
            start_work_date: new Date(),
            training_certificates: [{ name: "", period: "" }],
            previous_works: [
                { company_name: "", work_period: "", position: "" },
            ],
        },
    });

    const { post, processing } = InertiaForm();

    const pages = [
        {
            title: "Personal Information",
            subtitle: employee
                ? "Edit Personal Information"
                : "Add Personal Information",
            content: (
                <PersonalInformationForm
                    selectedFile={selectedFile}
                    selectedFiles={selectedFiles}
                    handleFileChange={handleFileChange}
                    handleFileChangeMultiple={handleFileChangeMultiple}
                    errorFoto={errorFoto}
                    handleDeleteFileMultiple={handleDeleteFileMultiple}
                />
            ),
        },
        {
            title: "Contact Information",
            subtitle: employee
                ? "Edit Contact Information"
                : "Add Contact Information",
            content: <ContactInformationForm />,
        },
        {
            title: "Academic Information",
            subtitle: employee
                ? "Edit Academic Information"
                : "Add Academic Information",
            content: <AcademicInformationForm />,
        },
        {
            title: "Job Information",
            subtitle: employee ? "Edit Job Information" : "Add Job Information",
            content: <JobInformationForm />,
        },
        {
            title: "Other Information",
            subtitle: employee
                ? "Edit Other Information"
                : "Add Other Information",
            content: <OtherInformationForm />,
        },
    ];

    const setValue = methods.setValue;

    console.log(uploadFile);

    useEffect(() => {
        if (employee) {
            const personal_information = employee?.personal_information;
            setValue("full_name", personal_information?.full_name);
            setValue("gender", personal_information?.gender);
            setValue("date_of_birth", personal_information?.date_of_birth);
            setValue("marital_status", personal_information?.marital_status);
            setValue("place_of_birth", personal_information?.place_of_birth);
            setValue("card_address", personal_information?.id_card_address);
            setValue(
                "domicile_address",
                personal_information?.domicile_address
            );
            setValue("nik", personal_information?.nik);
            setValue("npwp", personal_information?.npwp);
            setValue(
                "bpjs_health_number",
                personal_information?.bpjs_health_number
            );
            setValue(
                "bpjs_employment_number",
                personal_information?.bpjs_employment_number
            );
            setValue("partners_name", personal_information?.partners_name);

            setValue("place_of_birth", personal_information?.place_of_birth);
            setValue(
                "dependents_number",
                personal_information?.dependents_number
            );
            setValue("blood_type", personal_information?.blood_type);

            const contact_information = employee.contact_information;
            setValue("contact_phone_number", contact_information.phone_number);
            setValue("contact_tel_number", contact_information.tel_number);
            setValue("contact_email", contact_information.email);

            const emergency_contact_information =
                employee.emergency_contact_information;
            setValue("emergency_name", emergency_contact_information.name);
            setValue(
                "emergency_phone_number",
                emergency_contact_information.phone_number
            );
            setUploadFile(personal_information?.employee_photo_url);
            setSelectedFile(personal_information?.employee_photo_url || "");

            setSelectedFiles(
                employee?.other_information_files?.map((item) => ({
                    file: item.file_url,
                    type: item.file_url?.endsWith(".pdf") ? "pdf" : "image/",
                    id: item.uuid,
                })) || []
            );
            setUploadFiles(
                employee?.other_information_files?.map((item) => ({
                    file: item.file_url,
                    type: item.file_url?.endsWith(".pdf") ? "pdf" : "image/",
                    id: item.uuid,
                    is_delete: false,
                })) || []
            );
            setValue("relation", emergency_contact_information.relation);
            setValue(
                "emergency_tel_number",
                emergency_contact_information.tel_number
            );
            setValue(
                "emergency_address",
                emergency_contact_information.address
            );
            const academic_information = employee.educational_information;
            setValue("last_education", academic_information.last_education);
            setValue("institute_name", academic_information.institute_name);
            setValue("major", academic_information.major);
            setValue("academic_title", academic_information.academic_title);
            setValue("year_graduate", academic_information.year_graduate);

            const job_information = employee.job_information;
            setValue("position_id", job_information?.position_id);
            setValue("department_id", job_information?.department_id);
            setValue("start_work_date", job_information?.date_start_work);
            setValue("job_status", job_information?.job_status);
            setValue("dealer", {
                label: job_information?.dealer_name,
                value: {
                    dealer_name: job_information?.dealer_name,
                    dealer_id: job_information?.dealer_id,
                },
            });
            setValue("neq", {
                label: job_information?.dealer_neq_name,
                value: {
                    dealer_neq_name: job_information?.dealer_neq_name,
                    dealer_neq_id: job_information?.dealer_neq_id,
                },
            });
            setValue("nip", job_information?.nip);
            setValue(
                "bank_account_number",
                job_information?.bank_account_number
            );
            setValue("bank_name", job_information?.bank_name);
            setValue("branch_of_bank", job_information?.branch_of_bank);
            const other_information = employee.other_information;
            setValue("sim_type", other_information?.sim_type);
            setValue("sim_number", other_information?.sim_number);
            setValue("health_history", other_information?.health_history);
            setValue("foreign_language", other_information?.foreign_language);
            setValue("hobbies", other_information?.hobbies);
            setValue("linkedin", other_information?.linkedin);
            setValue("twitter", other_information?.twitter);
            setValue("instagram", other_information?.instagram);
            setValue("facebook", other_information?.facebook);
            other_information?.training_certificates?.forEach((item, index) => {
                setValue(`training_certificates.[${index}].name`, item?.name);
                setValue(
                    `training_certificates.[${index}].period`,
                    item?.period
                );
            });
            other_information?.previous_works?.forEach((item, index) => {
                setValue(
                    `previous_works.[${index}].company_name`,
                    item?.company_name
                );
                setValue(`previous_works.[${index}].position`, item?.position);
                setValue(
                    `previous_works.[${index}].work_period`,
                    item?.work_period
                );
            });
        }
    }, [employee]);

    console.log({ selectedFiles });

    const handleNext = async (data) => {
        let totalPages = pages.length;
        const isLastStep = currentPage === totalPages - 1;
        if (isLastStep) {
            onSubmit(data); // Handle final form submission
        } else {
            if (currentPage === 0) {
                if (!selectedFile) {
                    // toast.error("Foto Karyawan wajib diupload");
                    setErrorFoto(true); // Set error state if form validation fails
                    return;
                }
            }
            setCurrentPage(currentPage + 1);
        }
    };
    console.log(currentPage);

    const handlePrev = () => {
        if (currentPage > 0) {
            setCurrentPage(currentPage - 1);
        }
    };

    const onSubmit = async (data) => {
        const formData = new FormData();
        // if (selectedFile) {
        //     formData.append("employee_foto", selectedFile);
        // }
        // if (selectedFiles) {
        //     selectedFiles.forEach((file, index) => {
        //         formData.append(`other_information_files[${index}]`, file);
        //     });
        // }
        data = {
            ...data,
            id_card_address: data?.card_address,
            date_of_birth: dayjsFormatInputDate(data?.date_of_birth),
            dealer_name: data?.dealer?.value?.dealer_name,
            dealer_id: data?.dealer?.value?.dealer_id,
            date_start_work: dayjsFormatInputDate(data?.start_work_date),
            dealer_neq_name: data?.neq?.value?.dealer_neq_name,
            dealer_neq_id: data?.neq?.value?.dealer_neq_id,
            employee_foto: uploadFile instanceof File ? uploadFile : null,
            other_information_files: uploadFiles?.map((item) => ({
                file: item?.file,
                ...item,
            })),
        };

        console.log({ data });

        if (employee) {
            router.post(
                route("edit.employee.detail", employee?.employee_id),
                data,
                {
                    forceFormData: true,
                },
                {
                    onStart: () => {
                        setIsLoading(true);
                    },
                    onSuccess: () => {
                        setIsLoading(false);
                        return;
                    },
                    onError: () => {
                        setIsLoading(false);
                        return;
                    },
                }
            );
            return;
        } else {
            router.post(route("store.new.employee"), data, {
                forceFormData: true,

                onStart: () => {
                    // setIsLoading(true);
                    return;
                },
                onSuccess: () => {
                    setIsLoading(false);
                    return;
                },
                onError: () => {
                    setIsLoading(false);
                    return;
                },
            });
        }
    };

    return (
        <Card>
            <Head title={employee ? "Edit Employee" : "Add New employee"} />
            <FormProvider {...methods}>
                <form
                    onSubmit={methods.handleSubmit((data) => handleNext(data))}
                    encType="multipart/form-data"
                >
                    <Step
                        pages={pages}
                        currentPage={currentPage}
                        // onSubmit={handleSubmit}
                    />
                    <div className="flex-wrap flex justify-between mt-10">
                        <Button
                            text="Prev"
                            disabled={currentPage === 0}
                            icon={
                                currentPage !== 0
                                    ? "ion:chevron-back-circle-outline"
                                    : ""
                            }
                            iconPosition="left"
                            onClick={handlePrev}
                            className="btn-outline-dark py-2 px-3"
                        />
                        <Button
                            isLoading={processing || isLoading}
                            className={`${
                                currentPage === pages.length - 1
                                    ? "btn-dark"
                                    : "btn-outline-dark"
                            } py-2 px-3`}
                            icon={
                                currentPage === pages.length - 1
                                    ? "mdi:check"
                                    : "ion:chevron-forward-circle-outline"
                            }
                            iconPosition={
                                currentPage === pages?.length - 1
                                    ? "left"
                                    : "right"
                            }
                            text={
                                currentPage === pages.length - 1
                                    ? "Submit"
                                    : "Next"
                            }
                            type="submit"
                        />
                    </div>
                </form>
            </FormProvider>
        </Card>
    );
}
