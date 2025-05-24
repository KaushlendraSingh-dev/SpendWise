
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDataStore, useCalculatedData } from "@/hooks/use-data-store";
import { useToast } from "@/hooks/use-toast";
import { siteConfig } from "@/config/site";
import type { Budget } from "@/lib/types";
import React, { useEffect, useState } from "react";


const budgetFormSchema = z.object({
  category: z.string().min(1, "Please select a category."),
  amount: z.coerce.number().positive("Amount must be positive."),
});

type BudgetFormValues = z.infer<typeof budgetFormSchema>;

interface BudgetFormProps {
  budget?: Budget; // For editing
  onFormSubmit?: () => void;
  setOpen?: (open: boolean) => void;
}

export function BudgetForm({ budget, onFormSubmit, setOpen }: BudgetFormProps) {
  const { addBudget, updateBudget, budgets } = useDataStore();
  const { getAllCategories } = useCalculatedData();
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);

  const { toast } = useToast();

  const defaultValues: Partial<BudgetFormValues> = budget
    ? {
        category: budget.category,
        amount: budget.amount,
      }
    : {
        category: "",
        amount: "" as any,
      };
  
  useEffect(() => {
    const allCats = getAllCategories();
    if (budget) {
      // When editing, the Select is disabled. We only need budget.category in the list
      // for the Select component to render its current value correctly.
      setAvailableCategories([budget.category]);
    } else {
      // When adding, show categories that are not yet budgeted.
      const existingBudgetedCategories = budgets.map(b => b.category);
      const categoriesForSelect = allCats.filter(cat => !existingBudgetedCategories.includes(cat));
      setAvailableCategories(categoriesForSelect);
    }
  }, [getAllCategories, budgets, budget]);


  const form = useForm<BudgetFormValues>({
    resolver: zodResolver(budgetFormSchema),
    defaultValues,
  });

  function onSubmit(data: BudgetFormValues) {
    if (budget) { // Editing existing budget
      updateBudget({ ...budget, ...data });
      toast({ title: "Budget Updated", description: `Budget for ${data.category} updated successfully.` });
    } else { // Adding new budget
      const existingBudget = budgets.find(b => b.category === data.category);
      if (existingBudget) {
        form.setError("category", { message: "A budget for this category already exists."});
        return;
      }
      addBudget(data);
      toast({ title: "Budget Set", description: `Budget for ${data.category} set successfully.` });
      form.reset({ category: "", amount: "" as any }); 
    }
    onFormSubmit?.();
    setOpen?.(false);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value} disabled={!!budget}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category for budget" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {availableCategories.map((cat) => (
                     <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Budget Amount ($)</FormLabel>
              <FormControl>
                <Input type="number" step="0.01" placeholder="0.00" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
          {budget ? "Update Budget" : "Set Budget"}
        </Button>
      </form>
    </Form>
  );
}
