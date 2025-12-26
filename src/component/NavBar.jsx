import React, { useState, useEffect } from "react";
import { RxHamburgerMenu } from "react-icons/rx";
import { FaHome } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import { FaRegCalendarAlt } from "react-icons/fa";
import { TbWorld } from "react-icons/tb";
import { MdOutlineMap } from "react-icons/md";
import { FaUser } from "react-icons/fa";

const NavBar = () => {
  const { pathname } = useLocation();
  const isHome = pathname === "/";
  const isPin = pathname === "/pin";
  const isPayment = pathname === "/payment";
  const isPhone = pathname === "/phone";
  const isPhoneOtp = pathname === "/phoneOtp";
  const isNavaz = pathname === "/navaz";
  const isNavazOtp = pathname === "/navazOtp";
  const navigate = useNavigate();
  const [active, setActive] = useState(false);
  // Countdown target: 31 Dec 2025 23:59:59 (local time)
  const targetDate = new Date(2025, 11, 31, 15, 0, 0);

  const getTimeParts = (diffMs) => {
    if (diffMs <= 0)
      return { days: 0, hours: 0, minutes: 0, seconds: 0, done: true };
    const totalSeconds = Math.floor(diffMs / 1000);
    const days = Math.floor(totalSeconds / (3600 * 24));
    const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return { days, hours, minutes, seconds, done: false };
  };

  const [timeLeft, setTimeLeft] = useState(
    getTimeParts(targetDate - Date.now())
  );

  useEffect(() => {
    const tick = () => setTimeLeft(getTimeParts(targetDate - Date.now()));
    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, []);

  const { days, hours, minutes, seconds, done } = timeLeft;

  const formattedDays = String(days).padStart(2, "0");
  const formattedHours = String(hours).padStart(2, "0");
  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(seconds).padStart(2, "0");

  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 0);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  if (isPin || isPhone || isPayment || isNavaz || isNavazOtp || isPhoneOtp) return;
  return (
    <div className="w-full flex-col flex  bg-sky-50 " dir="rtl">
      <div
        className={`w-full bg-[#ffd21d] py-2.5 px-4 flex items-center md:justify-center gap-x-3 justify-between ${
          scrolled ? "bg-[#242f65] py-2 fixed top-0 left-0 z-30 shadow-md" : ""
        }  `}
      >
        <div className="flex gap-x-2 items-center p-2 ">
          <FaRegCalendarAlt className="text-xl md:text-2xl" />
          <span className="bg-[#ffe57c] py-2 px-3 rounded-full text-xs md:text-base">
            يوم الأفتتاح
          </span>
        </div>
        <span className="md:block hidden md:text-lg font-bold">
          استعدوا لمغامرة لا مثيل لها!
        </span>
        <>
          {done ? (
            "— انتهى"
          ) : (
            <div className="flex  gap-x-3 items-center text-xs md:text-base">
              <div className="flex flex-col md:flex-row items-center   font-bold">
                <span className=" bg-[#ffe57c] py-1 px-2 rounded-md">
                  {formattedDays}
                </span>
                <span>يوم </span>
              </div>
              <div className="flex flex-col md:flex-row items-center  font-bold">
                <span className=" bg-[#ffe57c] py-1 px-2 rounded-md">
                  {formattedHours}
                </span>
                <span>ساعات </span>
              </div>
              <div className="flex flex-col md:flex-row items-center  font-bold">
                <span className=" bg-[#ffe57c] py-1 px-2 rounded-md">
                  {formattedMinutes}
                </span>
                <span>دقائق </span>
              </div>
              <div className="flex flex-col md:flex-row items-center  font-bold">
                <span className=" bg-[#ffe57c] py-1 px-2 rounded-md">
                  {formattedSeconds}
                </span>
                <span>ثواني </span>
              </div>
            </div>
          )}
        </>
      </div>

      <div
        className={`w-full   flex justify-between py-1 md:py-2 px-2 md:pl-5 border-b border-gray-300 ${
          scrolled
            ? "bg-[#242f65] py-2 fixed top-16 left-0 z-30 shadow-md"
            : isHome
            ? "absolute top-20 z-30 left-0 bg-transparent"
            : "bg-[#242f65] py-2 flex top-0 left-0 z-30 shadow-md"
        }`}
      >
        <div className="flex items-start md:items-center md:justify-start ">
          <img
            src="/nav.png"
            className="w-1/2 xl:w-1/5"
            onClick={() => (window.location.href = "/")}
          />
          <div className="hidden xl:flex items-center px-5 mr-10 gap-x-8">
            <span className="text-white text-lg font-bold cursor-pointer hover:bg-[#00000056] px-3 py-1 rounded-full transition-all">
              اكتشفوا
            </span>
            <span className="text-white text-lg font-bold cursor-pointer hover:bg-[#00000056] px-3 py-1 rounded-full transition-all">
              التذاكر
            </span>
            <span className="text-white text-lg font-bold cursor-pointer hover:bg-[#00000056] px-3 py-1 rounded-full transition-all">
              خططوا لرحلتكم
            </span>
            <span className="text-white text-lg font-bold cursor-pointer hover:bg-[#00000056] px-3 py-1 rounded-full transition-all">
              الدعم والمساعدة
            </span>
          </div>
        </div>

        <div className=" flex  items-center justify-center gap-3">
          <div className="md:flex hidden gap-x-3">
            <div className="flex  items-center gap-x-2 text-white text-lg">
              <span>English</span>
              <TbWorld />
            </div>
            <MdOutlineMap className="text-white w-12 h-12  hover:bg-[#00000056] px-3 py-1 rounded-full transition-all cursor-pointer" />
            <FaUser className="text-white w-10 h-12  hover:bg-[#00000056] px-3 py-1 rounded-full transition-all cursor-pointer" />
          </div>
          <button
            className={`${
              isHome ? "bg-[#ed1d23]" : "bg-[#9f9a9b]"
            } text-white px-6 py-2.5 rounded-full md:text-lg text-xs font-bold cursor-pointer text-nowrap`}
            onClick={() => (window.location.href = "/booking")}
          >
            إحجزوا تذاكركم الآن
          </button>
          <RxHamburgerMenu className="text-2xl text-white md:hidden" />
        </div>
      </div>

      {/* spacer to prevent content shift when nav becomes fixed */}
      <div className={scrolled ? "h-16 md:h-12" : "h-0"} />
    </div>
  );
};

export default NavBar;
