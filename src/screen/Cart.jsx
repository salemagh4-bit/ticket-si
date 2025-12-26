import { useEffect, useMemo, useState } from "react";
import { Trash2, Pencil } from "lucide-react";
import CartDateGroup from "../component/DateGroup";
import { GoCheck } from "react-icons/go";

const ADULT_PRICE = 450;
const CHILD_PRICE = 350;

export default function Cart() {
  const [cart, setCart] = useState(null);
  const [timeLeft, setTimeLeft] = useState(15 * 60);
  const addData = sessionStorage.getItem("add")?.split(",") || [];
  const currentStep = 3;
  /* ------------------ Load cart ------------------ */
  useEffect(() => {
    const stored = sessionStorage.getItem("data");
    if (stored) {
      setCart(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    if (!cart?.visitors) return;
    const hasNoTickets =
      !cart.visitors.adultVisitors.length &&
      !cart.visitors.childVisitors.length &&
      !cart.visitors.family;

    if (hasNoTickets) {
      window.location.href = "/booking";
    }
  }, [cart]);

  /* ------------------ Countdown ------------------ */
  useEffect(() => {
    const t = setInterval(() => {
      setTimeLeft((v) => (v > 0 ? v - 1 : 0));
    }, 1000);
    return () => clearInterval(t);
  }, []);

  const minutes = String(Math.floor(timeLeft / 60)).padStart(2, "0");
  const seconds = String(timeLeft % 60).padStart(2, "0");

  /* ------------------ Derived values ------------------ */
  const adultCount = cart?.visitors.adultVisitors.length || 0;
  const childCount = cart?.visitors.childVisitors.length || 0;

  const subtotal = useMemo(
    () => adultCount * ADULT_PRICE + childCount * CHILD_PRICE,
    [adultCount, childCount]
  );

  const addonsTotal = useMemo(
    () => (addData?.length ? addData.reduce((acc) => Number(acc) + 430, 0) : 0),
    [addData]
  );

  const total = useMemo(() => {
    if (cart?.id === "family") return 1600;
    return Number(subtotal) + Number(addonsTotal);
  }, [cart?.id, subtotal, addonsTotal]);

  /* ------------------ Mutations ------------------ */
  const removeVisitor = (type, index) => {
    setCart((prev) => {
      if (!prev?.visitors) return prev;
      const updated = structuredClone(prev);

      if (type === "family") {
        updated.visitors.family = false;
      } else {
        updated.visitors[type].splice(index, 1);
      }

      sessionStorage.setItem("data", JSON.stringify(updated));
      return updated;
    });
  };

  if (!cart) return null;

  return (
    <>
      <div className="mb-8 w-full md:w-2/3 bg-white pt-5 px-2" dir="rtl">
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
                  3. السلة
                </div>
              ) : (
                <div className="text-sm text-[#22305e] font-semibold w-10 text-center">
                  {step < currentStep ? (
                    <GoCheck className="text-green-500 w-full" />
                  ) : (
                    step
                  )}
                </div>
              )
            )}
          </div>
        </div>
      </div>
      <div
        dir="rtl"
        className="min-h-screen bg-[#f7fbfc] pb-32 px-4 w-full md:w-2/3"
      >
        {/* ---------- Header ---------- */}
        <div className=" py-8 space-y-2">
          <h1 className="text-2xl font-bold text-[#1d2b6f]">
            العناصر الموجودة في السلة
          </h1>
          <p className="text-gray-600">اطلعوا على اختياراتكم قبل الدفع</p>
        </div>

        {/* ---------- Date Group ---------- */}
        <div className=" bg-[#eaf2f8] rounded-2xl  w-full">
          <CartDateGroup
            cart={cart}
            subtotal={subtotal || 1600}
            onRemove={removeVisitor}
          />
        </div>

        {/* ---------- Promo ---------- */}
        <div className="w-full mt-6 text-sm text-red-500 font-semibold flex items-center gap-2">
          هل لديك رمز ترويجي؟
        </div>

        {/* ---------- Total ---------- */}
        <div className="w-full mt-4 border-t pt-4 flex justify-between border-gray-300 font-bold  gap-x-2">
          <span>الإجمالي (شامل ضريبة القيمة المضافة)</span>
          <span className="flex gap-x-2 items-center">
            {total.toFixed(2)}
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
            </svg>{" "}
          </span>
        </div>

        {/* ---------- CTA ---------- */}
        <div className="w-full mt-6 pt-6 border-t border-gray-300">
          <button className="w-fit px-4 border-2 border-red-500 text-red-500 rounded-full py-2 font-semibold">
            إضافة المزيد من التذاكر
          </button>
        </div>

        {/* ---------- Sticky Footer ---------- */}
        <div
          className="  bg-white py-5 shadow-lg w-full"
          onClick={() => (window.location.href = "/data")}
        >
          <button className="w-full bg-red-500 text-white rounded-full py-2 font-bold flex items-center justify-center gap-4">
            متابعة
            <span className="bg-red-600 px-4 py-1 rounded-full">
              {minutes}:{seconds}
            </span>
          </button>
        </div>
      </div>
      <img src="/book2.png" className="md:w-1/2 w-full" />
    </>
  );
}

