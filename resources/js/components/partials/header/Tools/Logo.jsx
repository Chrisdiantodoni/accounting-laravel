import React from "react";
import useDarkMode from "@/hooks/useDarkMode";
import useWidth from "@/hooks/useWidth";

import MainLogo from "@/assets/images/Logo-Alfa.png";
import LogoWhite from "@/assets/images/logo/logo-white.svg";
import MobileLogo from "@/assets/images/Logo-Alfa.png";
import MobileLogoWhite from "@/assets/images/logo/logo-c-white.svg";
import { Link } from "@inertiajs/react";
const Logo = () => {
    const [isDark] = useDarkMode();
    const { width, breakpoints } = useWidth();

    return (
        <div>
            <Link href="/dashboard">
                {width >= breakpoints.xl ? (
                    <img src={isDark ? LogoWhite : MainLogo} alt="" />
                ) : (
                    <img
                        src={isDark ? MobileLogoWhite : MobileLogo}
                        alt=""
                        className="w-10"
                    />
                )}
            </Link>
        </div>
    );
};

export default Logo;
