
"use client";

import { useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { BudgetForm } from "@/components/budgets/budget-form";
import { BudgetList } from "@/components/budgets/budget-list";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { PlusCircle, Target } from "lucide-react";

export default function BudgetsPage() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  return (
    <>
      <PageHeader
        title="Budgets"
        description="Set and track your monthly spending goals for various categories."
        icon={Target}
        imageHint="piggybank savings"
        actions={
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                <PlusCircle className="mr-2 h-5 w-5" /> Set New Budget
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Set New Budget</DialogTitle>
              </DialogHeader>
              <BudgetForm 
                onFormSubmit={() => setIsAddDialogOpen(false)}
                setOpen={setIsAddDialogOpen}
              />
            </DialogContent>
          </Dialog>
        }
      />
      <div className="mt-6">
        <BudgetList />
      </div>
    </>
  );
}
