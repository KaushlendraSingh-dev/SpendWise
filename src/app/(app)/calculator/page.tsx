
"use client";

import { PageHeader } from "@/components/shared/page-header";
import { Calculator as CalculatorIcon } from "lucide-react";
import { Calculator } from "@/components/calculator/calculator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
        <Card className="w-full max-w-md shadow-xl">
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
