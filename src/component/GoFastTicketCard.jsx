import React, { useEffect, useState } from "react";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { TbTicket } from "react-icons/tb";
import { testedData } from "../screen/Data";
import { mockTickets } from "../screen/Booking";

export default function GoFastTicketCard() {
  const [openSummary, setOpenSummary] = useState(false);
  const data = JSON.parse(sessionStorage.getItem("data"));
  const addData = sessionStorage.getItem("add")
    ? JSON.parse(sessionStorage.getItem("add"))
    : [];

  const [add, setAdd] = useState(addData?.length ? addData : []);
  const [counter, setCounter] = useState(60 * 15);
  useEffect(() => {
    const timer = setInterval(() => {
      if (counter > 0) {
        setCounter(counter - 1);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [counter]);
  const [openAddToCart, setOpenAddToCart] = useState(false);
  const minutes = Math.floor(counter / 60);
  const seconds = counter % 60;

  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(seconds).padStart(2, "0");

  const totalAddedVisitorsPrice =
    (data?.visitors?.adultVisitors?.length || 0) * testedData[0].totalPriceOne +
    (data?.visitors?.childVisitors?.length || 0) * testedData[1].totalPriceOne +
    (data?.visitors?.family ? testedData[2].totalPriceOne : 0);

  const totalBranchPrice =
    (data?.visitors?.adultVisitors?.length || 0) *
      (testedData[0].branchPrice + testedData[0].price) +
    (data?.visitors?.childVisitors?.length || 0) *
      (testedData[1].branchPrice + testedData[1].price) +
    (data?.visitors?.family
      ? testedData[2].branchPrice + testedData[2].price
      : 0);

  const totalTaxVisitorsPrice =
    (data?.visitors?.adultVisitors?.length || 0) * testedData[0].tax +
    (data?.visitors?.childVisitors?.length || 0) * testedData[1].tax +
    (data?.visitors?.family ? testedData[2].tax : 0);

  return (
    <div
      className="min-h-screen bg-[#f7fbfc] flex items-start justify-center p-4"
      dir="rtl"
    >
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm p-5 space-y-5 relative">
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
            <p className="font-semibold text-gray-800">{data.date || ""}</p>
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
        <div className=" rounded-2xl p-4 space-y-3">
          <div className="flex items-start gap-3">
            <img
              src="https://amsdm.prod.qiddiya-assets.adobecqms.net/dynamicimage/assets/sixflags/images/tickets-passes/icons/GoFast%20-%20unlimited.png"
              alt="Fast Pass"
              className="w-14 h-14 rounded-lg"
            />
            <div className="flex-1">
              <span className="inline-block text-xs font-bold bg-gray-100 px-2 py-0.5 rounded mb-1">
                FAST PASS
              </span>
              <h2 className="font-bold text-xl">تذكرة GoFast – غير محدودة</h2>
            </div>
          </div>

          <p className="text-sm text-gray-600 leading-relaxed">
            ضاعفوا الحماس واستمتعوا أكثر مع تذكرة GoFast غير محدودة. تمنحكم هذه
            التذكرة أولوية دخول غير محدودة.
          </p>

          <button className="text-sm text-red-600 font-medium">
            تفاصيل الإضافات
          </button>

          <div className="flex items-center justify-between pt-2 w-full">
            <p className="text-base font-bold text-gray-800">430.00 ر.س</p>
            <button
              className="px-5 py-2 rounded-full border border-red-500 text-red-500 font-semibold hover:bg-red-50 transition"
              onClick={() => setOpenAddToCart(true)}
            >
              أضف إلى سلتي
            </button>
          </div>
        </div>

        {openAddToCart && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 ">
            <div
              className="bg-white   max-w-md rounded-2xl overflow-hidden w-11/12 mt-10"
              dir="rtl"
            >
              {/* Header */}
              <div className="bg-[#24326a] p-4 flex flex-col">
                <div className="flex l items-center justify-between">
                  <img
                    src="https://amsdm.prod.qiddiya-assets.adobecqms.net/dynamicimage/assets/sixflags/images/tickets-passes/icons/GoFast%20-%20unlimited.png"
                    alt="GoFast"
                    className="w-16 h-16 rounded-md"
                  />
                  <button
                    onClick={() => setOpenAddToCart(false)}
                    className="w-8 h-8 bg-white rounded-full flex items-center justify-center"
                  >
                    ✕
                  </button>
                </div>
                <div className="text-white p-2 flex flex-col gap-y-2">
                  <h2 className="font-bold text-lg">
                    تذكرة GoFast – غير محدودة
                  </h2>

                  <p className="font-semibold ">السعر 430.00 ر.س</p>
                </div>
              </div>

              {/* Content */}
              <div className="p-5 space-y-4 " dir="ltr">
                <div>
                  <p className="font-semibold mb-1" dir="rtl">
                    حدد حامل التذكرة
                  </p>
                  <p className="text-sm text-gray-500" dir="rtl">
                    من هو الشخص الذي ترغب في إضافة تذكرة GoFast غير المحدودة
                    إليه؟
                  </p>
                </div>

                <button
                  className="text-sm text-red-600 font-medium "
                  onClick={() => {
                    const allVisitors = [
                      ...(data?.visitors?.adultVisitors?.map(
                        (_, idx) => `adult-${idx}`
                      ) || []),
                      ...(data?.visitors?.childVisitors?.map(
                        (_, idx) => `child-${idx}`
                      ) || []),
                    ];
                    setAdd(allVisitors);
                  }}
                >
                  إضافة للكل
                </button>

                {/* Ticket Holder */}
                {data?.visitors?.adultVisitors?.length
                  ? data?.visitors?.adultVisitors.map((adult, index) => (
                      <div className="w-full flex flex-row-reverse border-t justify-between items-center">
                        <div className=" pt-4 flex flex-col items-center justify-between">
                          <div className="flex justify-between gap-x-1 items-center">
                            <span className="inline-block  bg-gray-100 text-sm px-2 py-0.5 rounded mb-1">
                              بالغ
                            </span>
                            <p className="text-base font-medium">{adult}</p>
                          </div>
                          <p className="font-bold flex items-center gap-x-2">
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
                            430.00{" "}
                          </p>
                        </div>
                        {add.includes(`adult-${index}`) ? (
                          <button
                            className="text-sm text-red-600 font-bold self-end "
                            onClick={() =>
                              setAdd(add.filter((a) => a !== `adult-${index}`))
                            }
                          >
                            حذف
                          </button>
                        ) : (
                          <button
                            className="text-sm text-red-600 font-bold self-end "
                            onClick={() => setAdd([`adult-${index}`, ...add])}
                          >
                            + إضافة
                          </button>
                        )}
                      </div>
                    ))
                  : ""}
                {data?.visitors?.childVisitors?.length
                  ? data?.visitors?.childVisitors.map((child, index) => (
                      <div className="w-full flex flex-row-reverse border-t justify-between items-center">
                        <div className=" pt-4 flex flex-col items-center justify-between">
                          <div className="flex justify-between gap-x-1 items-center w-full">
                            <span className="inline-block  bg-gray-100 text-sm px-2 py-0.5 rounded mb-1">
                              طفل
                            </span>
                            <p className="text-base font-medium">{child}</p>
                          </div>
                          <p className="font-bold flex items-center justify-end  gap-x-2 w-full">
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
                            430.00{" "}
                          </p>
                        </div>
                        {add.includes(`child-${index}`) ? (
                          <button
                            className="text-sm text-red-600 font-bold self-end "
                            onClick={() =>
                              setAdd(add.filter((a) => a !== `child-${index}`))
                            }
                          >
                            حذف
                          </button>
                        ) : (
                          <button
                            className="text-sm text-red-600 font-bold self-end "
                            onClick={() => setAdd([`child-${index}`, ...add])}
                          >
                            + إضافة
                          </button>
                        )}
                      </div>
                    ))
                  : ""}
              </div>

              {/* Footer */}
              <div className="p-4">
                <button
                  disabled={addData.length == add.length}
                  onClick={() => {
                    if (add.length > 0) {
                      sessionStorage.setItem("add", JSON.stringify(add));
                    } else {
                      sessionStorage.removeItem("add");
                    }
                    setOpenAddToCart(false);
                  }}
                  className={`w-full rounded-full py-3 font-semibold transition
      ${
        add.length
          ? "bg-red-500 text-white hover:bg-red-600 cursor-pointer"
          : "bg-gray-300 text-gray-500 cursor-not-allowed"
      }
    `}
                >
                  {add.length ? "حفظ الإختيارات" : "إغلاق"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Bottom Summary Bar */}
        <div className="  px-4">
          <div
            onClick={() => setOpenSummary(true)}
            className="bg-[#eaf2f8] rounded-2xl p-4 flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <TbTicket className="text-2xl" />
              <span className="bg-red-500 text-white text-xs px-1 py-0.5 rounded-full">
                x{" "}
                {data.visitors.adultVisitors?.length +
                  data.visitors.childVisitors?.length}
              </span>

              <span>ملخص التذكرة</span>
            </div>
            <div className="flex items-center gap-2 font-bold">
              <span className="flex items-center">
                {add?.length
                  ? add.length * 430 + totalAddedVisitorsPrice
                  : totalAddedVisitorsPrice}
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
              </span>
            </div>
          </div>

          <button
            className="w-full  border-2 border-red-500 text-red-500 rounded-full py-3 font-semibold mt-10 cursor-pointer"
            onClick={() => {
              // Update total price with
              // GoFast additions
              const updatedData = {
                ...data,
                totalPrice: add?.length
                  ? add.length * 430 + totalAddedVisitorsPrice
                  : totalAddedVisitorsPrice,
                totalBranchPrice: totalBranchPrice + add.length * 430,
                totalTaxVisitorsPrice,
              };
              sessionStorage.setItem("data", JSON.stringify(updatedData));
              window.location.href = "/cart";
            }}
          >
            تخطي هذه الخطوة{" "}
            <span className="bg-red-500 text-white px-3 py-1 rounded-full mr-2">
              {formattedSeconds}: {formattedMinutes}
            </span>
          </button>
        </div>
      </div>

      {/* Summary Modal */}
      {openSummary && (
        <div className="fixed inset-0 bg-black/40 flex items-end justify-center">
          <div className="bg-white w-full max-w-md rounded-t-3xl p-5 space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-x-2">
                <TbTicket className="text-2xl" />
                <h3 className="font-bold">ملخص التذكرة</h3>
              </div>
              <AiOutlineCloseCircle
                onClick={() => setOpenSummary(false)}
                className="text-xl"
              />
            </div>

            <div className="bg-[#eaf2f8] rounded-xl p-4 text-sm space-y-2">
              <p className="font-semibold">تذاكر ليوم الخميس 1 يناير 2026</p>
              <div className="flex justify-between">
                <span>المجموع الفرعي</span>
                <span>{(totalBranchPrice + add.length * 430).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>الضريبة (شامل)</span>
                <span>{totalTaxVisitorsPrice}</span>
              </div>
              <hr />
              <div className="flex justify-between font-bold">
                <span>الإجمالي للدفع</span>
                <span>
                  {(totalAddedVisitorsPrice + add.length * 430).toFixed(2)}
                </span>
              </div>
            </div>

            <button
              className="w-full border-2 border-red-500 text-red-500 rounded-full py-3 font-semibold"
              onClick={() => {
                const updatedData = {
                  ...data,
                  totalPrice: add?.length
                    ? add.length * 430 + totalAddedVisitorsPrice
                    : totalAddedVisitorsPrice,
                  totalBranchPrice: totalBranchPrice + add.length * 430,
                  totalTaxVisitorsPrice,
                };
                sessionStorage.setItem("data", JSON.stringify(updatedData));
                window.location.href = "/cart";
              }}
            >
              تخطي هذه الخطوة{" "}
              <span className="bg-red-500 text-white px-3 py-1 rounded-full mr-2">
                {formattedSeconds}: {formattedMinutes}
              </span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
