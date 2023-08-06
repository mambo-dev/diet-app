import { Fragment, useState } from "react";
import { Listbox, Transition } from "@headlessui/react";

export default function SelectLifestyle({
  options,
  defaultOption,
  selectedOption,
  setSelectedOption,
}: {
  options: string[];
  defaultOption: string;
  selectedOption: string;
  setSelectedOption: React.Dispatch<React.SetStateAction<string>>;
}) {
  return (
    <Listbox value={selectedOption} onChange={setSelectedOption}>
      <div className="relative flex flex-col gap-2 w-full ">
        <label className="font-medium text-slate-800">Lifestyle</label>
        <Listbox.Button className="relative flex  h-10 w-full rounded-md border border-gray-300 bg-white py-2 px-3 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:border-green-600 hover:border-green-500  ring-opacity-30 ring-green-300 focus:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:text-slate-50 dark:focus:ring-green-300 dark:focus:ring-offset-green-900">
          {selectedOption}
        </Listbox.Button>
        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Listbox.Options className="absolute mt-1 top-full max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
            {options.map((option, index) => (
              <Listbox.Option
                className="hover:bg-green-100 hover:text-green-900 hover:font-medium hover:cursor-pointer py-2 pl-10 pr-4"
                key={index}
                value={option}
              >
                {option}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Transition>
      </div>
    </Listbox>
  );
}
