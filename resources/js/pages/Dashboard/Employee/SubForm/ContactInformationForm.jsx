import Card from "@/components/ui/Card";
import Textarea from "@/components/ui/Textarea";
import Textinput from "@/components/ui/Textinput";
import { useFormContext } from "react-hook-form";
const ContactInformationForm = () => {
    const {
        register,
        control,
        formState: { errors },
    } = useFormContext();
    return (
        <div className="space-y-4">
            <Card title={"Contact Information"}>
                <div className="space-y-4">
                    <div className="grid grid-cols-12 space-x-4">
                        <div className="col-span-6">
                            <Textinput
                                label={"No. Telepon"}
                                name={"contact_tel_number"}
                                register={register}
                            />
                        </div>
                        <div className="col-span-6">
                            <Textinput
                                label={"No. Ponsel"}
                                name={"contact_phone_number"}
                                register={register}
                                error={errors.contact_phone_number}
                                required
                            />
                        </div>
                    </div>
                    <Textinput
                        label={"Email"}
                        name={"contact_email"}
                        register={register}
                    />
                </div>
            </Card>
            <Card title={"Emergency Contact Information"}>
                <div className="grid grid-cols-12 gap-5">
                    <div className="col-span-6">
                        <Textinput
                            label={"Nama"}
                            register={register}
                            name={"emergency_name"}
                        />
                    </div>
                    <div className="col-span-6">
                        <Textinput
                            label={"Hubungan"}
                            register={register}
                            name={"relation"}
                        />
                    </div>
                    <div className="col-span-6">
                        <Textinput
                            label={"No. Telepon"}
                            register={register}
                            name={"emergency_tel_number"}
                        />
                    </div>
                    <div className="col-span-6">
                        <Textinput
                            label={"No. Ponsel"}
                            register={register}
                            name={"emergency_phone_number"}
                        />
                    </div>
                    <div className="col-span-12">
                        <Textarea
                            label={"Alamat"}
                            className="min-h-20"
                            register={register}
                            name={"emergency_address"}
                        />
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default ContactInformationForm;
