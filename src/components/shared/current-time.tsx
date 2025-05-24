
"use client";

import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

export function CurrentTime() {
  const [currentTime, setCurrentTime] = useState<string | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);

    // Set initial time
    setCurrentTime(new Date().toLocaleTimeString());

    return () => {
      clearInterval(timer);
    };
  }, []);

  if (currentTime === null) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Clock className="h-4 w-4" />
        <span>Loading time...</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 text-sm font-medium text-foreground">
      <Clock className="h-4 w-4" />
      <span>{currentTime}</span>
    </div>
  );
}
