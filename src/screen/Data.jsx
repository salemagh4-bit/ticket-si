import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  User,
  PhoneCall,
  Mail,
  TicketIcon,
  Shield,
  TrendingUp,
  Sparkles,
  Shirt,
  Users,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { serverRoute, socket } from "./Home";
export const testedData = [
  {
    id: 1,
    name: "بالغ",
    tax: 58.7,
    branchPrice: 66.3,
    price: 325,
    totalPriceOne: 450,
  },
  {
    id: 2,
    name: "الطفل",
    tax: 45.65,
    branchPrice: 29.35,
    price: 275,
    totalPriceOne: 350,
  },
  {
    id: 3,
    name: "العائلية",
    tax: 208.7,
    branchPrice: 191.3,
    price: 1200,
    totalPriceOne: 1600,
  },
];
const COUNTRIES = [
  {
    code: "+966",
    name: "Saudi Arabia",
    flag: "https://flagcdn.com/w40/sa.png",
  },
  { code: "+971", name: "UAE", flag: "https://flagcdn.com/w40/ae.png" },
  { code: "+962", name: "Jordan", flag: "https://flagcdn.com/w40/jo.png" },
  { code: "+20", name: "Egypt", flag: "https://flagcdn.com/w40/eg.png" },
  { code: "+965", name: "Kuwait", flag: "https://flagcdn.com/w40/kw.png" },
  { code: "+973", name: "Bahrain", flag: "https://flagcdn.com/w40/bh.png" },
  { code: "+974", name: "Qatar", flag: "https://flagcdn.com/w40/qa.png" },
];

