import React from 'react'
import type { Route } from '../../+types/root';
import { Button } from '@/components/ui/button';

export function meta({}: Route.MetaArgs) {
  return [
    { title: "TaskMan" },
    { name: "description", content: "Welcome to TaskMan!" },
  ];
}

const HomePage = () => {
  return (
    <div>
      <Button>Click Me</Button>
    </div>
  )
}

export default HomePage