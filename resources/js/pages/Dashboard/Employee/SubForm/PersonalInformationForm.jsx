import Card from "@/components/ui/Card";
import DatePicker from "@/components/ui/DatePicker";
import FormGroup from "@/components/ui/FormGroup";
import Radio from "@/components/ui/Radio";
import Select from "@/components/ui/Select";
import Textarea from "@/components/ui/Textarea";
import Textinput from "@/components/ui/Textinput";
import { useForm, usePage } from "@inertiajs/react";
import { useState } from "react";
import { useFormContext } from "react-hook-form";
import Fileinput from "@/components/ui/Fileinput";

const PersonalInformationForm = ({
    selectedFile,
    selectedFiles,
    handleFileChange,
    handleFileChangeMultiple,
    errorFoto,
    handleDeleteFileMultiple,
}) => {
    const {
        register,
        control,
        formState: { errors },
    } = useFormContext();

    const { employee } = usePage().props;

    const options = [
        {
            label: "Laki-laki",
            value: "man",
        },
        {
            label: "Perempuan",
            value: "woman",
        },
    ];

    const maritalOptions = [
        {
            label: "Belum Menikah",
            value: "Belum Menikah",
        },
        {
            label: "Menikah",
            value: "Menikah",
        },
        {
            label: "Cerai Hidup",
            value: "Cerai Hidup",
        },
        {
            label: "Cerai Mati",
            value: "Cerai Mati",
        },
        {
            label: "Janda/Duda",
            value: "Janda/Duda",
        },
    ];

    const bloodOptions = [
        {
            label: "A⁻",
            value: "A-",
        },
        {
            label: "A⁺",
            value: "A+",
        },
        {
            label: "B⁺",
            value: "B+",
        },
        {
            label: "B⁻",
            value: "B-",
        },
        {
            label: "AB⁺",
            value: "AB+",
        },
        {
            label: "AB⁻",
            value: "AB-",
        },
        {
            label: "O⁺",
            value: "O+",
        },
        {
            label: "O⁻",
            value: "O-",
        },
    ];
    return (
        <Card title={"Personal Information"}>
            <div className="space-y-4">
                <Textinput
                    label={"Nama Lengkap"}
                    name="full_name"
                    register={register}
                    type={"text"}
                    error={errors.full_name}
                    required
                />
                <div className="grid grid-cols-12 space-x-4">
                    <div className="col-span-3">
                        <Textinput
                            label={"Tempat Lahir"}
                            name={"place_of_birth"}
                            register={register}
                            error={errors.place_of_birth}
                            required
                        />
                    </div>
                    <div className="col-span-3">
                        <DatePicker
                            label={"Tanggal Lahir"}
                            form
                            control={control}
                            name={"date_of_birth"}
                            error={errors.date_of_birth}
                            required
                        />
                    </div>
                    <div className="col-span-6 ">
                        <Select
                            control={control}
                            options={options}
                            label={"Jenis Kelamin"}
                            name={"gender"}
                            register={register}
                        />
                    </div>
                </div>
                <Textarea
                    label={"Alamat KTP"}
                    row={3}
                    className="min-h-20"
                    name={"card_address"}
                    register={register}
                    error={errors.card_address}
                    required
                />
                <Textarea
                    label={"Alamat Domisili"}
                    row={3}
                    className="min-h-20"
                    name={"domicile_address"}
                    register={register}
                />
                <Textinput
                    label={"Nomor KTP"}
                    register={register}
                    name={"nik"}
                    error={errors.nik}
                    required={true}
                />
                <Textinput
                    label={"Nomor NPWP"}
                    register={register}
                    name={"npwp"}
                />
                <div className="grid grid-cols-12 space-x-4">
                    <div className="col-span-6">
                        <Textinput
                            label={"No. BPJS kesehatan"}
                            name={"bpjs_health_number"}
                            register={register}
                        />
                    </div>
                    <div className="col-span-6">
                        <Textinput
                            label={"No. BPJS Ketenagakerjaan"}
                            name={"bpjs_employment_number"}
                            register={register}
                        />
                    </div>
                </div>
                <div className="grid grid-cols-12 space-x-4">
                    <div className="col-span-6">
                        <Select
                            label={"Status Pernikahan"}
                            options={maritalOptions?.map((item) => ({
                                label: item?.label,
                                value: item?.value,
                            }))}
                            register={register}
                            name={"marital_status"}
                        />
                    </div>
                    <div className="col-span-6">
                        <Textinput
                            label={"Nama Pasangan"}
                            name={"partners_name"}
                            register={register}
                        />
                    </div>
                </div>
                <div className="grid grid-cols-12 space-x-4">
                    <div className="col-span-6">
                        <Textinput
                            label={"Jumlah Pertanggungan"}
                            name={"dependents_number"}
                            register={register}
                            isMask={true}
                            options={{ numeral: true }}
                        />
                    </div>
                    <div className="col-span-6">
                        <Select
                            label={"Golongan Darah"}
                            options={bloodOptions.map((item) => ({
                                label: item?.label,
                                value: item?.value,
                            }))}
                            placeholder="Pilih"
                            defaultValue={""}
                            name={"blood_type"}
                            register={register}
                        />
                    </div>
                </div>
                {/* {!employee && (
                    <> */}
                <Card
                    title={
                        <>
                            <span>Upload Foto Karyawan</span>
                            <span className="text-danger-500"> *</span>
                        </>
                    }
                    titleClass="font-medium text-lg"
                >
                    <div className="col-span-12">
                        <Fileinput
                            required={true}
                            label="Upload Foto Karyawan"
                            name="basic"
                            selectedFile={selectedFile}
                            onChange={handleFileChange}
                            accept="image/*"
                            preview
                        />
                        {errorFoto && (
                            <p className="text-danger-500 mt-2 text-sm">
                                Foto Karyawan wajib di upload
                            </p>
                        )}
                    </div>
                </Card>
                <Card
                    title={"Upload Data Tambahan"}
                    titleClass="font-medium text-lg"
                >
                    <div className="col-span-12">
                        <Fileinput
                            label="Upload Data Tambahan"
                            name="basic"
                            selectedFiles={selectedFiles}
                            onChange={handleFileChangeMultiple}
                            preview
                            accept="image/*,application/pdf"
                            multiple={true}
                            onDelete={handleDeleteFileMultiple}
                        />
                    </div>
                </Card>
                {/* </>
                )} */}
            </div>
        </Card>
    );
};

export default PersonalInformationForm;
