
"use client";

import { PageHeader } from "@/components/shared/page-header";
import { Calculator as CalculatorIcon } from "lucide-react";
import { Calculator } from "@/components/calculator/calculator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export default function CalculatorPage() {
  return (
    <>
      <PageHeader
        title="Calculator"
        description="Perform simple calculations."
        icon={CalculatorIcon}
        imageUrl="https://placehold.co/300x200.png"
        imageHint="calculator abstract"
      />
      <div className="mt-6 flex justify-center">
        <Card className={cn(
          "w-full max-w-md shadow-xl transition-all duration-300 ease-in-out",
          "hover:scale-105 hover:shadow-2xl hover:border-accent" // Added shadow-2xl for more pop
        )}>
          <CardHeader>
            <CardTitle className="text-center">Simple Calculator</CardTitle>
          </CardHeader>
          <CardContent>
            <Calculator />
          </CardContent>
        </Card>
      </div>
    </>
  );
}