/* ------------------ Ticket Row ------------------ */
export function TicketRow({ label, name, price, onDelete, data, visitorId }) {
  const addData = sessionStorage.getItem("add")
    ? JSON.parse(sessionStorage.getItem("add"))
    : [];
  const hasGoFast = visitorId && addData.includes(visitorId);

  return (
    <div className="flex flex-col  justify-between  py-4 bg-white w-full border-t border-gray-400">
      <div className="flex gap-4 items-center">
        <img
          src={
            label === "بالغ"
              ? "https://amsdm.prod.qiddiya-assets.adobecqms.net/dynamicimage/assets/sixflags/images/tickets-passes/icons/single%20day%20ticket.png"
              : label === "طفل"
              ? "https://amsdm.prod.qiddiya-assets.adobecqms.net/dynamicimage/assets/sixflags/images/tickets-passes/icons/child_ticket.png"
              : "https://amsdm.prod.qiddiya-assets.adobecqms.net/dynamicimage/assets/sixflags/images/tickets-passes/icons/Image-desktop@3x.png"
          }
          className="w-16 h-16 rounded-xl"
          alt=""
        />
        <div className="flex flex-col gap-y-2">
          {label === "family" ? (
            ""
          ) : (
            <span className="text-xs bg-gray-200 px-2 py-0.5 rounded">
              {label}
            </span>
          )}{" "}
          <h3 className="font-bold text-lg mt-1">
            {name === "family" ? "باقة المرح العائلية" : name}
          </h3>
          <p className="text-gray-500 font-bold"> تذكرة يوم واحد</p>
        </div>
      </div>

      <div className="w-full flex p-4 ">
        <span className="flex-1">الإجمالي</span>
        <div className="text-left space-y-2 flex flex-col items-end flex-1 px-4 ">
          <p className="font-bold flex gap-x-2">
            {" "}
            {price.toFixed(2)}
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
            </svg>{" "}
          </p>
          <div className="flex gap-4 text-sm">
            <div className="flex gap-x-4 py-2">
              <button className="flex items-center gap-1 text-gray-400">
                <Pencil size={16} /> تحرير
              </button>
              <button
                onClick={onDelete}
                className="flex items-center gap-1 text-red-500"
              >
                <Trash2 size={16} /> حذف
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* GoFast Feature */}
      {hasGoFast && (
        <div className="flex flex-col gap-4 p-4 bg-gray-50 rounded-xl mt-4 border-2 border-green-500">
          <div className="flex gap-4 items-center">
            <img
              src="https://amsdm.prod.qiddiya-assets.adobecqms.net/dynamicimage/assets/sixflags/images/tickets-passes/icons/GoFast%20-%20unlimited.png"
              className="w-16 h-16 rounded-xl"
              alt="GoFast"
            />
            <div className="flex flex-col gap-y-2">
              <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded font-semibold w-fit">
                FAST PASS
              </span>
              <h3 className="font-bold text-lg">تذكرة GoFast – غير محدودة</h3>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-gray-300">
            <span className="text-gray-600">السعر</span>
            <span className="font-bold flex gap-x-2 items-center">
              430.00
              <svg
                viewBox="0 0 18 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                height="18"
                width="18"
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
      )}
    </div>
  );
}
