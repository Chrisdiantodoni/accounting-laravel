import Card from "@/components/ui/Card";
import Select from "@/components/ui/Select";
import Textarea from "@/components/ui/Textarea";
import Textinput from "@/components/ui/Textinput";
import { useFormContext } from "react-hook-form";
const AcademicInformationForm = () => {
    const {
        register,
        control,
        formState: { errors },
    } = useFormContext();
    return (
        <div className="space-y-4">
            <Card title={"Academic Information"}>
                <div className="space-y-4">
                    <div className="grid grid-cols-12 gap-4">
                        <div className="col-span-12">
                            <Textinput
                                label={"Pendidikan Terakhir"}
                                register={register}
                                name={"last_education"}
                                error={errors.last_education}
                                required={true}
                            />
                        </div>
                        <div className="col-span-6">
                            <Textinput
                                label={"Nama Institusi"}
                                register={register}
                                name={"institute_name"}
                            />
                        </div>
                        <div className="col-span-6">
                            <Textinput
                                label={"Jurusan"}
                                register={register}
                                name={"major"}
                            />
                        </div>
                        <div className="col-span-6">
                            <Textinput
                                label={"Tahun Lulus"}
                                name={"year_graduate"}
                                register={register}
                            />
                        </div>
                        <div className="col-span-6">
                            <Textinput
                                label={"Gelar"}
                                name={"academic_title"}
                                register={register}
                            />
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default AcademicInformationForm;
