"use client";

import { useFieldArray, useForm } from "react-hook-form";
import { Navbar } from "@repo/ui/navbar";
import { NestedArray } from "@repo/ui/nestedArray";

const CreateGame = () => {
  const { control, register, getValues, setValue } = useForm();

  const { fields, append, prepend, remove } = useFieldArray({
    control,
    name: "questions",
  });

  return (
    <>
      <Navbar />
      <div className="p-4 max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Create Game</h1>
        <ul>
          {fields.map((item, index) => (
            <li key={item.id} className="mb-6 border-b pb-4">
              <div className="mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Question {index + 1}:
                </label>
                <input
                  {...register(`questions.${index}.name`)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              <NestedArray nestIndex={index} {...{ control, register }} />
              <button
                type="button"
                onClick={() => remove(index)}
                className="mt-2 text-red-600 hover:underline"
              >
                Delete Question
              </button>
            </li>
          ))}
        </ul>
        <div className="mt-4">
          <button
            type="button"
            onClick={() => {
              prepend({ name: "" });
            }}
            className="mr-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Add New Question
          </button>
        </div>
      </div>
    </>
  );
};

export default CreateGame;
