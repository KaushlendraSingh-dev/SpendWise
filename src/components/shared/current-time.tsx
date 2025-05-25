
"use client";

import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

export function CurrentTime() {
  const [currentTime, setCurrentTime] = useState<string | null>(null);

  useEffect(() => {
    // Set initial time immediately on client mount
    setCurrentTime(new Date().toLocaleTimeString());

    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);

    // Cleanup interval on component unmount
    return () => {
      clearInterval(timer);
    };
  }, []); // Empty dependency array ensures this runs once on mount (client-side)

  if (currentTime === null) {
    // This state will be rendered on the server and on the initial client render
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Clock className="h-4 w-4" />
        <span>Loading time...</span>
      </div>
    );
  }

  // This state is rendered after client-side hydration and useEffect has run
  return (
    <div className="flex items-center gap-2 text-sm font-medium text-foreground">
      <Clock className="h-4 w-4" />
      <span>{currentTime}</span>
    </div>
  );
}
