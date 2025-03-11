import Login from "./Login";
import SignUp from "./SignUp";

export default function page({ params }: { params: { type: string } }) {
  

  return <>{(params.type==="login")?<Login/>:<SignUp/>}</>
}
