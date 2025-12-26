import { ChevronDown, ChevronUp, TicketIcon } from "lucide-react";
import React from "react";
import { useState } from "react";
import { TicketRow } from "../screen/Cart";

export default function CartDateGroup({ cart, subtotal, onRemove }) {
  const [open, setOpen] = useState(false);
  const addData = sessionStorage.getItem("add")?.split(",") || [];
  return (
    <div className=" bg-[#eaf2f8] rounded-2xl pt-4 w-full">
      {/* ---------- Header ---------- */}
      <div
        className="flex flex-col items-center justify-between cursor-pointer w-full px-2 "
        onClick={() => setOpen((v) => !v)}
      >
        <div className="flex items-center justify-between gap-x-3 w-full ">
          <span className="font-semibold flex gap-x-2 items-center">
            <TicketIcon />
            {cart.date}
          </span>
          <div className="w-10 h-10 bg-[#1d2b6f] text-white rounded-full flex items-center justify-center">
            {open ? <ChevronUp /> : <ChevronDown />}
          </div>
        </div>
        <div className="w-full px-3 flex justify-between items-center border-t border-gray-400 pt-2 mt-2 ">
          <div className="flex flex-col gap-y-2 pt-1 ">
            <span className="">
              {" "}
              {cart.visitors.adultVisitors.length +
                cart.visitors.childVisitors.length || "1"}{" "}
              التذاكر
            </span>
            <span className="flex items-center gap-x-2">
              {cart.totalBranchPrice?.toFixed(2) || 1600.00} 
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
          <span className="font-bold ">المجموع الفرعي</span>
        </div>
      </div>

      {/* ---------- Collapsible Content ---------- */}
      <div
        className={`overflow-hidden transition-all duration-300 ${
          open ? "max-h-[2000px] mt-4" : "max-h-0"
        }`}
      >
        <div className="border-t border-gray-300 " />

        {/* Adult tickets */}
        {cart.visitors.adultVisitors.map((name, i) => (
          <TicketRow
            key={`adult-${i}`}
            data={cart}
            label="بالغ"
            name={name}
            price={450}
            visitorId={`adult-${i}`}
            onDelete={() => onRemove("adultVisitors", i)}
          />
        ))}

        {/* Child tickets */}
        {cart.visitors.childVisitors.map((name, i) => (
          <TicketRow
            key={`child-${i}`}
            data={cart}
            label="طفل"
            name={name}
            price={350}
            visitorId={`child-${i}`}
            onDelete={() => onRemove("childVisitors", i)}
          />
        ))}
        {cart.id === "family" ? (
          <TicketRow
            key={`child-family`}
            data={cart}
            label="family"
            name={"family"}
            price={1600}
            onDelete={() => onRemove("family", false)}
          />
        ) : (
          ""
        )}
      </div>
    </div>
  );
}
