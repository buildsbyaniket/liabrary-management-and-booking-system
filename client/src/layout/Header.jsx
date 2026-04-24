import React, { useEffect, useState } from "react";
import settingIcon from "../assets/setting.png";
import userIcon from "../assets/user.png";
import { useDispatch, useSelector } from "react-redux";
import { toggleSettingPopUp } from "../store/slices/popUpSlice";

const Header = () => {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth || {});

    const [time, setTime] = useState("");
    const [date, setDate] = useState("");

    useEffect(() => {
        const update = () => {
            const now = new Date();
            setTime(now.toLocaleTimeString());
            setDate(now.toDateString());
        };
        update();
        const id = setInterval(update, 1000);
        return () => clearInterval(id);
    }, []);

    return (
        <header className="fixed top-0 left-0 right-0 h-16 z-40 flex items-center justify-between px-6 bg-white/80 backdrop-blur-md border-b">

            <div className="flex items-center gap-3">
                <img src={userIcon} className="w-8 h-8 rounded-full" />
                <div>
                    <p className="font-semibold text-sm">{user?.name}</p>
                    <p className="text-xs text-gray-500">{user?.role}</p>
                </div>
            </div>

            <div className="hidden md:flex flex-col items-end text-sm text-gray-600">
                <span>{time}</span>
                <span>{date}</span>
            </div>

            <img
                src={settingIcon}
                onClick={() => dispatch(toggleSettingPopUp())}
                className="w-6 h-6 cursor-pointer hover:rotate-12 transition"
            />

        </header>
    );
};

export default Header;