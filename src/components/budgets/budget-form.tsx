
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
import { cn } from "@/lib/utils";


const budgetFormSchema = z.object({
  category: z.string().min(1, "Please select a category."),
  amount: z.coerce.number().positive("Amount must be positive."),
});

type BudgetFormValues = z.infer<typeof budgetFormSchema>;

interface BudgetFormProps {
  budget?: Budget; 
  onFormSubmit?: () => void;
  setOpen?: (open: boolean) => void;
}

export function BudgetForm({ budget, onFormSubmit, setOpen }: BudgetFormProps) {
  const { addBudget, updateBudget, budgets: allBudgetsFromStore } = useDataStore(); // Renamed for clarity
  const { getAllCategories } = useCalculatedData();
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    const allSystemCategories = getAllCategories();
    if (budget) {
      // When editing, only the budget's current category is needed for the Select, as it's disabled.
      setAvailableCategories([budget.category]);
    } else {
      // When adding, show categories from system config that are not yet budgeted.
      const existingBudgetedCategories = allBudgetsFromStore.map(b => b.category);
      const categoriesForSelect = allSystemCategories.filter(cat => !existingBudgetedCategories.includes(cat));
      setAvailableCategories(categoriesForSelect);
    }
  }, [getAllCategories, allBudgetsFromStore, budget]);


  const form = useForm<BudgetFormValues>({
    resolver: zodResolver(budgetFormSchema),
    defaultValues,
  });

  async function onSubmit(data: BudgetFormValues) {
    setIsSubmitting(true);
    const budgetPayload = {
      category: data.category,
      amount: data.amount,
    };

    try {
      if (budget) { 
        await updateBudget({ id: budget.id, ...budgetPayload });
        toast({ title: "Budget Updated", description: `Budget for ${data.category} updated successfully.` });
      } else { 
        const existingBudget = allBudgetsFromStore.find(b => b.category === data.category);
        if (existingBudget) {
          form.setError("category", { message: "A budget for this category already exists."});
          setIsSubmitting(false); // Reset submitting state if there's a validation error
          return;
        }
        await addBudget(budgetPayload);
        toast({ title: "Budget Set", description: `Budget for ${data.category} set successfully.` });
        form.reset({ category: "", amount: "" as any }); 
      }
      onFormSubmit?.();
      setOpen?.(false);
    } catch (error: any) {
      console.error("Budget form submission error:", error);
      toast({
        title: budget ? "Update Failed" : "Set Budget Failed",
        description: error.message || "Could not save budget. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
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
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value} 
                disabled={!!budget || isSubmitting}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category for budget" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {availableCategories.length > 0 ? (
                    availableCategories.map((cat) => (
                       <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="no_category" disabled>
                      {budget ? budget.category : "No new categories available"}
                    </SelectItem>
                  )}
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
              <FormLabel>Budget Amount (₹)</FormLabel>
              <FormControl>
                <Input type="number" step="0.01" placeholder="0.00" {...field} disabled={isSubmitting}/>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" disabled={isSubmitting}>
          {isSubmitting ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-foreground"></div>
          ) : (
            budget ? "Update Budget" : "Set Budget"
          )}
        </Button>
      </form>
    </Form>
  );
}

    