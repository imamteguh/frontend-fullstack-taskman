import React from 'react'
import type { Route } from '../../+types/root';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router';

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "TaskMan" },
    { name: "description", content: "Welcome to TaskMan!" },
  ];
}

const HomePage = () => {
  return (
    <div className='w-full h-screen flex items-center justify-center gap-4'>
      <Link to={`/sign-in`}>
        <Button className='bg-blue-500 text-white'>Login</Button>
      </Link>
      <Link to={`/sign-up`}>
        <Button variant={`outline`}>Sign Up</Button>
      </Link>
    </div>
  )
}

export default HomePage