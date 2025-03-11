import getSession from "@/app/actions/getSession";
import Navbar from "@/components/user/Navbar";
import WidthWrapper from "@/components/WidthWrapper";
import React from "react";
type Props = {
  children: React.ReactNode;
};

async function layout({ children }: Props) {
  const session = await getSession();
  const user = session?.user ?{
    name: session.user.name || null,
    email: session.user.email || null,
    image: session.user.image || null,
  }:null;
  return (
    <>
      <header className="mb-20 fixed top-0 z-30 w-full bg-background ">
        <Navbar user={user} />
      </header>
      <WidthWrapper>
        <div className="mt-24">
        {children}
        </div>
      </WidthWrapper>
    </>
  );
}

export default layout;
