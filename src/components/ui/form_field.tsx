import { Input } from "../ui/input"
import { Label } from "../ui/label"

export default function  FormField({
  label,
  optional,
  name,
  type = "text",
  placeholder,
  value,
  onChange,
  error,
}: {
  label: string;
  optional?: boolean;
  name: string;
  type?: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;

}) {
  return (
    <div className="flex flex-col space-y-1 ">
      <div className="
      flex flex-row items-center  mb-2 gap-4 ">


      <Label htmlFor={name} className="">
        {label}
        {optional && <span className="text-xs text-gray-400 ml-1">(optional)</span>}
      </Label>
      {error && <p className="text-destructive text-sm ">{error}</p>}
      </div>
      <Input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
      
    </div>
  )
}