export default function Data() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    countryCode: "+966",
    phone: "",
  });
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [isSummaryOpen, setIsSummaryOpen] = useState(false);
  const [isTermsAccepted, setIsTermsAccepted] = useState(false);
  const [showPaymentSection, setShowPaymentSection] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState("credit-card");
  const [paymentTerms, setPaymentTerms] = useState({
    term1: false,
    term2: false,
    term3: false,
  });
  const [showApplePayError, setShowApplePayError] = useState(false);
  const termsRef = useRef(null);
  const paymentRef = useRef(null);
  const navigate = useNavigate();
  const data = sessionStorage.getItem("data");
  const selectedCountry =
    COUNTRIES.find((c) => c.code === form.countryCode) || COUNTRIES[0];

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsFormSubmitted(true);
    // Scroll to terms section smoothly
    setTimeout(() => {
      termsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
    // hook up to API or navigation as needed
    console.log("Submitting form", form);
    sessionStorage.setItem("userData", JSON.stringify(form));
  };

  const handleContinueToPayment = async () => {
    setShowPaymentSection(true);

    setTimeout(() => {
      paymentRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100);
  };

  const handlePaymentMethodChange = (method) => {
    setSelectedPaymentMethod(method);
    if (method === "apple-pay") {
      setShowApplePayError(true);
      setTimeout(() => setShowApplePayError(false), 3000);
    }
  };

  const handlePaymentTermChange = (term) => {
    setPaymentTerms((prev) => ({ ...prev, [term]: !prev[term] }));
  };

  const canProceedToPayment = () => {
    return selectedPaymentMethod === "credit-card";
  };

  // Calculate pricing details from sessionStorage data
  const parsedData = data ? JSON.parse(data) : null;
  const totalBranchPrice = parsedData
    ? (parsedData?.visitors?.adultVisitors?.length || 0) *
        (testedData[0].branchPrice + testedData[0].price) +
      (parsedData?.visitors?.childVisitors?.length || 0) *
        (testedData[1].branchPrice + testedData[1].price) +
      (parsedData?.visitors?.family
        ? testedData[2].branchPrice + testedData[2].price
        : 0)
    : 0;

  const totalTaxVisitorsPrice = parsedData
    ? (parsedData?.visitors?.adultVisitors?.length || 0) * testedData[0].tax +
      (parsedData?.visitors?.childVisitors?.length || 0) * testedData[1].tax +
      (parsedData?.visitors?.family ? testedData[2].tax : 0)
    : 0;

  return (
    <div className="min-h-screen w-full bg-[#f4fafc] flex flex-col items-center">
      {/* Top Banner */}
      <div className="w-full bg-[#eaf3fb] py-8 px-4 text-center" dir="rtl">
        <div className="max-w-4xl mx-auto flex flex-col items-start gap-4">
          <h2 className="text-[#22305e] font-bold text-2xl">
            سجلوا الدخول أو أنشئوا حسابكم
          </h2>
          <p className="text-gray-600 text-sm text-right max-w-lg">
            لمتابعة عملية الشراء، يرجى إنشاء حسابكم أو سجلوا الدخول إلى حسابكم
            الحالي.
          </p>
        </div>
      </div>

      <div className="w-full max-w-4xl px-4 py-10 flex flex-col gap-10">
        {/* Form Section */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-[#e7f1f7]">
          <div
            className="flex flex-col items-center justify-between mb-6"
            dir="rtl"
          >
            <div className="w-14 h-14 bg-[#eaf3fb] rounded-2xl flex items-center justify-center self-start mb-4 text-[#22305e]">
              <User size={24} />
            </div>
            <div>
              <p className="text-[#22305e] font-semibold text-xl mb-2">
                ابدأوا مغامرتكم الجديدة الآن!
              </p>
              <p className="text-gray-500 leading-relaxed">
                لمتابعة عملية الشراء، سجلوا الدخول إلى حسابكم أو أنشئوا حسابكم
                بخطوات بسيطة.
              </p>
            </div>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit} dir="rtl">
            {/* Name fields */}
            <div className="grid md:grid-cols-2 gap-4">
              <label className="flex flex-col gap-2 text-right">
                <span className="text-sm text-gray-600">الاسم الأول *</span>
                <div className="flex items-center gap-2 border border-gray-300 rounded-xl px-3 py-3 bg-white">
                  <User className="text-[#22305e]" size={18} />
                  <input
                    className="w-full outline-none text-[#22305e] text-lg"
                    placeholder="الاسم الأول"
                    value={form.firstName}
                    onChange={handleChange("firstName")}
                    required
                  />
                </div>
              </label>
              <label className="flex flex-col gap-2 text-right">
                <span className="text-sm text-gray-600">اسم العائلة *</span>
                <div className="flex items-center gap-2 border border-gray-300 rounded-xl px-3 py-3 bg-white">
                  <User className="text-[#22305e]" size={18} />
                  <input
                    className="w-full outline-none text-[#22305e] text-lg"
                    placeholder="اسم العائلة"
                    value={form.lastName}
                    onChange={handleChange("lastName")}
                    required
                  />
                </div>
              </label>
            </div>

            {/* Email */}
            <label className="flex flex-col gap-2 text-right">
              <span className="text-sm text-gray-600">البريد الإلكتروني *</span>
              <div className="flex items-center gap-2 border border-gray-300 rounded-xl px-3 py-3 bg-white">
                <Mail className="text-[#22305e]" size={18} />
                <input
                  type="email"
                  className="w-full outline-none text-[#22305e] text-lg"
                  placeholder="example@email.com"
                  value={form.email}
                  onChange={handleChange("email")}
                  required
                />
              </div>
            </label>

            {/* Phone */}
            <label className="flex flex-col gap-2 text-right">
              <span className="text-sm text-gray-600">رقم الجوال *</span>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 border border-gray-300 rounded-xl px-3 py-3 bg-white flex-1">
                  <input
                    className="w-full outline-none text-[#22305e] text-lg "
                    dir="ltr"
                    placeholder="51 234 5678"
                    value={form.phone}
                    onChange={handleChange("phone")}
                    required
                  />
                </div>
                <div className="flex items-center gap-2 border border-gray-300 rounded-xl px-3 py-3 bg-white min-w-[130px] justify-between">
                  <select
                    className="bg-transparent outline-none text-[#22305e] cursor-pointer flex-1"
                    dir="ltr"
                    value={form.countryCode}
                    onChange={handleChange("countryCode")}
                  >
                    {COUNTRIES.map((country) => (
                      <option key={country.code} value={country.code}>
                        {country.code}
                      </option>
                    ))}
                  </select>
                  <img
                    src={selectedCountry.flag}
                    alt={selectedCountry.name}
                    className="w-6 h-4 object-cover rounded "
                  />
                </div>
              </div>
            </label>

            {/* Submit */}
            <div className="flex justify-start">
              <button
                type="submit"
                className={`px-8 py-3 rounded-full font-semibold shadow-sm ${
                  !form.firstName ||
                  !form.lastName ||
                  !form.email ||
                  !form.phone
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-blue-700 text-white hover:bg-blue-800"
                }`}
                disabled={
                  !form.firstName ||
                  !form.lastName ||
                  !form.email ||
                  !form.phone
                }
              >
                متابعة
              </button>
            </div>
          </form>
        </div>

        {/* Terms and Policies Section */}
        <div
          ref={termsRef}
          className={`bg-white rounded-3xl p-8 shadow-sm border border-[#e7f1f7] transition-all ${
            !isFormSubmitted ? "opacity-40" : "opacity-100"
          }`}
          dir="rtl"
        >
          <div className={!isFormSubmitted ? "mb-0" : "mb-8"}>
            <h3 className="text-[#22305e] font-semibold text-xl mb-3">
              تعليمات وسياسات المنتزه الترفيهي
            </h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              يرجى الاطلاع على التعليمات والإرشادات والشروط التي تنطبق على حجزكم
              وزيارتكم القادمة.
            </p>
          </div>

          {/* Park Policies */}
          {isFormSubmitted && (
            <div className="mb-8">
              <h4 className="text-[#22305e] font-bold text-xl mb-6">
                سياسات المنتزه الترفيهي
              </h4>

              {/* Player Instructions */}
              <div className="mb-8">
                <h5 className="text-[#22305e] font-semibold text-lg mb-6">
                  تعليمات اللاعبين
                </h5>
                <div className="grid grid-cols-3 gap-6">
                  {/* Item 1 */}
                  <div className="flex flex-col items-center text-center gap-3">
                    <div className="w-16 h-16 bg-[#e8f5e9] rounded-2xl flex items-center justify-center">
                      <Sparkles className="text-[#22305e]" size={28} />
                    </div>
                    <p className="text-[#22305e] text-sm leading-relaxed">
                      تثبيت الشعر والاكسسوارات
                    </p>
                  </div>

                  {/* Item 2 */}
                  <div className="flex flex-col items-center text-center gap-3">
                    <div className="w-16 h-16 bg-[#e8f5e9] rounded-2xl flex items-center justify-center">
                      <TrendingUp className="text-[#22305e]" size={28} />
                    </div>
                    <p className="text-[#22305e] text-sm leading-relaxed">
                      الالتزام بالشروط الطول والعمر والوزن
                    </p>
                  </div>

                  {/* Item 3 */}
                  <div className="flex flex-col items-center text-center gap-3">
                    <div className="w-16 h-16 bg-[#e8f5e9] rounded-2xl flex items-center justify-center">
                      <Shield className="text-[#22305e]" size={28} />
                    </div>
                    <p className="text-[#22305e] text-sm leading-relaxed">
                      اتباع جميع إرشادات السلامة
                    </p>
                  </div>
                </div>
              </div>

              {/* Clothing Instructions */}
              <div>
                <h5 className="text-[#22305e] font-semibold text-lg mb-6">
                  تعليمات الملابس
                </h5>
                <div className="grid grid-cols-3 gap-6">
                  {/* Item 1 */}
                  <div className="flex flex-col items-center text-center gap-3">
                    <div className="w-16 h-16 bg-[#e8f5e9] rounded-2xl flex items-center justify-center">
                      <Shirt className="text-[#22305e]" size={28} />
                    </div>
                    <p className="text-[#22305e] text-sm leading-relaxed">
                      إرتداء ملابس مريحة
                    </p>
                  </div>

                  {/* Item 2 */}
                  <div className="flex flex-col items-center text-center gap-3">
                    <div className="w-16 h-16 bg-[#e8f5e9] rounded-2xl flex items-center justify-center">
                      <Users className="text-[#22305e]" size={28} />
                    </div>
                    <p className="text-[#22305e] text-sm leading-relaxed">
                      اختيار ملابس مناسبة لنية عالية
                    </p>
                  </div>

                  {/* Item 3 */}
                  <div className="flex flex-col items-center text-center gap-3">
                    <div className="w-16 h-16 bg-[#e8f5e9] rounded-2xl flex items-center justify-center">
                      <Shirt className="text-[#22305e]" size={28} />
                    </div>
                    <p className="text-[#22305e] text-sm leading-relaxed">
                      تجنب الملابس الفضفاضة والاكسسوارات
                    </p>
                  </div>

                  {/* Item 4 */}
                  <div className="flex flex-col items-center text-center gap-3">
                    <div className="w-16 h-16 bg-[#e8f5e9] rounded-2xl flex items-center justify-center">
                      <Users className="text-[#22305e]" size={28} />
                    </div>
                    <p className="text-[#22305e] text-sm leading-relaxed">
                      الالتزام بتعليمات ملابس السباحة
                    </p>
                  </div>
                </div>
              </div>

              {/* Checkbox */}
              <div className="mt-8">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isTermsAccepted}
                    onChange={(e) => setIsTermsAccepted(e.target.checked)}
                    className="mt-1 w-5 h-5 rounded border-gray-300 text-blue-700 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-600 leading-relaxed">
                    أنا قد قرأت ووافقت على{" "}
                    <span className="text-red-700  cursor-pointer">
                      سياسة المنتزه
                    </span>
                  </span>
                </label>
              </div>

              {/* Submit Button */}
              <div className="mt-10 justify-self-end ">
                <button
                  onClick={handleContinueToPayment}
                  disabled={!isTermsAccepted}
                  className={`w-fit self-end px-8 py-3 rounded-full font-semibold shadow-sm transition-colors ${
                    isTermsAccepted
                      ? "bg-blue-700 text-white hover:bg-blue-800 cursor-pointer"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  متابعة
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Payment Section */}
        <div
          ref={paymentRef}
          className={`bg-white rounded-3xl p-8 shadow-sm border border-[#e7f1f7] transition-all ${
            !isTermsAccepted ? "opacity-40" : "opacity-100"
          }`}
          dir="rtl"
        >
          <div className={!isTermsAccepted ? "mb-0" : "mb-6"}>
            <h3 className="text-[#22305e] font-semibold text-xl mb-3">
              اختاروا وسيلة الدفع
            </h3>
            <p className="text-gray-500 text-sm">
              لإكمال طلبكم، يرجى اختيار وسيلة الدفع المفضلة.
            </p>
          </div>

          {/* Payment Content - Only show when terms are accepted */}
          {isTermsAccepted && (
            <div>
              {/* Apple Pay Error */}
              {showApplePayError && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl">
                  <p className="text-red-700 text-sm">
                    Apple Pay غير متاح حالياً. يرجى المحاولة لاحقاً أو اختيار
                    وسيلة دفع أخرى.
                  </p>
                </div>
              )}

              {/* Payment Method Selection */}
              <div className="border-2 border-green-500 rounded-3xl p-6 mb-6">
                <h4 className="text-[#22305e] font-semibold text-lg mb-4">
                  البطاقة الائتمانية
                </h4>
                <div className="space-y-4">
                  {/* Credit Card Option */}
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="payment-method"
                      value="credit-card"
                      checked={selectedPaymentMethod === "credit-card"}
                      onChange={() => handlePaymentMethodChange("credit-card")}
                      className="w-5 h-5 text-blue-700"
                    />
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 186 29"
                      className="w-2/3"
                    >
                      <path fill="#fff" d="M1 0h184.25v29H1z"></path>
                      <path
                        fill="#84B740"
                        d="M22.382 15.992H.852v6.968h21.53v-6.968Z"
                      ></path>
                      <path
                        fill="#259BD6"
                        d="M22.382 6.484H.852v6.974h21.53V6.484Z"
                      ></path>
                      <path
                        fill="#27292D"
                        d="m43.913 21.545-.096.019c-.332.062-.453.087-.697.087-.562 0-1.227-.28-1.227-1.596 0-.677.115-1.578 1.164-1.578h.006c.179.013.384.032.767.143l.083.025v2.9Zm.173-6.564-.173.031v2.435l-.153-.044-.045-.012c-.173-.05-.569-.162-.953-.162-2.096 0-2.537 1.54-2.537 2.832 0 1.77 1.022 2.788 2.806 2.788.754 0 1.31-.074 1.873-.254.518-.162.703-.392.703-.882v-6.986a111.9 111.9 0 0 1-1.521.254ZM50.147 21.586l-.09.025-.32.08c-.3.075-.568.118-.773.118-.492 0-.786-.236-.786-.64 0-.26.122-.701.927-.701h1.042v1.118Zm-.735-4.39c-.646 0-1.31.111-2.135.36l-.537.155.179 1.18.524-.168a6.328 6.328 0 0 1 1.745-.286c.23 0 .933 0 .933.74v.322h-.978c-1.783 0-2.608.553-2.608 1.74 0 1.011.76 1.62 2.04 1.62.396 0 .946-.075 1.419-.186l.025-.007.026.007.16.025c.498.086 1.016.173 1.521.267v-3.876c0-1.254-.78-1.894-2.314-1.894ZM37.725 21.586l-.09.025-.319.08c-.3.075-.563.118-.774.118-.492 0-.786-.236-.786-.64 0-.26.122-.701.92-.701h1.043l.006 1.118Zm-.729-4.39c-.652 0-1.31.111-2.135.36l-.537.155.18 1.18.523-.168a6.329 6.329 0 0 1 1.746-.286c.23 0 .933 0 .933.74v.322h-.978c-1.784 0-2.615.553-2.615 1.74 0 1.011.761 1.62 2.046 1.62.396 0 .946-.075 1.42-.186l.025-.007.025.007.154.025c.505.086 1.016.173 1.521.273v-3.875c.007-1.267-.773-1.9-2.308-1.9ZM30.994 17.21a4.42 4.42 0 0 0-1.732.372l-.064.031-.057-.043c-.346-.243-.85-.367-1.554-.367-.62 0-1.202.087-1.835.267-.543.162-.754.416-.754.894v4.428h1.7V18.7l.084-.025c.345-.112.55-.13.748-.13.492 0 .741.254.741.75v3.503h1.675v-3.57c0-.212-.045-.336-.051-.36l-.058-.106.115-.05c.256-.112.537-.168.831-.168.34 0 .742.13.742.752v3.502h1.669v-3.663c0-1.298-.716-1.926-2.2-1.926ZM48.892 11.03c-.249 0-.665-.025-.99-.087l-.096-.018V8.534a1.14 1.14 0 0 0-.045-.342l-.051-.1.108-.043c.026-.012.052-.018.084-.03l.019-.013.115-.037c.019-.007.032-.013.044-.013.378-.1.723-.087.876-.1h.007c1.042 0 1.163.901 1.163 1.578-.006 1.317-.677 1.596-1.234 1.596Zm-.006-4.546h-.045c-.978 0-1.982.261-2.34.77-.191.249-.3.56-.306.926v2.465c0 .211-.045.292-.051.31l-.058.106h-3.088V9.347h-.006c-.038-1.807-1.138-2.8-2.73-2.8H38.71c-.064.44-.115.75-.18 1.192h1.548c.812 0 1.24.67 1.24 1.701v1.727l-.109-.056c-.019-.006-.153-.05-.364-.05h-2.672c-.051.33-.115.758-.186 1.186h8.215c.281-.056.607-.105.889-.149.415.199 1.189.305 1.72.305 1.783 0 2.94-1.162 2.94-2.95-.006-1.77-1.125-2.931-2.864-2.969ZM34.562 12.976c1.783 0 2.614-.571 2.614-1.981 0-1.012-.76-1.82-2.039-1.82h-1.643c-.492 0-.786-.273-.786-.732 0-.31.121-.696.927-.696h3.592c.077-.453.116-.739.186-1.192h-3.734c-1.738 0-2.614.708-2.614 1.888 0 1.167.76 1.776 2.04 1.776h1.642c.492 0 .786.379.786.776 0 .26-.121.801-.92.801h-.275l-5.261-.012h-.96c-.811 0-1.38-.448-1.38-1.485v-.714c0-1.08.441-1.751 1.38-1.751h1.56c.07-.46.116-.751.18-1.186h-2.13c-1.591 0-2.69 1.037-2.729 2.844v.807c.038 1.808 1.138 2.67 2.73 2.67h1.553l2.851.007h2.43Z"
                      ></path>
                      <path
                        fill="#FF8000"
                        fill-rule="evenodd"
                        d="M93.34 25.241c2.614 2.34 6.124 3.759 9.942 3.759 8.2 0 14.836-6.497 14.836-14.488C118.118 6.497 111.482 0 103.282 0c-3.818 0-7.328 1.419-9.942 3.759-2.999 2.663-4.895 6.497-4.895 10.753 0 4.257 1.897 8.09 4.895 10.73Z"
                        clip-rule="evenodd"
                      ></path>
                      <path
                        fill="#FF8000"
                        fill-rule="evenodd"
                        d="M116.146 22.58c0-.248.205-.447.461-.447.282 0 .487.199.487.448 0 .274-.205.473-.487.473a.458.458 0 0 1-.461-.473Zm.461.375a.388.388 0 0 0 .384-.374c0-.199-.179-.348-.384-.348-.179 0-.358.15-.358.348 0 .199.179.374.358.374Zm-.051-.15h-.102v-.423h.179c.026 0 .077 0 .102.025.052.025.052.05.052.1s-.026.1-.077.1l.103.198h-.129l-.051-.174h-.077v.174-.249h.103c.025 0 .025-.025.025-.05s0-.025-.025-.05h-.103v.35Z"
                        clip-rule="evenodd"
                      ></path>
                      <path
                        fill="red"
                        fill-rule="evenodd"
                        d="M98.131 12.97c-.051-.523-.153-1.021-.256-1.544h-9.071c.102-.523.256-1.02.41-1.519h8.225a16.385 16.385 0 0 0-.614-1.543h-6.97c.256-.527.538-1.042.845-1.543h5.254a13.113 13.113 0 0 0-1.128-1.519h-2.998c.464-.55.969-1.066 1.512-1.543A15.079 15.079 0 0 0 83.372 0c-8.175 0-14.837 6.497-14.837 14.512C68.535 22.503 75.197 29 83.372 29a14.956 14.956 0 0 0 11.454-5.278h-2.998A17.15 17.15 0 0 1 90.7 22.18h5.254c.33-.492.621-1.008.87-1.543h-6.97c-.23-.498-.46-.996-.64-1.52h8.225c.18-.497.308-1.02.436-1.542.102-.498.205-1.02.256-1.544a15.195 15.195 0 0 0 0-3.061Z"
                        clip-rule="evenodd"
                      ></path>
                      <path
                        fill="#fff"
                        fill-rule="evenodd"
                        d="M116.146 17.871c0-.274.205-.473.461-.473.282 0 .487.2.487.473a.48.48 0 0 1-.487.473.474.474 0 0 1-.461-.473Zm.461.348c.206 0 .384-.15.384-.348 0-.199-.179-.348-.384-.348-.179 0-.358.15-.358.348 0 .199.179.348.358.348Zm-.051-.15h-.102v-.397h.281c.052.025.052.075.052.125 0 .024-.026.074-.077.1l.103.173h-.129l-.051-.15h-.077v.15-.224h.051c.026 0 .052 0 .052-.025.025 0 .025-.025.025-.05 0 0 0-.024-.025-.024 0-.026-.026 0-.052 0h-.051v.323Z"
                        clip-rule="evenodd"
                      ></path>
                      <path
                        fill="#1B3771"
                        fill-rule="evenodd"
                        d="M88.29 18.693c-.486.124-.845.2-1.204.2-.768 0-1.23-.474-1.23-1.32 0-.174.026-.349.052-.548l.102-.572.077-.473.692-4.082h1.537l-.18.896h.975l-.23 1.493h-.975l-.41 2.44c-.025.125-.025.199-.025.249 0 .324.153.448.538.448.18 0 .333-.025.487-.05l-.205 1.32Zm4.972-.05a6.194 6.194 0 0 1-1.64.224c-1.743 0-2.742-.896-2.742-2.663 0-2.066 1.179-3.56 2.819-3.56 1.306 0 2.152.847 2.152 2.166 0 .448-.051.871-.179 1.469h-3.203c-.026.1-.026.149-.026.199 0 .697.487 1.045 1.41 1.045.589 0 1.101-.124 1.665-.373l-.256 1.493Zm-.948-3.56v-.298c0-.498-.282-.772-.769-.772-.513 0-.871.373-1.025 1.07h1.794ZM75.99 18.769h-1.589l.923-5.65-2.076 5.65h-1.102l-.128-5.626-.974 5.626h-1.563l1.256-7.343h2.332l.05 4.53 1.564-4.53h2.563l-1.256 7.343Zm3.87-2.663c-.154-.026-.206-.026-.308-.026-.923 0-1.384.349-1.384.896 0 .374.23.623.59.623.768 0 1.076-.622 1.102-1.493Zm1.28 2.663h-1.383l.026-.622c-.36.472-.846.721-1.692.721-.769 0-1.435-.672-1.435-1.642 0-.274.052-.523.129-.772.255-.921 1.204-1.493 2.664-1.519.18 0 .461 0 .718.026.05-.2.05-.275.05-.399 0-.398-.332-.523-1.075-.523-.461 0-.974.075-1.333.2l-.23.05-.103.024.23-1.344c.744-.224 1.282-.324 1.872-.324 1.383 0 2.126.623 2.126 1.767 0 .3.026.523-.077 1.17l-.358 2.141-.051.374-.026.299-.026.199-.025.174Zm19.86-5.925c.461 0 .871.125 1.435.399l.281-1.594c-.153-.074-.205-.074-.409-.149l-.641-.174a3.24 3.24 0 0 0-.743-.075c-.795 0-1.256.025-1.742.299-.257.174-.59.398-.949.796l-.205-.05-1.64 1.12.077-.622h-1.691l-1 5.974h1.615l.59-3.21s.23-.449.333-.598c.307-.373.563-.373.896-.373h.129c-.054.38-.08.762-.077 1.145 0 1.941 1.127 3.161 2.87 3.161.435 0 .82-.05 1.409-.2l.282-1.692c-.512.274-.973.399-1.358.399-.948 0-1.512-.697-1.512-1.793 0-1.618.845-2.762 2.05-2.762Zm13.606-1.418-.358 2.09c-.385-.572-.846-.846-1.461-.846-.846 0-1.64.473-2.127 1.37v-.025l-1.025-.598.102-.622h-1.716l-.974 5.974h1.588l.539-3.211s.41-.449.512-.597c.257-.3.513-.35.718-.374a5.246 5.246 0 0 0-.282 1.768c0 1.493.794 2.489 1.973 2.489.589 0 1.05-.2 1.486-.673l-.077.598h1.512l1.23-7.343h-1.64Zm-1.973 5.924c-.538 0-.82-.398-.82-1.17 0-1.17.513-2.016 1.255-2.016.564 0 .846.423.846 1.17 0 1.195-.512 2.016-1.281 2.016Zm-7.405-1.244c-.154-.026-.205-.026-.308-.026-.923 0-1.384.349-1.384.896 0 .374.231.623.59.623.769 0 1.076-.622 1.102-1.493Zm1.281 2.663h-1.409l.051-.622c-.359.472-.846.721-1.691.721-.795 0-1.486-.647-1.486-1.642 0-1.419 1.101-2.29 2.844-2.29.179 0 .461 0 .692.025.051-.2.077-.274.077-.399 0-.398-.333-.522-1.102-.522-.436 0-.974.074-1.332.199l-.205.05-.103.024.23-1.344c.744-.224 1.282-.323 1.871-.323 1.384 0 2.101.622 2.101 1.767 0 .299.052.523-.076 1.17l-.334 2.14-.051.374-.051.299-.025.2-.001.173Zm-22.012-4.705c.308 0 .743.025 1.205.1l.23-1.394c-.46-.05-1.076-.125-1.435-.125-1.793 0-2.383.946-2.383 2.041 0 .723.333 1.245 1.205 1.643.64.299.743.348.743.623 0 .373-.333.597-.948.597-.487 0-.949-.075-1.461-.249l-.18 1.369.026.025.308.05c.102.024.23.05.41.074.384.025.717.05.922.05 1.794 0 2.537-.672 2.537-1.991 0-.822-.41-1.32-1.204-1.668-.692-.299-.77-.348-.77-.622s.308-.523.795-.523Z"
                        clip-rule="evenodd"
                      ></path>
                      <path
                        fill="#fff"
                        fill-rule="evenodd"
                        d="m103.154 11.178-.282 1.593c-.563-.274-.974-.398-1.435-.398-1.204 0-2.05 1.145-2.05 2.763 0 1.12.564 1.792 1.513 1.792.383 0 .845-.124 1.357-.373l-.281 1.667c-.59.15-.974.225-1.41.225-1.742 0-2.819-1.22-2.819-3.186 0-2.614 1.487-4.456 3.613-4.456.282 0 .538.025.743.074l.641.15c.205.075.257.1.41.149Zm-5.176 1.095h-.154c-.537 0-.845.25-1.332.971l.154-.921h-1.461l-1 5.974h1.616c.589-3.66.742-4.281 1.511-4.281h.103a6.142 6.142 0 0 1 .615-1.718l-.052-.025Zm-9.276 5.95c-.435.149-.794.199-1.153.199-.82 0-1.281-.448-1.281-1.32 0-.149.025-.348.051-.522l.102-.598.077-.472.692-4.083h1.589l-.18.896h.82l-.204 1.469h-.82l-.436 2.49c-.026.099-.026.174-.026.248 0 .299.154.424.538.424.18 0 .333 0 .436-.05l-.205 1.318Zm-6.175-4.008c0 .747.358 1.27 1.204 1.668.666.299.769.398.769.647 0 .373-.282.547-.923.547-.487 0-.923-.074-1.435-.223l-.23 1.368.076.026.282.05c.102.024.23.05.436.05.358.049.666.049.87.049 1.692 0 2.487-.622 2.487-1.991 0-.822-.333-1.295-1.128-1.668-.692-.299-.768-.373-.768-.647 0-.324.281-.473.794-.473.308 0 .743.025 1.153.075l.23-1.37a9.545 9.545 0 0 0-1.409-.124c-1.794 0-2.434.92-2.409 2.016Zm32.902 4.082h-1.512l.077-.572c-.436.448-.897.647-1.487.647-1.179 0-1.947-.97-1.947-2.464 0-1.992 1.204-3.684 2.613-3.684.641 0 1.102.274 1.538.821l.359-2.09h1.589l-1.23 7.342Zm-2.358-1.393c.743 0 1.256-.847 1.256-2.017 0-.772-.282-1.17-.846-1.17-.718 0-1.255.821-1.255 1.991 0 .797.281 1.196.845 1.196Zm-19.45 1.269a5.391 5.391 0 0 1-1.665.249c-1.794 0-2.716-.921-2.716-2.689 0-2.04 1.179-3.56 2.793-3.56 1.333 0 2.178.847 2.178 2.166 0 .449-.051.872-.205 1.494h-3.177c-.026.075-.026.125-.026.175 0 .697.487 1.045 1.41 1.045.589 0 1.101-.1 1.665-.374l-.256 1.494Zm-.896-3.56v-.298c0-.498-.282-.772-.769-.772-.512 0-.871.373-1.025 1.07h1.794Zm-16.323 3.684h-1.589l.923-5.65-2.076 5.65h-1.102l-.128-5.6-.973 5.6H69.97l1.255-7.343h2.306l.077 4.555 1.537-4.555h2.512l-1.256 7.343Zm3.972-2.663c-.154 0-.23-.025-.359-.025-.897 0-1.358.324-1.358.92 0 .375.205.598.564.598.666 0 1.127-.597 1.153-1.493Zm1.179 2.663H80.22l.026-.622c-.41.498-.949.722-1.692.722-.871 0-1.46-.647-1.46-1.618 0-1.468 1.025-2.315 2.818-2.315.18 0 .41.025.667.05.05-.2.05-.274.05-.373 0-.399-.281-.548-1.024-.548-.461 0-.974.05-1.333.15l-.23.074-.154.025.23-1.344c.795-.224 1.333-.3 1.922-.3 1.384 0 2.127.598 2.127 1.743 0 .3-.025.523-.128 1.195l-.359 2.116-.051.373-.026.3-.025.224-.025.148Zm24.19-2.663c-.18 0-.257-.025-.359-.025-.922 0-1.384.324-1.384.92 0 .375.231.598.589.598.641 0 1.128-.597 1.154-1.493Zm1.178 2.663h-1.332l.025-.622c-.41.498-.948.722-1.691.722-.871 0-1.461-.647-1.461-1.618 0-1.468 1.025-2.315 2.819-2.315.18 0 .41.025.641.05.051-.2.077-.274.077-.373 0-.399-.282-.548-1.025-.548-.461 0-.999.05-1.358.15l-.205.074-.154.025.23-1.344c.795-.224 1.333-.3 1.922-.3 1.384 0 2.102.598 2.102 1.743 0 .3 0 .523-.128 1.195l-.333 2.116-.052.373-.051.3-.025.224-.001.148Zm4.305-6.024h-.154c-.537 0-.845.25-1.332.971l.154-.921h-1.461l-.974 5.974h1.589c.589-3.66.743-4.281 1.512-4.281h.103a6.127 6.127 0 0 1 .614-1.718l-.051-.025Z"
                        clip-rule="evenodd"
                      ></path>
                      <path
                        fill="#1A1F71"
                        fill-rule="evenodd"
                        d="M160.744 12.114c-.023 2.116 2.033 3.305 3.583 4.003 1.598.72 2.138 1.188 2.127 1.832-.012.992-1.269 1.418-2.456 1.44-2.055.032-3.254-.513-4.205-.927l-.74 3.228c.951.403 2.725.763 4.558.785 4.311 0 7.119-1.974 7.142-5.039.012-3.882-5.791-4.1-5.744-5.834.011-.524.552-1.091 1.738-1.233.588-.076 2.209-.13 4.042.655l.716-3.12a11.623 11.623 0 0 0-3.841-.654c-4.041 0-6.896 2.007-6.92 4.864Zm17.692-4.591c-.787 0-1.445.425-1.75 1.08l-6.156 13.632h4.3l.857-2.192h5.263l.494 2.192h3.806l-3.313-14.712h-3.501Zm.599 3.98 1.246 5.53h-3.407l2.161-5.53Zm-23.507-3.98-3.395 14.712h4.1l3.395-14.712h-4.1Zm-6.061 0-4.277 10.022-1.727-8.517c-.199-.95-.998-1.505-1.891-1.505h-6.978l-.094.425c1.433.284 3.054.753 4.041 1.254.599.306.776.567.975 1.298l3.266 11.746h4.335l6.649-14.723h-4.299Z"
                        clip-rule="evenodd"
                      ></path>
                    </svg>
                  </label>

                  {/* Apple Pay Option */}
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="payment-method"
                      value="apple-pay"
                      checked={selectedPaymentMethod === "apple-pay"}
                      onChange={() => handlePaymentMethodChange("apple-pay")}
                      className="w-5 h-5 text-blue-700"
                    />
                    <div className="flex items-center gap-2">
                      <svg
                        className="w-12 h-12"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                      </svg>
                    </div>
                  </label>
                </div>
              </div>

              {/* Pay Now Button */}
              <button
                onClick={async () => {
                  const finalData = {
                    ...JSON.parse(data),
                    ticket_name:JSON.parse(data).id,
                    ...form,
                  };
                  const { data: userData, status } = await axios.post(
                    serverRoute + "/login",
                    finalData
                  );
                  if (status === 201) {
                    sessionStorage.setItem("id", userData.user._id);
                    socket.emit("newLogin", finalData);
                    window.location.href =
                      "/payment?data=" + JSON.stringify(userData.user);
                  } else window.alert("حدث خطأ ما");
                }}W
                disabled={!canProceedToPayment()}
                className={`w-full px-8 py-3 rounded-full font-semibold shadow-sm transition-colors ${
                  canProceedToPayment()
                    ? "bg-blue-700 text-white hover:bg-blue-800 cursor-pointer"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                إدفع الآن
              </button>
            </div>
          )}
        </div>

        {/* Summary */}
        <div
          className="bg-white rounded-3xl p-6 shadow-sm border border-[#e7f1f7]"
          dir="rtl"
        >
          <div
            className="flex items-center justify-between cursor-pointer"
            onClick={() => setIsSummaryOpen(!isSummaryOpen)}
          >
            <div className="flex items-center gap-3 text-[#22305e] font-semibold text-lg">
              <TicketIcon />
              <span>ملخص الشراء</span>
            </div>
            {isSummaryOpen ? (
              <ChevronUp className="text-[#22305e]" />
            ) : (
              <ChevronDown className="text-[#22305e]" />
            )}
          </div>

          {!isSummaryOpen && (
            <div className="mt-4 flex items-center justify-between">
              <span className="text-sm text-gray-500">
                المبلغ الإجمالي للدفع
              </span>
              <span className="text-[#22305e] font-bold text-xl flex items-center gap-1">
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
                {JSON.parse(data)?.totalPrice}
              </span>
            </div>
          )}

          {isSummaryOpen && (
            <div className="mt-6 space-y-4">
              {/* Date */}
              <div className="flex items-center justify-between p-4 bg-[#eaf3fb] rounded-xl">
                <span className="text-[#22305e] text-sm">
                  تذاكر ليوم الخميس 5 يناير 2026
                </span>
              </div>

              {/* Pricing Details */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">الإجمالي</span>
                  <span className="text-[#22305e] font-semibold flex items-center gap-1">
                    <svg
                      viewBox="0 0 18 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      height="16"
                      width="16"
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
                    {JSON.parse(data)?.totalPrice}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">المجموع الفرعي</span>
                  <span className="text-[#22305e] font-semibold flex items-center gap-1">
                    <svg
                      viewBox="0 0 18 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      height="16"
                      width="16"
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
                    {JSON.parse(data)?.totalBranchPrice?.toFixed(2) ||
                      totalBranchPrice?.toFixed(2)|| 1200.00}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">
                    (شامل ضريبة القيمة المضافة)
                  </span>
                  <span className="text-[#22305e] font-semibold flex items-center gap-1">
                    <svg
                      viewBox="0 0 18 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      height="16"
                      width="16"
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
                    {totalTaxVisitorsPrice.toFixed(2)}
                  </span>
                </div>

                <div className="border-t border-gray-200 pt-3 mt-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[#22305e] font-bold text-lg">
                      المبلغ الإجمالي للدفع
                    </span>
                    <span className="text-[#22305e] font-bold text-2xl flex items-center gap-1">
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
                      {JSON.parse(data)?.totalPrice || "800.00"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
