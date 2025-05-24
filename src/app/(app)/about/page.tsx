
"use client";

import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Info } from "lucide-react";
import { cn } from "@/lib/utils";

export default function AboutPage() {
  return (
    <>
      <PageHeader
        title="About Us"
        description="Learn more about SpendWise and its developer."
        icon={Info}
        imageUrl="https://placehold.co/300x200.png"
        imageHint="profile person"
      />
      <div className="mt-6 grid gap-6 md:grid-cols-1">
        <Card className={cn(
          "shadow-lg transition-all duration-300 ease-in-out",
          "hover:scale-105 hover:shadow-xl hover:border-accent"
        )}>
          <CardHeader>
            <CardTitle>About SpendWise</CardTitle>
            <CardDescription>
              Your personal finance companion.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-foreground">
              SpendWise is designed to help you effortlessly track your expenses, set meaningful budget goals,
              and gain valuable insights into your spending habits. Our goal is to empower you to take control
              of your financial well-being with a simple and intuitive interface.
            </p>
          </CardContent>
        </Card>

        <Card className={cn(
          "shadow-lg transition-all duration-300 ease-in-out",
          "hover:scale-105 hover:shadow-xl hover:border-accent"
        )}>
          <CardHeader>
            <CardTitle>The Developer</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-medium text-foreground">Kaushlendra Singh</p>
            <p className="text-muted-foreground">
              SpendWise is developed with passion by Kaushlendra Singh, dedicated to creating tools that make a difference.
            </p>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
