"use client";

import { useState } from "react";
import Datepicker, { DateValueType } from "react-tailwindcss-datepicker";

type Props = {
  value: DateValueType;
  onChange: (value: DateValueType) => void;
};

export default function DateRangePicker({ value, onChange }: Props) {
  // const [value, setValue] = useState<DateValueType>({
  //   startDate: null,
  //   endDate: null,
  // });

  const handleValueChange = (newValue: DateValueType) => {
    console.log("new value: ", newValue);
    onChange?.(newValue);
  };

  return (
    <>
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">
          Show results after date:
        </label>
        <Datepicker
          value={{
            startDate: value?.startDate || null,
            endDate: value?.startDate || null,
          }}
          onChange={(newValue: DateValueType) => {
            onChange({
              startDate: newValue?.startDate || null,
              endDate: value?.endDate || null,
            });
          }}
          useRange={false}
          asSingle={true}
          displayFormat="MM/DD/YYYY"
          inputClassName="w-1/2 rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          popoverDirection="up"
        />
      </div>
      <div className="flex flex-col gap-1 mt-2">
        <label className="text-sm font-medium text-gray-700">
          Show results before date:
        </label>
        <Datepicker
          value={{
            startDate: value?.endDate || null,
            endDate: value?.endDate || null,
          }}
          onChange={(newValue: DateValueType) => {
            onChange({
              startDate: value?.startDate || null,
              endDate: newValue?.startDate || null,
            });
          }}
          useRange={false}
          asSingle={true}
          displayFormat="MM/DD/YYYY"
          inputClassName="w-1/2 rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          popoverDirection="up"
        />
      </div>
    </>
  );
}
