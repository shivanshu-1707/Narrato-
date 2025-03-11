import { cn } from '@/lib/utils'
import { CircleAlert } from "lucide-react";

type Props = {
  message:string
  className?:string
}

const FormErrors = ({message,className}: Props) => {
  return (
    <span className={cn("text-red-500 text-xs flex items-center gap-1",{className})}>
      <CircleAlert size={11}/>
      {message}
    </span>
  )
}

export default FormErrors