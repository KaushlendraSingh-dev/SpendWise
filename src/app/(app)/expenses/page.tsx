
"use client";

import { useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { ExpenseForm } from "@/components/expenses/expense-form";
import { ExpenseList } from "@/components/expenses/expense-list";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { PlusCircle, CreditCard } from "lucide-react";

export default function ExpensesPage() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  return (
    <>
      <PageHeader
        title="Expenses"
        description="Log and manage your daily expenses."
        icon={CreditCard}
        imageUrl="https://cdn-icons-png.flaticon.com/512/10758/10758868.png"
        imageHint="spending money"
        actions={
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                <PlusCircle className="mr-2 h-5 w-5" /> Add Expense
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New Expense</DialogTitle>
              </DialogHeader>
              <ExpenseForm 
                onFormSubmit={() => setIsAddDialogOpen(false)}
                setOpen={setIsAddDialogOpen}
              />
            </DialogContent>
          </Dialog>
        }
      />
      <div className="mt-6">
        <ExpenseList />
      </div>
    </>
  );
}
