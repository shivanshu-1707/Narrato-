"use client";
import React from 'react'
import { AvatarType } from '@/app/types/user.types';
import { UserMenuBar } from './UserMenuBar';
import { signOut } from 'next-auth/react';
import ThemeSwitch from '../theme/ThemeSwitcher';

type Props = {
  user: AvatarType|null;
}

const Navbar = ({user}:Props) => {
  const logout=()=>{
    signOut();
  }

  const onProfileClick= ()=>{

  }
  return (
    <nav className=" flex items-center justify-center border-b  p-4 border-b-border min-w-max ">
      <div className='w-full sm:w-11/12 flex justify-between items-stretch gap-2'>
        <div className='flex'>
          <span className='text-2xl sm:text-3xl font-semibold text-foreground'>SlideScribe</span>
        </div>
        <ul className='flex list-none gap-4 items-stretch'>
          <li>
            <ThemeSwitch/>
          </li>
          <li>
            <UserMenuBar onLogout={logout} onProfileClick={onProfileClick} user={user}/>
          </li>
        </ul>
      </div>
    </nav>
  )
}

export default Navbar