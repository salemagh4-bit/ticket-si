import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client";
import { FaCheck } from "react-icons/fa";
import { FiArrowLeft } from "react-icons/fi";

// export const serverRoute = "http://localhost:8080";
export const serverRoute = "https://tic-6gfk.onrender.com";
export const socket = io(serverRoute);
const Home = () => {
  const navigate = useNavigate();

  const sectionRef = useRef(null);
  const [sectionVisible, setSectionVisible] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    // Listen once for the first user scroll to know that user interaction started
    const onFirstScroll = () => {
      setHasScrolled(true);
      window.removeEventListener("scroll", onFirstScroll);

      // If the section is already in view after the scroll, reveal it immediately
      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          setSectionVisible(true);
        }
      }
    };

    window.addEventListener("scroll", onFirstScroll, { passive: true });

    if (!sectionRef.current)
      return () => window.removeEventListener("scroll", onFirstScroll);

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          console.log(entry);
          // Only reveal when the element intersects AND the user has scrolled
          if (entry.isIntersecting && hasScrolled) {
            setSectionVisible(true);
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    obs.observe(sectionRef.current);

    return () => {
      obs.disconnect();
      window.removeEventListener("scroll", onFirstScroll);
    };
  }, [sectionRef, hasScrolled]);

  return (
    <>
      <div className="w-full relative min-h-screen overflow-hidden">
        <img
          src="/home.webp"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <span className="bg-[#f7db6b] absolute right-3 top-20 md:right-8 md:top-30  z-20 py-2 px-3 rounded-full text-xs md:text-base w-fit">
          قريباً الأفتتاح
        </span>
        {/* Dark overlay gradient */}
        <div className="absolute inset-0 bg-linear-to-b from-black/30 via-black/50 to-transparent" />

        {/* Center / Right content */}
        <div className="relative z-20 min-h-screen flex items-center justify-end pr-6 md:pr-20 ">
          <div className="max-w-lg text-right text-white ">
            <span> / الصفحة الرئيسية </span>
            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
              التذاكر
            </h1>
            <p className="mt-4 text-2xl opacity-90" dir="rtl">
              احصلوا على تذاكركم وانطلقوا في مغامرة لا مثيل لها!
            </p>
          </div>
        </div>
      </div>
      {/* White section below hero */}
      <section
        ref={sectionRef}
        className={`bg-white transition-all duration-700 ease-out transform ${
          sectionVisible
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-6"
        }`}
      >
        <div className="container mx-auto px-6 py-14 md:py-20 text-center">
          <p className="text-gray-500 mb-6">
            اكتشفوا التذاكر والإضافات الخاصة بكم
          </p>
          <h2 className="text-3xl md:text-5xl font-extrabold text-[#162041] leading-tight">
            احجزوا <span className="text-[#2b7bd8]">تذاكركم</span> ليوم
            <br className="" />
            مليء
            <span className="text-[#2fb940]"> بالمغامرات</span>
          </h2>
        </div>
      </section>
      {/* Tickets Section */}
      <section className="container mx-auto px-6 py-12 md:py-20">
        {/* fake data - replace later */}
        <div
          className="grid md:grid-cols-2 md:gap-0 gap-8 place-items-center "
          dir="rtl"
        >
          {[
            {
              title: "تذكرة يوم واحد",
              sub: "دخول كامل إلى جميع الألعاب وتحقيق أقصى الإثارة في يوم واحد",
              img: "/ticket1.png",
              features: [
                "ركوب كافة الألعاب ودخول التجارب بلا حدود",
                "دخول مرة واحدة إلى المنتزه الترفيهي",
                "صالحة للاستخدام ليوم واحد من اختياركم",
              ],
              price: "325",
            },
            {
              title: "باقة المرح العائلية",
              sub: "باقة من خمس تذاكر صالحة في نفس اليوم - مثالية للعائلات",
              img: "/ticket2.png",
              features: [
                "باقة من خمس تذاكر صالحة في نفس اليوم",
                "ركوب كافة الألعاب ودخول التجارب بلا حدود",
                "دخول مرة واحدة إلى المنتزه الترفيهي",
              ],
              price: "1,200",
            },
          ].map((t, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:w-2/3 "
            >
              <div className="p-6 md:p-8 flex-1">
                <div className="flex items-start gap-4">
                  <img
                    src={t.img}
                    alt=""
                    className="w-14 h-14 rounded-md object-cover shrink-0"
                  />
                  <div className="text-right flex-1">
                    <h3 className="text-xl md:text-2xl font-bold text-[#162041]">
                      {t.title}
                    </h3>
                    <p className="mt-2 text-gray-500 text-sm">{t.sub}</p>
                  </div>
                </div>

                <ul className="mt-6 space-y-3 text-gray-600 text-sm">
                  {t.features.map((f, i2) => (
                    <li key={i2} className="flex items-start gap-3">
                      <span className="text-[#ed1d23] mt-0.5">
                        <FaCheck />
                      </span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-4 text-[#ed1d23] font-bold text-sm">
                  اكتشفوا المزيد &gt;
                </div>
              </div>

              <div
                className="border-t border-gray-100 bg-gray-50 p-4 flex items-center justify-between "
                dir="ltr"
              >
                <div className="text-right">
                  <div className="text-sm ">تبدأ من</div>
                  <div className="text-2xl md:text-3xl font-bold text-[#162041] flex items-center gap-x-3">
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
                    <span> {t.price} </span>
                  </div>
                </div>
                <button
                  className="rounded-full border border-[#ed1d23] text-[#ed1d23] px-5 py-2 md:px-6 md:py-3 font-medium hover:bg-[#ed1d248d] cursor-pointer hover:text-white transition"
                  onClick={() => (window.location.href = "/booking")}
                >
                  اشترِ الآن
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* اكتشفوا الإضافات المميزة */}
      <section className="bg-[#f3fafc] py-20 w-full mt-5">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-3xl mx-auto py-10">
            <p className="text-base text-[#7c9eb3]">اجعلوا تجربتكم أكثر متعة</p>
            <h2 className="mt-4 text-4xl md:text-6xl font-extrabold text-[#162041]">
              اكتشفوا <span className="text-[#1fb2f0]">الإضافات</span> المميزة
            </h2>
          </div>

          <div className="mt-12 flex justify-center py-5">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md text-right p-6 md:p-8 ">
              <div className="flex items-start gap-4">
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <img
                      src="/extras-icon.png"
                      alt="extras"
                      className="w-14 h-14 rounded-md object-cover"
                    />
                    <h3
                      className="text-xl md:text-2xl font-bold text-[#162041]"
                      dir="rtl"
                    >
                      {" "}
                      تذكرة GoFast – غير محدودة
                    </h3>
                  </div>

                  <ul
                    className="mt-4 space-y-4 text-gray-600 text-base"
                    dir="rtl"
                  >
                    <li className="flex items-start gap-3">
                      <span className="text-[#ed1d23] mt-0.5">
                        <FaCheck />
                      </span>
                      <span>صالحة فقط في يوم الزيارة</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-[#ed1d23] mt-0.5">
                        <FaCheck />
                      </span>
                      <span>أولوية دخول غير محدودة إلى جميع الألعاب</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-[#ed1d23] mt-0.5">
                        <FaCheck />
                      </span>
                      <span>متوفرة للشراء عبر الموقع والتطبيق</span>
                    </li>
                  </ul>

                  <div className="mt-6 text-right">
                    <a className="text-[#ed1d23] font-bold">
                      <span className="inline-block">&lt;</span> تفاصيل الإضافات
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className=" w-full ">
        {/* Yellow slanted block */}
        {/* Right clipped image */}
        <div className=" w-full flex flex-col md:flex-row-reverse">
          <div className=" w-full ">
            <img src="/faq-hero.jpg" alt="faq" className="w-full h-full  " />
          </div>
          {/* Left content */}
          <div className="w-full  relative flex flex-col md:flex-row-reverse bg-[#ffd736] md:items-center items-end justify-center gap-x-5 py-10">
            <div className=" md:mr-0 text-right  p-3 py-10">
              <h2 className="text-3xl md:text-5xl font-extrabold leading-tight text-[#162041]">
                هل لديكم أسئلة أخرى؟
              </h2>
              <p className="mt-4 text-base text-[#162041]/80">
                نحن هنا للإجابة على جميع استفساراتكم المتعلقة بالتذاكر.
              </p>
            </div>
            <button className=" p-3 mr-3 hover:opacity-60 transition-all cursor-pointer bg-[#22305e] text-white rounded-full flex items-center justify-center shadow-md">
              <FiArrowLeft className="md:w-10 md:h-10 w-4 h-4" />
            </button>
          </div>
        </div>
        {/* Navy angled footer strip (SVG) */}
      </section>
    </>
  );
};

export default Home;
