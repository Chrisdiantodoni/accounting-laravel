import Card from "@/components/ui/Card";
import DatePicker from "@/components/ui/DatePicker";
import SelectComponent from "@/components/ui/Master/Select";
import Select from "@/components/ui/Select";
import Textarea from "@/components/ui/Textarea";
import Textinput from "@/components/ui/Textinput";
import ReactSelect from "@/pages/forms/select/ReactSelect";
import master from "@/services/api/master";
import queryString from "@/utils/queryString";
import { usePage } from "@inertiajs/react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
const JobInformationForm = () => {
    const { departments, positions, auth } = usePage().props;
    console.log(auth);
    const [dealerMenuOpen, setDealerMenuOpen] = useState(false);
    const [dealerNeqMenuOpen, setDealerNeqMenuOpen] = useState(false);

    const [dealer, setDealer] = useState([]);
    const [dealerNeq, setDealerNeq] = useState([]);

    const {
        register,
        control,
        watch,
        formState: { errors },
    } = useFormContext();

    const employee_status = [
        {
            label: "Tetap",
            value: "tetap",
        },
        {
            label: "Kontrak",
            value: "kontrak",
        },
        {
            label: "Freelance",
            value: "freelance",
        },
        {
            label: "Magang",
            value: "magang",
        },
    ];

    const dealerQueryString = queryString.stringified({
        limit: 99,
    });

    // const { mutate: getDealer, isPending: isLoadingDealer } = useMutation({
    //     mutationKey: ["getDealer"],
    //     mutationFn: async () => {
    //         const response = await master.getDealer(dealerQueryString);
    //         setDealer(
    //             response?.data?.data?.map((item) => ({
    //                 label: item?.dealer_name,
    //                 value: item,
    //             }))
    //         );
    //         return response;
    //     },
    // });

    const neqQueryString = queryString.stringified({
        dealer_id: watch("dealer")?.value?.dealer_id,
        limit: 99,
    });

    const handleChangeDealerMenuOpen = () => {
        setDealerMenuOpen(!dealerMenuOpen);
    };
    const handleChangeDealerNeqMenuOpen = () => {
        setDealerNeqMenuOpen(!dealerNeqMenuOpen);
    };

    const { mutate: getDealerNeq, isPending: isLoadingDealerNeq } = useMutation(
        {
            mutationKey: ["getDealerNeq"],
            mutationFn: async () => {
                const response = await master.getDealerNeq(neqQueryString);
                setDealerNeq(
                    response?.data?.data?.map((item) => ({
                        label: item?.dealer_neq_name,
                        value: item,
                    }))
                );
                return response;
            },
        }
    );

    // useEffect(() => {
    //     if (dealerMenuOpen) {
    //         getDealer();
    //     }
    // }, [dealerMenuOpen]);

    useEffect(() => {
        if (dealerNeqMenuOpen || watch("dealer")) {
            getDealerNeq();
        }
    }, [dealerNeqMenuOpen, watch("dealer")]);

    console.log(errors);

    return (
        <div className="space-y-4">
            <Card title={"Job Information"}>
                <div className="space-y-4">
                    <div className="grid grid-cols-12 gap-4">
                        <div className="col-span-12">
                            <Select
                                label={"Jabatan"}
                                register={register}
                                name={"position_id"}
                                placeholder="Pilih Jabatan"
                                options={positions?.map((item) => ({
                                    label: item?.position_name,
                                    value: item?.position_id,
                                }))}
                                error={errors?.position_id}
                            />
                        </div>
                        <div className="col-span-6">
                            <Select
                                label={"Departemen"}
                                register={register}
                                placeholder="Pilih Departemen"
                                name={"department_id"}
                                options={departments?.map((item) => ({
                                    label: item?.department_name,
                                    value: item?.department_id,
                                }))}
                                error={errors?.department_id}
                            />
                        </div>
                        <div className="col-span-6">
                            <DatePicker
                                label={"Tanggal Mulai Bekerja"}
                                form
                                control={control}
                                name={"start_work_date"}
                                error={errors?.start_work_date}
                            />
                        </div>
                        <div className="col-span-12">
                            <Select
                                label={"Status Karyawan"}
                                options={employee_status}
                                register={register}
                                name={"job_status"}
                            />
                        </div>
                        <div className="col-span-6">
                            <SelectComponent
                                label={"Dealer"}
                                options={auth.user.dealers?.map((item) => ({
                                    label: item.dealer_name,
                                    value: item,
                                }))}
                                required={true}
                                form
                                control={control}
                                name={"dealer"}
                                error={errors?.dealer}
                                onMenuOpen={handleChangeDealerMenuOpen}
                            />
                        </div>
                        <div className="col-span-6">
                            <SelectComponent
                                label={"NEQ"}
                                form
                                options={dealerNeq}
                                isLoading={isLoadingDealerNeq}
                                control={control}
                                name={"neq"}
                                error={errors?.neq}
                                onMenuOpen={handleChangeDealerNeqMenuOpen}
                            />
                        </div>
                        <div className="col-span-6">
                            <Textinput
                                required={true}
                                label={"NIP"}
                                name={"nip"}
                                register={register}
                                error={errors.nip}
                            />
                        </div>
                        <div className="col-span-6">
                            <Textinput
                                label={"No. Rekening"}
                                name={"bank_account_number"}
                                register={register}
                            />
                        </div>
                        <div className="col-span-6">
                            <Textinput
                                label={"Nama Bank"}
                                name={"bank_name"}
                                register={register}
                            />
                        </div>
                        <div className="col-span-6">
                            <Textinput
                                label={"Cabang Bank"}
                                name={"branch_of_bank"}
                                register={register}
                            />
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default JobInformationForm;
