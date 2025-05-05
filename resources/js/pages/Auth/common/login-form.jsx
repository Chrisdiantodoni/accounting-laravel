import React, { useState } from "react";
import Textinput from "@/components/ui/Textinput";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Checkbox from "@/components/ui/Checkbox";
import Button from "@/components/ui/Button";
import { useForm } from "@inertiajs/react";

const schema = yup
    .object({
        username: yup.string().trim().required("Username is Required"),
        password: yup.string().trim().required("Password is Required"),
    })
    .required();
const LoginForm = () => {
    const { data, setData, errors, post, processing } = useForm({
        username: "",
        password: "",
    });

    const login = (e) => {
        e.preventDefault();
        post("/login", data);
    };

    const [checked, setChecked] = useState(false);

    return (
        <form onSubmit={login} className="space-y-4 ">
            <Textinput
                label="Username"
                type="text"
                error={errors.username}
                value={data.username}
                onChange={(e) => setData("username", e.target.value)}
                placeholder="Username"
            />
            <Textinput
                label="password"
                type="password"
                error={errors.password}
                placeholder="password"
                value={data.password}
                onChange={(e) => setData("password", e.target.value)}
                hasicon={true}
            />
            {/* <Controller
        name="password"
        control={control}
        render={({ field: { onChange, value } }) => (
          <Textinput
            label="password"
            // register={register}
            value={value}
            onChange={onChange}
            // name={"password"}
            type="password"
            error={errors.password}
            placeholder="password"
            hasicon={true}
          />
        )}
      /> */}
            <div className="flex justify-between">
                <Checkbox
                    value={checked}
                    onChange={() => setChecked(!checked)}
                    label="Keep me signed in"
                />
            </div>

            <Button
                type="submit"
                text="Sign in"
                className="btn btn-dark block w-full text-center "
                isLoading={processing}
            />
        </form>
    );
};

export default LoginForm;
