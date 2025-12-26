import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FaCheck, FaFireAlt } from "react-icons/fa";
import { BsFillInfoCircleFill, BsInfoSquareFill } from "react-icons/bs";
import { IoIosArrowDown } from "react-icons/io";
import { IoMdInformationCircle } from "react-icons/io";
import { FiTrash } from "react-icons/fi";
import { BiInfoCircle } from "react-icons/bi";
import { MdLibraryAddCheck } from "react-icons/md";
import GoFastTicketCard from "../component/GoFastTicketCard";

const steps = ["اختيار التذاكر", "الإضافات والخيارات الإضافية", "سلة", "الدفع"];

export const mockTickets = [
  {
    id: "one-day",
    title: "تذكرة يوم واحد",
    subtitle: "تذكرتكم لركوب كافة الألعاب ودخول التجارب بلا حدود",
    price: "450.00",
    mockPrice: "325.00",
    img: "/ticket1.png",
  },
  {
    id: "family",
    title: "باقة المرح العائلية",
    subtitle: "باقة من خمس تذاكر صالحة في نفس اليوم - مثالية للعائلات",
    price: "1,600.00",
    mockPrice: "1,200.00",
    img: "/ticket2.png",
  },
];

const Booking = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [currentSection, setCurrentSection] = useState(1);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [pop, setPop] = useState(false);
  const [checkBoxChecked, setCheckBox] = useState(false);
  const [errorPop, setErrorPop] = useState(false);

  // Refs for scrolling to sections
  const section2Ref = useRef(null);
  const section3Ref = useRef(null);

  // ticket visitors for step 2
  const [adultVisitors, setAdultVisitors] = useState([]);
  const [childVisitors, setChildVisitors] = useState([]);

  // calendar (section 3) state
  const [calendarDate, setCalendarDate] = useState(() => {
    const d = new Date();
    d.setDate(1);
    return d;
  });
  const [selectedDate, setSelectedDate] = useState(null);
  const [showDateModal, setShowDateModal] = useState(false);
  const [dateConfirmed, setDateConfirmed] = useState(null);
  const formatSelectedLong = (d) =>
    d
      ? d.toLocaleDateString("ar-EG", {
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric",
        })
      : "";

  const formatArabicMonthYear = (d) =>
    d.toLocaleString("ar-EG", { month: "long", year: "numeric" });

  const goPrevMonth = () =>
    setCalendarDate(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1)
    );
  const goNextMonth = () =>
    setCalendarDate(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1)
    );

  const generateCalendarCells = (d) => {
    const year = d.getFullYear();
    const month = d.getMonth();
    const firstDayIndex = new Date(year, month, 1).getDay(); // 0 Sun
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const cells = [];
    for (let i = 0; i < firstDayIndex; i++) cells.push(null);
    for (let day = 1; day <= daysInMonth; day++) cells.push(day);
    while (cells.length % 7 !== 0) cells.push(null);
    return cells;
  };

  const oneDayTicket = mockTickets.find((x) => x.id === "one-day");
  const adultPrice = oneDayTicket
    ? Number(oneDayTicket.price.replace(/,/g, ""))
    : 325;
  const childPrice = 275;

  const totalTickets = adultVisitors.length + childVisitors.length;
  const totalPrice =
    adultVisitors.length * adultPrice + childVisitors.length * childPrice;

  const allNamesFilled =
    adultVisitors.every((n) => n && n.trim() !== "") &&
    childVisitors.every((n) => n && n.trim() !== "");

  return (
    <div className="w-full bg-[#f3fafc] min-h-screen flex items-center flex-col ">
      {pop ? (
        <div className="w-full bg-[#00000069] h-screen fixed z-50 flex items-center justify-center">
          <div className="bg-white w-11/12 xl:w-1/3 md:w-1/2 py-6 rounded-lg px-4 text-center flex flex-col">
            <h4 className="font-bold text-xl">لحظة ... قبل أن تكملوا</h4>
            <p className="text-sm  p-2">
              لشراء التذاكر عبر مناصتنا الرقمية ، يجب أن يكون عمرك 18 عاماً أو
              أكثر. يرجى تأكيد عمرك.
            </p>
            <div className="flex flex-col gap-y-5 py-3">
              <button
                className="bg-red-500 text-white py-3 rounded-full"
                onClick={() => {
                  setPop(false);
                  setErrorPop(false);
                  setCurrentSection(2);
                  setTimeout(() => {
                    section2Ref.current?.scrollIntoView({
                      behavior: "smooth",
                      block: "start",
                    });
                  }, 100);
                }}
              >
                نعم , عمري 18 عاماً أو أكثر
              </button>
              <button
                className="border border-red-500 text-red-500 py-3 rounded-full"
                onClick={() => {
                  setPop(false);
                  setSelectedTicket(null);
                  setErrorPop(true);
                  setTimeout(() => setErrorPop(false), 3000);
                }}
              >
                لا, إلغاء
              </button>
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
      {currentStep === 1 ? (
        <>
          <div className="mb-8 w-full bg-white pt-5 px-2" dir="rtl">
            <div className="w-full flex items-center justify-between mb-4">
              <div className=" w-full flex items-center gap-3">
                {/* small dashes */}
                {[1, 2, 3, 4].map((n) => (
                  <div
                    key={n}
                    className={` ${
                      n === currentStep
                        ? "w-full bg-[#162041] "
                        : n < currentStep
                        ? "w-10 bg-green-500"
                        : "w-10 bg-gray-200"
                    } h-1 rounded `}
                  />
                ))}
              </div>
            </div>
            <div className="w-full flex items-center justify-between mb-4">
              <div className=" w-full flex items-center gap-3">
                {[1, 2, 3, 4].map((step, idx) =>
                  step === currentStep ? (
                    <div key={idx} className={` w-full  rounded font-bold `}>
                      1. اختيار التذاكر
                    </div>
                  ) : (
                    <div className="text-sm text-[#22305e] font-semibold w-10 text-center">
                      {step}
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
          <div className="container  w-full px-6 relative border-b pb-5 border-gray-200">
            {/* Page content */}
            <div className="max-w-4xl mx-auto" dir="rtl">
              {/* Header for step 1 */}
              {currentStep === 1 && (
                <div className=" mb-8">
                  <h2 className="text-2xl md:text-4xl font-extrabold text-[#162041]">
                    اختاروا تذكرتكم
                  </h2>
                  <p className="text-[#162041] mt-2">
                    اختاروا نوع التذكرة الفردي شراؤها
                  </p>
                </div>
              )}

              {/* Ticket list (step 1) */}
              {currentStep === 1 && selectedTicket ? (
                mockTickets
                  .filter((t) => t.id === selectedTicket)
                  .map((t) => {
                    return (
                      <div
                        key={t.id}
                        className={`bg-white rounded-2xl shadow p-6 md:p-8 flex items-center gap-6 justify-between relative overflow-hidden ${
                          selectedTicket === t.id ? "ring-4 ring-[#6abe46]" : ""
                        }`}
                        dir="rtl"
                      >
                        <div className="flex items-start gap-6 w-full">
                          <div className="flex-1 text-right">
                            <div className="flex justify-between">
                              <div
                                className="flex items-start  gap-4 "
                                dir="rtl"
                              >
                                <img
                                  src={t.img}
                                  alt=""
                                  className="w-20 h-20 rounded-md object-cover"
                                />
                                <div>
                                  <div className="inline-block bg-[#e6f2ff] text-[#22305e] px-3 py-1 rounded-md text-xs font-semibold mb-2">
                                    تذاكر اليوم الواحد
                                  </div>
                                  <h3 className="text-2xl md:text-3xl font-bold text-[#162041]">
                                    {t.title}
                                  </h3>
                                </div>
                              </div>
                              <MdLibraryAddCheck className="text-[#0d9b0d] text-2xl" />
                            </div>

                            <p className="mt-4 text-gray-500 text-sm">
                              {t.subtitle}
                            </p>

                            <div className="flex flex-col gap-y-3">
                              <div className="mt-4 text-[#ed1d23] font-bold text-sm underline">
                                اكتشفوا المزيد
                              </div>
                              <div className=" bottom-4 left-6 text-right flex justify-between items-center">
                                <div className="text-sm text-gray-500">
                                  تبدأ من
                                </div>
                                <div className="text-2xl md:text-3xl font-bold text-[#162041] flex items-center gap-x-2 py-2">
                                  {t.mockPrice}{" "}
                                  <svg
                                    viewBox="0 0 18 20"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                    height="20"
                                    width="20"
                                  >
                                    <path
                                      d="M17.9471 11.9777C17.8663 12.7835 17.6552 13.552 17.3359 14.2599L10.5778 15.6967V11.3923L8.47252 11.8398V14.2273C8.47252 14.4454 8.4063 14.6478 8.29265 14.8158L7.19776 16.4393C6.92619 16.8347 6.50848 17.1221 6.02249 17.2232L0.0523682 18.4919C0.133235 17.6861 0.344316 16.9175 0.663643 16.2096L6.36729 14.9976V12.2873L1.04521 13.4183C1.12624 12.6125 1.33748 11.8439 1.65681 11.136L6.36729 10.1351V1.76681C6.94959 1.05572 7.66593 0.452726 8.47252 0V9.68776L10.5778 9.24028V2.81951C11.1601 2.10842 11.8764 1.50558 12.683 1.0527V8.79265L17.947 7.67405C17.8661 8.47985 17.655 9.2484 17.3357 9.9563L12.6832 10.945V13.0972L17.9471 11.9777Z"
                                      fill="currentColor"
                                    ></path>
                                    <path
                                      d="M10.5782 20C10.6591 19.1942 10.8702 18.4258 11.1895 17.7177L17.9471 16.2812C17.8661 17.0871 17.6552 17.8556 17.3358 18.5635L10.5782 20Z"
                                      fill="currentColor"
                                    ></path>
                                  </svg>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
              ) : (
                <div className="space-y-8">
                  {mockTickets.map((t) => (
                    <div
                      key={t.id}
                      className={`bg-white rounded-2xl shadow p-6 md:p-8 flex items-center gap-6 justify-between relative overflow-hidden ${
                        selectedTicket === t.id
                          ? "ring-2 ring-[#ed1d23]/30"
                          : ""
                      }`}
                      dir="rtl"
                    >
                      {/* select button (top-left) */}
                      <button
                        onClick={() => {
                          setPop(true);
                          window.scrollTo({ top: "0" });
                          sessionStorage.removeItem("add");
                          sessionStorage.removeItem("data");
                          setSelectedTicket(t.id);
                        }}
                        className={`absolute lg:top-6 left-6 bottom-6  rounded-full border px-4 py-2 text-sm font-bold  h-fit ${
                          selectedTicket === t.id
                            ? "bg-[#ed1d23] text-white border-[#ed1d23]"
                            : "text-[#ed1d23] border-[#ed1d23]"
                        }`}
                      >
                        إختيار
                      </button>

                      {/* content */}
                      <div className="flex items-start gap-6 w-full">
                        <div className="flex-1 text-right">
                          <div className="flex items-start  gap-4 " dir="rtl">
                            <img
                              src={t.img}
                              alt=""
                              className="w-20 h-20 rounded-md object-cover"
                            />
                            <div>
                              <div className="inline-block bg-[#e6f2ff] text-[#22305e] px-3 py-1 rounded-md text-xs font-semibold mb-2">
                                تذاكر اليوم الواحد
                              </div>
                              <h3 className="text-2xl md:text-3xl font-bold text-[#162041]">
                                {t.title}
                              </h3>
                            </div>
                          </div>

                          <p className="mt-4 text-gray-500">{t.subtitle}</p>

                          <div className="flex flex-col gap-y-3">
                            <div className="mt-4 text-[#ed1d23] font-bold text-sm underline">
                              اكتشفوا المزيد
                            </div>
                            <div className=" bottom-4 left-6 text-right">
                              <div className="text-sm text-gray-500">
                                تبدأ من
                              </div>
                              <div className="text-2xl md:text-3xl font-bold text-[#162041] flex items-center gap-x-2 py-2">
                                {t.mockPrice}{" "}
                                <svg
                                  viewBox="0 0 18 20"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                  height="20"
                                  width="20"
                                >
                                  <path
                                    d="M17.9471 11.9777C17.8663 12.7835 17.6552 13.552 17.3359 14.2599L10.5778 15.6967V11.3923L8.47252 11.8398V14.2273C8.47252 14.4454 8.4063 14.6478 8.29265 14.8158L7.19776 16.4393C6.92619 16.8347 6.50848 17.1221 6.02249 17.2232L0.0523682 18.4919C0.133235 17.6861 0.344316 16.9175 0.663643 16.2096L6.36729 14.9976V12.2873L1.04521 13.4183C1.12624 12.6125 1.33748 11.8439 1.65681 11.136L6.36729 10.1351V1.76681C6.94959 1.05572 7.66593 0.452726 8.47252 0V9.68776L10.5778 9.24028V2.81951C11.1601 2.10842 11.8764 1.50558 12.683 1.0527V8.79265L17.947 7.67405C17.8661 8.47985 17.655 9.2484 17.3357 9.9563L12.6832 10.945V13.0972L17.9471 11.9777Z"
                                    fill="currentColor"
                                  ></path>
                                  <path
                                    d="M10.5782 20C10.6591 19.1942 10.8702 18.4258 11.1895 17.7177L17.9471 16.2812C17.8661 17.0871 17.6552 17.8556 17.3358 18.5635L10.5782 20Z"
                                    fill="currentColor"
                                  ></path>
                                </svg>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {/* {currentSection === 2 ? (
            <span className="text-red-500 font-bold py-3 w-full flex items-center gap-x-2 justify-end text-sm ">
              عرض جميع أنواع التذاكر <IoIosArrowDown />
            </span>
          ) : (
            ""
          )} */}

              {errorPop ? (
                <div className="fixed top-20 bg-[#f9cca9] text-xs w-11/12 py-2 rounded-md px-2 z-50 flex items-center gap-x-4 ">
                  <BsInfoSquareFill className="text-[#fb8124] text-xl" />
                  لشراء التذاكر عبر مناصتنا الرقمية ، يجب أن يكون عمرك 18 عاماً
                  أو أكثر
                </div>
              ) : (
                ""
              )}
            </div>
          </div>{" "}
          {currentSection >= 2 ? (
            selectedTicket === "one-day" ? (
              <div
                ref={section2Ref}
                className="container  w-full px-6 relative border-b pb-5 border-gray-200"
                dir="rtl"
              >
                <div className=" my-8">
                  <h2 className="text-2xl md:text-4xl font-extrabold text-[#162041]">
                    عدد التذاكر
                  </h2>
                  <p className="text-[#162041] mt-2">
                    اختاروا عدد التذاكر للأفراد شراؤها.
                  </p>
                </div>

                {/* Info banner */}
                <div className="bg-[#a2d0e6] border border-[#d0eefb] rounded-md p-4 text-sm text-[#162041] flex items-start gap-2">
                  <IoMdInformationCircle className="text-[#1fa9e6] w-16 h-16 md:w-6 md:h-6" />
                  <p className="text-sm">
                    يرجى ملاحظة أن الرضع بعمر ثلاثة أعوام فأقل لا يحتاجون إلى
                    تذكرة. تتوفر تذاكر كبار السن للمواطنين، وتذاكر المرافقين،
                    وتذاكر ذوي الإعاقة للشراء في المكان.
                  </p>
                </div>

                <div className="mt-6 space-y-4">
                  {/* Adult */}
                  <div className="bg-white rounded-2xl p-6 shadow flex items-center justify-between">
                    <div className="w-2/3">
                      <div className="flex items-center gap-2 text-[#162041] font-semibold">
                        بالغ <IoMdInformationCircle className="text-base" />
                      </div>
                      <div className="text-sm text-gray-700">
                        للزوار بعمر 12 عاماً فما فوق
                      </div>
                      <div className="text-sm text-gray-600 mt-2">
                        ابتداء من{" "}
                        <span className="font-bold flex items-center gap-x-1 mt-1">
                          {adultPrice.toLocaleString()}
                          <svg
                            viewBox="0 0 18 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            height="20"
                            width="20"
                          >
                            <path
                              d="M17.9471 11.9777C17.8663 12.7835 17.6552 13.552 17.3359 14.2599L10.5778 15.6967V11.3923L8.47252 11.8398V14.2273C8.47252 14.4454 8.4063 14.6478 8.29265 14.8158L7.19776 16.4393C6.92619 16.8347 6.50848 17.1221 6.02249 17.2232L0.0523682 18.4919C0.133235 17.6861 0.344316 16.9175 0.663643 16.2096L6.36729 14.9976V12.2873L1.04521 13.4183C1.12624 12.6125 1.33748 11.8439 1.65681 11.136L6.36729 10.1351V1.76681C6.94959 1.05572 7.66593 0.452726 8.47252 0V9.68776L10.5778 9.24028V2.81951C11.1601 2.10842 11.8764 1.50558 12.683 1.0527V8.79265L17.947 7.67405C17.8661 8.47985 17.655 9.2484 17.3357 9.9563L12.6832 10.945V13.0972L17.9471 11.9777Z"
                              fill="currentColor"
                            ></path>
                            <path
                              d="M10.5782 20C10.6591 19.1942 10.8702 18.4258 11.1895 17.7177L17.9471 16.2812C17.8661 17.0871 17.6552 17.8556 17.3358 18.5635L10.5782 20Z"
                              fill="currentColor"
                            ></path>
                          </svg>
                          لكل شخص
                        </span>{" "}
                      </div>
                    </div>

                    <div className="flex w-1/3 items-center  rounded-full">
                      <button
                        className="w-8 h-8 rounded-full border flex items-center justify-center bg-white"
                        onClick={() =>
                          setAdultVisitors((prev) => prev.slice(0, -1))
                        }
                        aria-label="decrease adult"
                      >
                        -
                      </button>
                      <div className="w-10 text-center font-bold bg-gray-100">
                        {adultVisitors.length}
                      </div>
                      <button
                        className="w-8 h-8 rounded-full border flex items-center justify-center bg-white"
                        onClick={() =>
                          setAdultVisitors((prev) =>
                            prev.length < 20 ? [...prev, ""] : prev
                          )
                        }
                        aria-label="increase adult"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* adult visitor names */}
                  {adultVisitors.map((name, idx) => (
                    <div
                      key={idx}
                      className="bg-white rounded-2xl p-4 shadow mt-4"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          بالغ {idx + 1}
                        </div>
                        <button
                          onClick={() =>
                            setAdultVisitors((prev) =>
                              prev.filter((_, i) => i !== idx)
                            )
                          }
                          className="text-gray-400"
                        >
                          <FiTrash />
                        </button>
                      </div>
                      <input
                        value={name}
                        onChange={(e) =>
                          setAdultVisitors((prev) => {
                            const copy = [...prev];
                            copy[idx] = e.target.value;
                            return copy;
                          })
                        }
                        placeholder="اسم الزائر *"
                        className="mt-3 w-full border-b pb-2 text-right  outline-0"
                      />
                    </div>
                  ))}

                  {/* Child */}
                  <div className="bg-white rounded-2xl p-6 shadow flex items-center justify-between">
                    <div className="w-2/3">
                      <div className="flex items-center gap-2 text-[#162041] font-semibold">
                        طفل <IoMdInformationCircle className="text-base" />
                      </div>
                      <div className="text-sm text-gray-700">
                        للزوار من عمر 4 أعوام إلى 11 عاماً
                      </div>
                      <div className="text-sm text-gray-600 mt-2">
                        ابتداء من{" "}
                        <span className="font-bold flex items-center gap-x-1 mt-1">
                          {childPrice.toLocaleString()}
                          <svg
                            viewBox="0 0 18 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            height="20"
                            width="20"
                          >
                            <path
                              d="M17.9471 11.9777C17.8663 12.7835 17.6552 13.552 17.3359 14.2599L10.5778 15.6967V11.3923L8.47252 11.8398V14.2273C8.47252 14.4454 8.4063 14.6478 8.29265 14.8158L7.19776 16.4393C6.92619 16.8347 6.50848 17.1221 6.02249 17.2232L0.0523682 18.4919C0.133235 17.6861 0.344316 16.9175 0.663643 16.2096L6.36729 14.9976V12.2873L1.04521 13.4183C1.12624 12.6125 1.33748 11.8439 1.65681 11.136L6.36729 10.1351V1.76681C6.94959 1.05572 7.66593 0.452726 8.47252 0V9.68776L10.5778 9.24028V2.81951C11.1601 2.10842 11.8764 1.50558 12.683 1.0527V8.79265L17.947 7.67405C17.8661 8.47985 17.655 9.2484 17.3357 9.9563L12.6832 10.945V13.0972L17.9471 11.9777Z"
                              fill="currentColor"
                            ></path>
                            <path
                              d="M10.5782 20C10.6591 19.1942 10.8702 18.4258 11.1895 17.7177L17.9471 16.2812C17.8661 17.0871 17.6552 17.8556 17.3358 18.5635L10.5782 20Z"
                              fill="currentColor"
                            ></path>
                          </svg>
                          لكل شخص
                        </span>{" "}
                      </div>
                    </div>

                    <div className="flex w-1/3 items-center rounded-full ">
                      <button
                        className="w-8 h-8 rounded-full border text-xl flex items-center justify-center bg-white"
                        onClick={() =>
                          setChildVisitors((prev) => prev.slice(0, -1))
                        }
                        aria-label="decrease child"
                      >
                        -
                      </button>
                      <div className="w-10 text-center font-bold bg-gray-100">
                        {childVisitors.length}
                      </div>
                      <button
                        className="w-8 h-8 rounded-full border text-xl flex items-center justify-center bg-white"
                        onClick={() =>
                          setChildVisitors((prev) =>
                            prev.length < 20 ? [...prev, ""] : prev
                          )
                        }
                        aria-label="increase child"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* child visitor names */}
                  {childVisitors.map((name, idx) => (
                    <div
                      key={idx}
                      className="bg-white rounded-2xl p-4 shadow mt-4"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          طفل {idx + 1}
                        </div>
                        <button
                          onClick={() =>
                            setChildVisitors((prev) =>
                              prev.filter((_, i) => i !== idx)
                            )
                          }
                          className="text-gray-400"
                        >
                          <FiTrash />
                        </button>
                      </div>
                      <input
                        value={name}
                        onChange={(e) =>
                          setChildVisitors((prev) => {
                            const copy = [...prev];
                            copy[idx] = e.target.value;
                            return copy;
                          })
                        }
                        placeholder="اسم الزائر *"
                        className="mt-3 w-full border-b pb-2 text-right outline-0"
                      />
                    </div>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between mt-6">
                  <button
                    className="text-sm text-gray-600"
                    onClick={() => {
                      setAdultVisitors([]);
                      setChildVisitors([]);
                      setCurrentSection(2);
                    }}
                  >
                    مسح الاختيار
                  </button>

                  <div className="flex items-center gap-4">
                    {/* <div className="text-right">
                  <div className="text-sm text-gray-500">المجموع</div>
                  <div className="text-xl font-bold text-[#162041]">
                    {totalTickets} تذكرة - {totalPrice.toLocaleString()} ر.س
                  </div>
                </div> */}
                    <button
                      onClick={() => {
                        if (totalTickets === 0 || !allNamesFilled) return;

                        setCurrentSection(3);
                        setTimeout(() => {
                          section3Ref.current?.scrollIntoView({
                            behavior: "smooth",
                            block: "start",
                          });
                        }, 100);
                      }}
                      disabled={totalTickets === 0 || !allNamesFilled}
                      className={`rounded-full px-6 py-3 font-bold ${
                        totalTickets > 0 && allNamesFilled
                          ? "bg-[#22305e] text-white"
                          : "bg-gray-300 text-gray-500 cursor-not-allowed"
                      }`}
                    >
                      متابعة
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div
                className="container  w-full px-6 relative border-b pb-5 border-gray-200"
                dir="rtl"
              >
                <div className=" my-8">
                  <h2 className="text-2xl md:text-4xl font-extrabold text-[#162041]">
                    اختاروا تذكرتكم
                  </h2>
                  <p className="text-[#162041] mt-2">
                    اختاروا نوع التذكرة المراد شراؤها
                  </p>
                </div>
                <div
                  className={`bg-white rounded-2xl shadow p-6 md:p-8 flex items-center gap-6 justify-between relative overflow-hidden ${"ring-4 ring-[#6abe46]"}`}
                  dir="rtl"
                >
                  {/* content */}
                  <div className="flex items-start gap-6 w-full">
                    <div className="flex-1 text-right">
                      <div
                        className="flex items-start justify-between  gap-4 "
                        dir="rtl"
                      >
                        <div className="flex items-center gap-x-2">
                          <h3 className="text-lg md:text-3xl font-bold text-[#162041]">
                            باقة المرح العائلية
                          </h3>
                          <IoMdInformationCircle className="text-2xl" />
                        </div>
                        <MdLibraryAddCheck className="text-[#0d9b0d] text-2xl" />
                      </div>

                      <p className="mt-2 text-xs text-gray-700">
                        تشمل كل باقة مرح عائلية خمس تذاكر. يمكنكم اختيار من
                        سيرافقكم، الجميع مرحب بهم، بما في ذلك الأطفال والبالغون
                        وكبار السن.
                      </p>

                      <div className="flex flex-col gap-y-3">
                        <div className="mt-4 text-[#162041] font-bold text-sm  flex gap-x-2 items-center">
                          <span> لخمسة أشخاص</span>
                          <div className="text-lg font-bold text-[#162041] flex items-center gap-x-2 py-2">
                            1,200.00
                            <svg
                              viewBox="0 0 18 20"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                              height="20"
                              width="20"
                            >
                              <path
                                d="M17.9471 11.9777C17.8663 12.7835 17.6552 13.552 17.3359 14.2599L10.5778 15.6967V11.3923L8.47252 11.8398V14.2273C8.47252 14.4454 8.4063 14.6478 8.29265 14.8158L7.19776 16.4393C6.92619 16.8347 6.50848 17.1221 6.02249 17.2232L0.0523682 18.4919C0.133235 17.6861 0.344316 16.9175 0.663643 16.2096L6.36729 14.9976V12.2873L1.04521 13.4183C1.12624 12.6125 1.33748 11.8439 1.65681 11.136L6.36729 10.1351V1.76681C6.94959 1.05572 7.66593 0.452726 8.47252 0V9.68776L10.5778 9.24028V2.81951C11.1601 2.10842 11.8764 1.50558 12.683 1.0527V8.79265L17.947 7.67405C17.8661 8.47985 17.655 9.2484 17.3357 9.9563L12.6832 10.945V13.0972L17.9471 11.9777Z"
                                fill="currentColor"
                              ></path>
                              <path
                                d="M10.5782 20C10.6591 19.1942 10.8702 18.4258 11.1895 17.7177L17.9471 16.2812C17.8661 17.0871 17.6552 17.8556 17.3358 18.5635L10.5782 20Z"
                                fill="currentColor"
                              ></path>
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-start py-3 gap-x-2">
                  <input
                    type="checkbox"
                    className=" w-10 h-10"
                    disabled={currentSection !== 2}
                    onChange={(e) => {
                      setCheckBox(e.target.checked);
                    }}
                  />
                  <p className="text-sm text-gray-600">
                    أؤكد أنني قرأت ووافقت على الشروط والأحكام المتعلقة بهذه
                    التذاكر. أؤكد أن أي شخص بعمر 14 عام أو أقل سيكون بصحبة ولي
                    أمر قانوني بعمر 18 عاماً فأكثر.
                  </p>
                </div>
                <div className="w-full flex justify-end py-3">
                  <button
                    onClick={() => {
                      setCurrentSection(3);
                      setTimeout(() => {
                        section3Ref.current?.scrollIntoView({
                          behavior: "smooth",
                          block: "start",
                        });
                      }, 100);
                    }}
                    disabled={!checkBoxChecked}
                    className={
                      checkBoxChecked
                        ? `bg-red-400 text-white px-3 py-2 rounded-full ${
                            currentSection == 2 ? "flex" : "hidden"
                          }`
                        : `bg-gray-400 text-white px-3 py-2 rounded-full `
                    }
                  >
                    متابعة
                  </button>
                </div>
              </div>
            )
          ) : (
            ""
          )}
          {currentSection === 3 ? (
            <div
              ref={section3Ref}
              className="container  w-full px-6 relative border-b pb-5 border-gray-200"
              dir="rtl"
            >
              <div className=" my-8">
                <h2 className="text-2xl md:text-4xl font-extrabold text-[#162041]">
                  التاريخ والصلاحية
                </h2>
                <p className="text-[#162041] mt-2">
                  اختاروا تاريخ زيارتكم. جميع التواريخ متاحة — الرجاء اختيار
                  التاريخ المطلوب.
                </p>
              </div>

              <div className="bg-white rounded-2xl shadow p-6 md:p-8">
                <div className="flex items-center justify-between mb-4">
                  <button
                    onClick={goPrevMonth}
                    className="bg-gray-100 px-3 py-2 rounded-full"
                  >
                    «
                  </button>
                  <div className="text-center font-bold text-[#162041]">
                    {formatArabicMonthYear(calendarDate)}
                  </div>
                  <button
                    onClick={goNextMonth}
                    className="bg-gray-100 px-3 py-2 rounded-full"
                  >
                    »
                  </button>
                </div>

                <div className="grid grid-cols-7 gap-2 text-center text-sm mb-2">
                  {[
                    "الأحد",
                    "الاثنين",
                    "الثلاثاء",
                    "الأربعاء",
                    "الخميس",
                    "الجمعة",
                    "السبت",
                  ].map((wd) => (
                    <div key={wd} className="text-gray-500">
                      {wd}
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-2">
                  {generateCalendarCells(calendarDate).map((day, idx) =>
                    day ? (
                      <button
                        key={idx}
                        onClick={() => {
                          const d = new Date(
                            calendarDate.getFullYear(),
                            calendarDate.getMonth(),
                            day
                          );

                          setSelectedDate(d);
                          setShowDateModal(true);
                        }}
                        className={`py-3 rounded-md ${
                          selectedDate &&
                          selectedDate.toDateString() ===
                            new Date(
                              calendarDate.getFullYear(),
                              calendarDate.getMonth(),
                              day
                            ).toDateString()
                            ? "bg-[#22305e] text-white"
                            : "bg-[#f7fafc] hover:bg-[#e6f2ff]"
                        }`}
                      >
                        {day}
                      </button>
                    ) : (
                      <div
                        key={idx}
                        className="py-3 rounded-md bg-gray-50"
                      ></div>
                    )
                  )}
                </div>

                {showDateModal && selectedDate ? (
                  <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 px-4">
                    <div className="bg-white w-full sm:w-96 rounded-t-xl sm:rounded-xl p-4">
                      <div className="flex items-center justify-between">
                        <div className="text-base font-bold">
                          {formatSelectedLong(selectedDate)}
                        </div>
                        <button
                          className="text-gray-400"
                          onClick={() => setShowDateModal(false)}
                        >
                          ✕
                        </button>
                      </div>

                      <div className="mt-4 divide-y">
                        {adultVisitors.length > 0 && (
                          <div className="py-3 flex items-center justify-between">
                            <div>
                              <div className="text-sm">بالغ</div>
                            </div>
                            <div className="text-sm flex gap-x-2 font-bold">
                              {(450).toLocaleString()}{" "}
                              {/* {(adultPrice * adultVisitors.length).toLocaleString()}{" "} */}
                              <svg
                                viewBox="0 0 18 20"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                height="20"
                                width="20"
                              >
                                <path
                                  d="M17.9471 11.9777C17.8663 12.7835 17.6552 13.552 17.3359 14.2599L10.5778 15.6967V11.3923L8.47252 11.8398V14.2273C8.47252 14.4454 8.4063 14.6478 8.29265 14.8158L7.19776 16.4393C6.92619 16.8347 6.50848 17.1221 6.02249 17.2232L0.0523682 18.4919C0.133235 17.6861 0.344316 16.9175 0.663643 16.2096L6.36729 14.9976V12.2873L1.04521 13.4183C1.12624 12.6125 1.33748 11.8439 1.65681 11.136L6.36729 10.1351V1.76681C6.94959 1.05572 7.66593 0.452726 8.47252 0V9.68776L10.5778 9.24028V2.81951C11.1601 2.10842 11.8764 1.50558 12.683 1.0527V8.79265L17.947 7.67405C17.8661 8.47985 17.655 9.2484 17.3357 9.9563L12.6832 10.945V13.0972L17.9471 11.9777Z"
                                  fill="currentColor"
                                ></path>
                                <path
                                  d="M10.5782 20C10.6591 19.1942 10.8702 18.4258 11.1895 17.7177L17.9471 16.2812C17.8661 17.0871 17.6552 17.8556 17.3358 18.5635L10.5782 20Z"
                                  fill="currentColor"
                                ></path>
                              </svg>
                            </div>
                          </div>
                        )}
                        {childVisitors.length > 0 && (
                          <div className="py-3 flex items-center justify-between">
                            <div>
                              <div className="text-sm">طفل</div>
                            </div>
                            <div className="text-sm flex gap-x-2 font-bold">
                              {(350).toLocaleString()}{" "}
                              {/* {(childPrice * childVisitors.length).toLocaleString()}{" "} */}
                              <svg
                                viewBox="0 0 18 20"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                height="20"
                                width="20"
                              >
                                <path
                                  d="M17.9471 11.9777C17.8663 12.7835 17.6552 13.552 17.3359 14.2599L10.5778 15.6967V11.3923L8.47252 11.8398V14.2273C8.47252 14.4454 8.4063 14.6478 8.29265 14.8158L7.19776 16.4393C6.92619 16.8347 6.50848 17.1221 6.02249 17.2232L0.0523682 18.4919C0.133235 17.6861 0.344316 16.9175 0.663643 16.2096L6.36729 14.9976V12.2873L1.04521 13.4183C1.12624 12.6125 1.33748 11.8439 1.65681 11.136L6.36729 10.1351V1.76681C6.94959 1.05572 7.66593 0.452726 8.47252 0V9.68776L10.5778 9.24028V2.81951C11.1601 2.10842 11.8764 1.50558 12.683 1.0527V8.79265L17.947 7.67405C17.8661 8.47985 17.655 9.2484 17.3357 9.9563L12.6832 10.945V13.0972L17.9471 11.9777Z"
                                  fill="currentColor"
                                ></path>
                                <path
                                  d="M10.5782 20C10.6591 19.1942 10.8702 18.4258 11.1895 17.7177L17.9471 16.2812C17.8661 17.0871 17.6552 17.8556 17.3358 18.5635L10.5782 20Z"
                                  fill="currentColor"
                                ></path>
                              </svg>
                            </div>
                          </div>
                        )}
                        {adultVisitors.length === 0 &&
                          childVisitors.length === 0 &&
                          selectedTicket === "family" && (
                            <div className="py-3 flex items-center justify-between">
                              <div>
                                <div className="text-sm">الباقة العائلية</div>
                              </div>
                              <div className="text-sm flex gap-x-2 font-bold">
                                {(1600).toLocaleString()}{" "}
                                <svg
                                  viewBox="0 0 18 20"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                  height="20"
                                  width="20"
                                >
                                  <path
                                    d="M17.9471 11.9777C17.8663 12.7835 17.6552 13.552 17.3359 14.2599L10.5778 15.6967V11.3923L8.47252 11.8398V14.2273C8.47252 14.4454 8.4063 14.6478 8.29265 14.8158L7.19776 16.4393C6.92619 16.8347 6.50848 17.1221 6.02249 17.2232L0.0523682 18.4919C0.133235 17.6861 0.344316 16.9175 0.663643 16.2096L6.36729 14.9976V12.2873L1.04521 13.4183C1.12624 12.6125 1.33748 11.8439 1.65681 11.136L6.36729 10.1351V1.76681C6.94959 1.05572 7.66593 0.452726 8.47252 0V9.68776L10.5778 9.24028V2.81951C11.1601 2.10842 11.8764 1.50558 12.683 1.0527V8.79265L17.947 7.67405C17.8661 8.47985 17.655 9.2484 17.3357 9.9563L12.6832 10.945V13.0972L17.9471 11.9777Z"
                                    fill="currentColor"
                                  ></path>
                                  <path
                                    d="M10.5782 20C10.6591 19.1942 10.8702 18.4258 11.1895 17.7177L17.9471 16.2812C17.8661 17.0871 17.6552 17.8556 17.3358 18.5635L10.5782 20Z"
                                    fill="currentColor"
                                  ></path>
                                </svg>
                              </div>
                            </div>
                          )}
                        {selectedTicket !== "family" && (
                          <div className="bg-[#43ef684f] px-2  py-1 text-xs flex gap-x-2 items-center flex-row-reverse justify-end my-2">
                            تذكرة GoFast متاحة{" "}
                            <FaFireAlt className="text-[#07ca1e]" />
                          </div>
                        )}
                        {adultVisitors.length === 0 &&
                          childVisitors.length === 0 &&
                          selectedTicket !== "family" && (
                            <div className="py-3 text-sm text-gray-500">
                              لا توجد تذاكر مختارة
                            </div>
                          )}
                      </div>

                      <div className="mt-4">
                        <button
                          onClick={() => {
                            setDateConfirmed(selectedDate);
                            setShowDateModal(false);
                          }}
                          className="bg-red-500 text-white w-full py-3 rounded-full font-bold"
                        >
                          حدد التاريخ
                        </button>
                      </div>
                    </div>
                  </div>
                ) : null}

                <div className="flex items-center justify-between mt-6">
                  <button
                    className="text-sm text-gray-600"
                    onClick={() => setSelectedDate(null)}
                  >
                    مسح التاريخ
                  </button>
                  <div className="flex items-center gap-4">
                    {/* <div className="text-right">
                  <div className="text-sm text-gray-500">التاريخ المختار</div>
                  <div className="text-xl font-bold text-[#162041]">
                    {selectedDate
                      ? selectedDate.toLocaleDateString("ar-EG")
                      : "لم يتم الاختيار"}
                  </div>
                </div> */}
                    <button
                      onClick={() => {
                        if (!selectedDate) return;
                        setDateConfirmed(selectedDate);
                        setShowDateModal(false);
                      }}
                      disabled={!selectedDate}
                      className={`rounded-full px-6 py-3 font-bold ${
                        selectedDate
                          ? "bg-[#22305e] text-white"
                          : "bg-gray-300 text-gray-500 cursor-not-allowed"
                      }`}
                    >
                      متابعة
                    </button>
                  </div>
                </div>

                {/* date confirmation summary (shown after user confirms date) */}
                {dateConfirmed && (
                  <div className="mt-6 bg-white rounded-2xl  p-4 max-w-md mx-auto">
                    <div className="flex items-center justify-between mb-3">
                      <div className="text-sm text-gray-500">
                        {formatSelectedLong(dateConfirmed)}
                      </div>
                      <div className="text-sm text-gray-500">
                        {dateConfirmed.toLocaleDateString("ar-EG")}
                      </div>
                    </div>

                    <div className="divide-y">
                      {adultVisitors.length > 0 && (
                        <div className="py-3 flex items-center justify-between">
                          <div className="text-sm font-bold flex items-center gap-x-2">
                            {adultVisitors.length} × البالغين{" "}
                            <BsFillInfoCircleFill />
                          </div>
                          <div className="text-sm font-bold flex gap-x-1 items-center">
                            {(450 * adultVisitors.length).toLocaleString()}{" "}
                            <svg
                              viewBox="0 0 18 20"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                              height="20"
                              width="20"
                            >
                              <path
                                d="M17.9471 11.9777C17.8663 12.7835 17.6552 13.552 17.3359 14.2599L10.5778 15.6967V11.3923L8.47252 11.8398V14.2273C8.47252 14.4454 8.4063 14.6478 8.29265 14.8158L7.19776 16.4393C6.92619 16.8347 6.50848 17.1221 6.02249 17.2232L0.0523682 18.4919C0.133235 17.6861 0.344316 16.9175 0.663643 16.2096L6.36729 14.9976V12.2873L1.04521 13.4183C1.12624 12.6125 1.33748 11.8439 1.65681 11.136L6.36729 10.1351V1.76681C6.94959 1.05572 7.66593 0.452726 8.47252 0V9.68776L10.5778 9.24028V2.81951C11.1601 2.10842 11.8764 1.50558 12.683 1.0527V8.79265L17.947 7.67405C17.8661 8.47985 17.655 9.2484 17.3357 9.9563L12.6832 10.945V13.0972L17.9471 11.9777Z"
                                fill="currentColor"
                              ></path>
                              <path
                                d="M10.5782 20C10.6591 19.1942 10.8702 18.4258 11.1895 17.7177L17.9471 16.2812C17.8661 17.0871 17.6552 17.8556 17.3358 18.5635L10.5782 20Z"
                                fill="currentColor"
                              ></path>
                            </svg>
                          </div>
                        </div>
                      )}
                      {childVisitors.length > 0 && (
                        <div className="py-3 flex items-center justify-between">
                          <div className="text-sm font-bold flex items-center gap-x-2">
                            {" "}
                            {childVisitors.length} × الأطفال{" "}
                            <BsFillInfoCircleFill />
                          </div>
                          <div className="text-sm font-bold flex gap-x-1 items-center">
                            {(350 * childVisitors.length).toLocaleString()}{" "}
                            <svg
                              viewBox="0 0 18 20"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                              height="20"
                              width="20"
                            >
                              <path
                                d="M17.9471 11.9777C17.8663 12.7835 17.6552 13.552 17.3359 14.2599L10.5778 15.6967V11.3923L8.47252 11.8398V14.2273C8.47252 14.4454 8.4063 14.6478 8.29265 14.8158L7.19776 16.4393C6.92619 16.8347 6.50848 17.1221 6.02249 17.2232L0.0523682 18.4919C0.133235 17.6861 0.344316 16.9175 0.663643 16.2096L6.36729 14.9976V12.2873L1.04521 13.4183C1.12624 12.6125 1.33748 11.8439 1.65681 11.136L6.36729 10.1351V1.76681C6.94959 1.05572 7.66593 0.452726 8.47252 0V9.68776L10.5778 9.24028V2.81951C11.1601 2.10842 11.8764 1.50558 12.683 1.0527V8.79265L17.947 7.67405C17.8661 8.47985 17.655 9.2484 17.3357 9.9563L12.6832 10.945V13.0972L17.9471 11.9777Z"
                                fill="currentColor"
                              ></path>
                              <path
                                d="M10.5782 20C10.6591 19.1942 10.8702 18.4258 11.1895 17.7177L17.9471 16.2812C17.8661 17.0871 17.6552 17.8556 17.3358 18.5635L10.5782 20Z"
                                fill="currentColor"
                              ></path>
                            </svg>
                          </div>
                        </div>
                      )}
                      {selectedTicket === "family" && (
                        <div className="py-3 flex items-center justify-between">
                          <div className="text-sm">1 × باقة المرح العائلية</div>
                          <div className="text-sm font-bold flex gap-x-1 items-center">
                            {(1600).toLocaleString()}{" "}
                            <svg
                              viewBox="0 0 18 20"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                              height="20"
                              width="20"
                            >
                              <path
                                d="M17.9471 11.9777C17.8663 12.7835 17.6552 13.552 17.3359 14.2599L10.5778 15.6967V11.3923L8.47252 11.8398V14.2273C8.47252 14.4454 8.4063 14.6478 8.29265 14.8158L7.19776 16.4393C6.92619 16.8347 6.50848 17.1221 6.02249 17.2232L0.0523682 18.4919C0.133235 17.6861 0.344316 16.9175 0.663643 16.2096L6.36729 14.9976V12.2873L1.04521 13.4183C1.12624 12.6125 1.33748 11.8439 1.65681 11.136L6.36729 10.1351V1.76681C6.94959 1.05572 7.66593 0.452726 8.47252 0V9.68776L10.5778 9.24028V2.81951C11.1601 2.10842 11.8764 1.50558 12.683 1.0527V8.79265L17.947 7.67405C17.8661 8.47985 17.655 9.2484 17.3357 9.9563L12.6832 10.945V13.0972L17.9471 11.9777Z"
                                fill="currentColor"
                              ></path>
                              <path
                                d="M10.5782 20C10.6591 19.1942 10.8702 18.4258 11.1895 17.7177L17.9471 16.2812C17.8661 17.0871 17.6552 17.8556 17.3358 18.5635L10.5782 20Z"
                                fill="currentColor"
                              ></path>
                            </svg>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="border-t pt-3 flex items-center justify-end">
                      <div className="flex flex-col items-end">
                        <div className="text-lg font-bold flex  gap-x-1 items-center">
                          {(selectedTicket === "family"
                            ? 1600
                            : (
                                450 * adultVisitors.length +
                                350 * childVisitors.length
                              ).toLocaleString()
                          ).toLocaleString()}{" "}
                          <svg
                            viewBox="0 0 18 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            height="20"
                            width="20"
                          >
                            <path
                              d="M17.9471 11.9777C17.8663 12.7835 17.6552 13.552 17.3359 14.2599L10.5778 15.6967V11.3923L8.47252 11.8398V14.2273C8.47252 14.4454 8.4063 14.6478 8.29265 14.8158L7.19776 16.4393C6.92619 16.8347 6.50848 17.1221 6.02249 17.2232L0.0523682 18.4919C0.133235 17.6861 0.344316 16.9175 0.663643 16.2096L6.36729 14.9976V12.2873L1.04521 13.4183C1.12624 12.6125 1.33748 11.8439 1.65681 11.136L6.36729 10.1351V1.76681C6.94959 1.05572 7.66593 0.452726 8.47252 0V9.68776L10.5778 9.24028V2.81951C11.1601 2.10842 11.8764 1.50558 12.683 1.0527V8.79265L17.947 7.67405C17.8661 8.47985 17.655 9.2484 17.3357 9.9563L12.6832 10.945V13.0972L17.9471 11.9777Z"
                              fill="currentColor"
                            ></path>
                            <path
                              d="M10.5782 20C10.6591 19.1942 10.8702 18.4258 11.1895 17.7177L17.9471 16.2812C17.8661 17.0871 17.6552 17.8556 17.3358 18.5635L10.5782 20Z"
                              fill="currentColor"
                            ></path>
                          </svg>
                        </div>
                        <div>
                          <span className="font-semibold">الإجمالي</span>
                          <span> (شامل الضريبة)</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        sessionStorage.clear();
                        sessionStorage.setItem(
                          "data",
                          JSON.stringify({
                            id: selectedTicket,
                            date: formatSelectedLong(selectedDate),
                            visitors: {
                              adultVisitors,
                              childVisitors,
                              family: selectedTicket === "family",
                            },
                            totalPrice: totalPrice === 0 ? 1600 : totalPrice,
                          })
                        );
                        if (selectedTicket === "family") {
                          return (window.location.href = "/cart");
                        }
                        setCurrentStep(2);
                        setCurrentSection(4);
                        window.scrollTo({ top: 0 });
                      }}
                      className="my-8 bg-red-500 text-white rounded-full w-full py-3 font-bold"
                    >
                      متابعة الحجز
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : null}
        </>
      ) : (
        <GoFastTicketCard />
      )}
      {/* Stepper (styled like design) */}

      <div className="w-full flex flex-col pt-20 items-center justify-center">
        <img src="/book1.png" className="md:w-1/2" />
        <img src="/book2.png" className="md:w-1/2" />
      </div>
    </div>
  );
};

export default Booking;

{
  <div
    className="min-h-screen bg-[#f7fbfc] flex items-center justify-center p-4"
    dir="rtl"
  >
    <div className="w-full max-w-md bg-white rounded-2xl shadow-sm p-5 space-y-5">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-xl font-bold text-blue-700">
          اجعل تجربتك أكثر روعة!
        </h1>
        <p className="text-sm text-gray-600">
          احصل على الإضافات التي ستجعل المتعة إلى تجارب لا تُنسى!
        </p>
      </div>

      {/* Date Box */}
      <div className="flex items-center gap-3 bg-orange-50 rounded-xl p-3">
        <div className="w-10 h-10 flex items-center justify-center bg-orange-100 rounded-lg">
          <span className="text-orange-500 text-xl">📅</span>
        </div>
        <div className="text-sm">
          <p className="text-gray-500">
            ستكون العروض والإضافات صالحة ليوم واحد فقط
          </p>
          <p className="font-semibold text-gray-800">الخميس، 1 يناير 2026</p>
        </div>
      </div>

      {/* Toggle */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium text-red-600">ما تضمنه تذكرتي؟</p>
          <p className="text-xs text-gray-500">إظهار الخيارات المتاحة فقط</p>
        </div>
        <div className="w-12 h-6 bg-pink-200 rounded-full relative cursor-pointer">
          <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 right-0.5 shadow"></div>
        </div>
      </div>

      {/* Section Title */}
      <p className="text-sm font-semibold text-gray-700">تذكرة سريعة</p>

      {/* Ticket Card */}
      <div className="border rounded-2xl p-4 space-y-3">
        <div className="flex items-start gap-3">
          <img
            src="https://via.placeholder.com/56"
            alt="Fast Pass"
            className="w-14 h-14 rounded-lg"
          />
          <div className="flex-1">
            <span className="inline-block text-xs font-bold bg-gray-100 px-2 py-0.5 rounded mb-1">
              FAST PASS
            </span>
            <h2 className="font-bold text-lg">تذكرة GoFast – غير محدودة</h2>
          </div>
        </div>

        <p className="text-sm text-gray-600 leading-relaxed">
          ضاعفوا الحماس واستمتعوا أكثر مع تذكرة GoFast غير محدودة. تمنحكم هذه
          التذكرة أولوية دخول غير محدودة.
        </p>

        <button className="text-sm text-red-600 font-medium">
          تفاصيل الإضافات
        </button>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2">
          <p className="text-base font-bold text-gray-800">430.00 ر.س</p>
          <button className="px-5 py-2 rounded-full border border-red-500 text-red-500 font-semibold hover:bg-red-50 transition">
            أضف إلى سلتي
          </button>
        </div>
      </div>
    </div>
  </div>;
}
