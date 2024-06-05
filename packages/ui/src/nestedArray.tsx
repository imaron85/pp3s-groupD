import {
  Control,
  FieldValues,
  UseFormRegister,
  useFieldArray,
} from "react-hook-form";

interface NestedArrayProps {
  nestIndex: number;
  control: Control<FieldValues, any>;
  register: UseFormRegister<FieldValues>;
}

export const NestedArray = ({
  nestIndex,
  control,
  register,
}: NestedArrayProps) => {
  const { fields, remove, append } = useFieldArray({
    control,
    name: `questions.${nestIndex}.options`,
  });
  return (
    <div className="ml-4">
      <label className="block text-sm font-medium text-gray-700">
        Options:
      </label>
      {fields.map((item, k) => (
        <div key={item.id} className="flex items-center mb-2">
          <input
            {...register(`questions.${nestIndex}.options.${k}.text`, {
              required: true,
            })}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm mr-2"
          />
          <button
            type="button"
            onClick={() => remove(k)}
            className="text-red-600 hover:underline"
          >
            Delete
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => append({ text: "" })}
        className="mt-2 px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
      >
        Add new
      </button>
    </div>
  );
};
