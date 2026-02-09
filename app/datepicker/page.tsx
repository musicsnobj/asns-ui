"use client";

import { useState } from "react";
import Datepicker, { DateValueType } from "react-tailwindcss-datepicker";

export default function DatepickerPage() {
  const [value, setValue] = useState<DateValueType>({
    startDate: null,
    endDate: null,
  });

  const handleValueChange = (newValue: DateValueType) => {
    console.log("newValue:", newValue);
    setValue(newValue);
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="p-6 rounded-lg shadow-md bg-white">
        <Datepicker
          value={value}
          onChange={handleValueChange}
          useRange={true}
          asSingle={false}
          displayFormat="MM/DD/YYYY"
        />
      </div>
    </main>
  );
}
