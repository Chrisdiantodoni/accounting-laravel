import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import DatePicker from "@/components/ui/DatePicker";
import Icons from "@/components/ui/Icon";
import Select from "@/components/ui/Select";
import Textarea from "@/components/ui/Textarea";
import Textinput from "@/components/ui/Textinput";
import { useFieldArray, useFormContext } from "react-hook-form";
const OtherInformationForm = () => {
    const { register, control } = useFormContext();

    const {
        fields: fieldPreviousWorks,
        append: appendPreviousWork,
        remove: removePreviousWork,
    } = useFieldArray({
        control,
        name: "previous_works",
    });
    const {
        fields: fieldTrainingCertificates,
        append: appendTrainingCertificate,
        remove: removeTrainingCertificate,
    } = useFieldArray({
        control,
        name: "training_certificates",
    });

    const simType = [
        {
            label: "SIM A",
            value: "SIM A",
        },
        {
            label: "SIM B1",
            value: "SIM B1",
        },
        {
            label: "SIM B2",
            value: "SIM B2",
        },
        {
            label: "SIM C",
            value: "SIM C",
        },
        {
            label: "SIM D",
            value: "SIM D",
        },
    ];

    return (
        <div className="space-y-4">
            <Card title={"Additional Information"}>
                <div className="space-y-4">
                    <div className="grid grid-cols-12 gap-4">
                        <div className="col-span-6">
                            <Select
                                label={"Jenis SIM"}
                                options={simType?.map((item) => ({
                                    label: item?.label,
                                    value: item?.value,
                                }))}
                                placeholder="Pilih"
                                defaultValue={""}
                                register={register}
                                name={"sim_type"}
                            />
                        </div>
                        <div className="col-span-6">
                            <Textinput
                                label={"No. SIM"}
                                name={"sim_number"}
                                register={register}
                            />
                        </div>
                        <div className="col-span-12">
                            <Textinput
                                label={"Kemampuan Bahasa Asing"}
                                name={"foreign_language"}
                                register={register}
                            />
                        </div>
                        <div className="col-span-6">
                            <Textinput
                                label={"Hobi"}
                                register={register}
                                name={"hobbies"}
                            />
                        </div>
                        <div className="col-span-6">
                            <Textinput
                                label={"Riwayat Kesehatan"}
                                register={register}
                                name={"health_history"}
                            />
                        </div>
                    </div>
                </div>
            </Card>
            <Card
                title={"Training and Certificates"}
                headerslot={
                    <Button
                        text={"Add New"}
                        icon="heroicons-outline:plus"
                        className="btn-dark py-2"
                        onClick={() => appendTrainingCertificate()}
                    />
                }
            >
                <div className="space-y-4">
                    {fieldTrainingCertificates.map((item, index) => (
                        <div className="grid grid-cols-2 gap-4">
                            <Textinput
                                label={"Nama Training / Sertifikat"}
                                id={`name${index}`}
                                register={register}
                                name={`training_certificates[${index}].name`}
                            />
                            <div className="flex justify-between items-end space-x-5">
                                <div className="flex-1">
                                    <Textinput
                                        label={"Periode"}
                                        id={`name2${index}`}
                                        register={register}
                                        name={`training_certificates[${index}].period`}
                                    />
                                </div>
                                <div className="flex-none relative">
                                    <button
                                        onClick={() =>
                                            removeTrainingCertificate(index)
                                        }
                                        type="button"
                                        className="inline-flex items-center justify-center h-10 w-10 bg-danger-500 text-lg border rounded border-danger-500 text-white"
                                    >
                                        <Icons icon="heroicons-outline:trash" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </Card>
            <Card
                title={"Previous Work Information"}
                headerslot={
                    <Button
                        text={"Add New"}
                        icon="heroicons-outline:plus"
                        className="btn-dark py-2"
                        onClick={() => appendPreviousWork()}
                    />
                }
            >
                <div className="space-y-4">
                    {fieldPreviousWorks.map((item, index) => (
                        <div className="grid grid-cols-3 gap-4">
                            <Textinput
                                label={"Nama Perusahaan"}
                                id={`name2${index}`}
                                register={register}
                                name={`previous_works[${index}].company_name`}
                            />
                            <Textinput
                                label={"Jabatan"}
                                id={`name3${index}`}
                                register={register}
                                name={`previous_works[${index}].position`}
                            />
                            <div className="flex justify-between items-end space-x-5">
                                <div className="flex-1">
                                    <Textinput
                                        label={"Periode"}
                                        id={`name4${index}`}
                                        register={register}
                                        name={`previous_works[${index}].work_period`}
                                    />
                                </div>
                                <div className="flex-none relative">
                                    <button
                                        onClick={() =>
                                            removePreviousWork(index)
                                        }
                                        type="button"
                                        className="inline-flex items-center justify-center h-10 w-10 bg-danger-500 text-lg border rounded border-danger-500 text-white"
                                    >
                                        <Icons icon="heroicons-outline:trash" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </Card>
            <Card title={"Social Media Information"}>
                <div className="space-y-4">
                    <div className="grid grid-cols-12 gap-4">
                        <div className="col-span-6">
                            <Textinput
                                label={"LinkedIn"}
                                name={"linkedin"}
                                register={register}
                            />
                        </div>
                        <div className="col-span-6">
                            <Textinput
                                label={"Twitter/X"}
                                name={"twitter"}
                                register={register}
                            />
                        </div>
                        <div className="col-span-6">
                            <Textinput
                                label={"Facebook"}
                                name={"facebook"}
                                register={register}
                            />
                        </div>
                        <div className="col-span-6">
                            <Textinput
                                label={"Instagram"}
                                name={"instagram"}
                                register={register}
                            />
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default OtherInformationForm;
