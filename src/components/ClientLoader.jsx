'use client';

import { useEffect, useState } from "react";

// Actual Loading Component
import Loading from "@/components/Loading";

export default function ClientLoader({ children })
{
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() =>
  {
    // Adding a delay before setting isLoading false, later can be used to load up resources too..
    const delay = process.env.NEXT_PUBLIC_FAKE_LOADING === 'true' ? 3000 : 0;
    const timer = setTimeout(() => setIsLoading(false), delay);
    
    //Clearing setTimeout
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) return <Loading />;

  return <>{children}</>;
}
