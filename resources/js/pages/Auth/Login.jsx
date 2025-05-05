import React from "react";
import { Link } from "react-router-dom";
import LoginForm from "./common/login-form";
import Social from "./common/social";
import useDarkMode from "@/hooks/useDarkMode";

// image import
import LogoWhite from "@/assets/images/logo/logo-white.svg";
import Logo from "@/assets/images/logo/logo.svg";
import Illustration from "@/assets/images/background.png";
import Flasher from "@/components/ui/Flasher";

const Login = () => {
    const [isDark] = useDarkMode();
    return (
        <>
            <div className="loginwrapper">
                <div className="lg-inner-column">
                    <div className="left-column relative z-[1]">
                        <div className="absolute left-0 h-full w-full z-[-1]">
                            <img
                                src={Illustration}
                                alt=""
                                className="h-full w-full"
                            />
                        </div>
                    </div>
                    <div className="right-column relative">
                        <div className="inner-content h-full flex flex-col bg-white dark:bg-slate-800">
                            <div className="auth-box h-full flex flex-col justify-center">
                                <div className="text-center 2xl:mb-10 mb-4">
                                    <h4 className="font-medium">Sign in</h4>
                                </div>
                                <LoginForm />
                                <Flasher />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Login;
