import Card from "@/components/ui/Card";
import { Head, Link, router, useForm, usePage } from "@inertiajs/react";
import PersonalInformation from "./SubDetail/PersonalInformation";
import ContactInformation from "./SubDetail/ContactInformation";
import EmergencyContactInformation from "./SubDetail/EmergencyContactInformation";
import JobInformation from "./SubDetail/JobInformation";
import AcademicInformation from "./SubDetail/AcademicInformation";
import OtherInformation from "./SubDetail/OtherInformation";
import Button from "@/components/ui/Button";
import Tooltip from "@/components/ui/Tooltip";
import Icon from "@/components/ui/Icon";
import { useUserPermission } from "@/hooks/usePermission";

const EmployeeDetail = () => {
    const { hasPermission } = useUserPermission();
    const { employee } = usePage().props;
    const personal_information = employee.personal_information;
    const contact_information = employee.contact_information;
    const emergency_contact_information =
        employee.emergency_contact_information;
    const job_information = employee.job_information;
    const academic_information = employee.educational_information;
    const other_information = employee.other_information;
    const other_information_files = employee.other_information_files;
    const { patch, processing } = useForm();

    const changeEmployeeStatus = () => {
        patch(route("change.employee.status", employee?.employee_id));
    };

    return (
        <Card
            title={"Detail Employee"}
            subtitle={employee?.employee_status}
            headerslot={
                <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-x-5 gap-y-2">
                    {hasPermission("edit_employee") && (
                        <Button
                            className="btn-outline-dark py-2"
                            link={route("edit.employee", employee?.employee_id)}
                            text={"Edit Employee Data"}
                        />
                    )}
                    {hasPermission("put_status_employee") && (
                        <Button
                            text={
                                employee?.employee_status === "active"
                                    ? "Non-Active"
                                    : "Active"
                            }
                            onClick={changeEmployeeStatus}
                            isLoading={processing}
                            className={`py-2 ${
                                employee?.employee_status === "active"
                                    ? "btn-danger"
                                    : "btn-success"
                            }`}
                        />
                    )}
                </div>
            }
        >
            <Head title="Employee" />
            <div className="grid lg:grid-cols-2 grid-cols-1 gap-x-5 gap-y-8">
                <div className="lg:col-span-1 col-span-2">
                    <div className="grid grid-cols-12 gap-10">
                        <div className="col-span-12">
                            <PersonalInformation
                                personal_information={personal_information}
                            />
                        </div>
                        <div className="col-span-12">
                            <AcademicInformation
                                academic_information={academic_information}
                            />
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-1 col-span-2">
                    <div className="grid grid-cols-12 gap-10">
                        <div className="col-span-12">
                            <ContactInformation
                                contact_information={contact_information}
                            />
                        </div>
                        <div className="col-span-12">
                            <EmergencyContactInformation
                                emergency_contact_information={
                                    emergency_contact_information
                                }
                            />
                        </div>
                        <div className="col-span-12">
                            <JobInformation job_information={job_information} />
                        </div>
                    </div>
                </div>
                <div className="col-span-2">
                    <OtherInformation
                        other_information={{
                            ...other_information,
                            files: other_information_files,
                        }}
                    />
                </div>
            </div>
        </Card>
    );
};

export default EmployeeDetail;
