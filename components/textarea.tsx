import { UseFormRegisterReturn } from 'react-hook-form';

interface TextAreaProps {
  label?: string;
  name?: string;
  rows?: number;
  register: UseFormRegisterReturn;
  [attrs: string]: any;
}

export default function TextArea({ label = '', name, register, rows = 4, ...attrs }: TextAreaProps) {
  return (
    <div>
      <label htmlFor={name} className="mb-1 block text-sm font-medium text-gray-700">
        {label}
      </label>
      <textarea
        {...register}
        id={name}
        className="mt-1 shadow-sm w-full focus:ring-orange-500 rounded-md border-gray-300 focus:border-orange-500 "
        rows={rows}
        {...attrs}
      />
    </div>
  );
}
