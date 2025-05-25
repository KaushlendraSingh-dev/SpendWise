
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useDataStore, useCalculatedData } from "@/hooks/use-data-store";
import { useToast } from "@/hooks/use-toast";
// siteConfig is not directly used for categories here anymore for new expenses
import type { Expense } from "@/lib/types";
import { handleSuggestCategoryAction } from "@/lib/actions";
import React, { useState, useEffect } from "react";

const expenseFormSchema = z.object({
  description: z.string().min(2, "Description must be at least 2 characters.").max(100, "Description is too long."),
  amount: z.coerce.number().positive("Amount must be positive."),
  category: z.string().min(1, "Please select a category with an active budget."),
  date: z.date({ required_error: "Please select a date." }),
});

type ExpenseFormValues = z.infer<typeof expenseFormSchema>;

interface ExpenseFormProps {
  expense?: Expense; 
  onFormSubmit?: () => void; 
  setOpen?: (open: boolean) => void; 
}

export function ExpenseForm({ expense, onFormSubmit, setOpen }: ExpenseFormProps) {
  const { addExpense, updateExpense } = useDataStore();
  const { budgets: userBudgets } = useCalculatedData(); // Get user's set budgets
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);
  const { toast } = useToast();
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  useEffect(() => {
    let categoriesForSelect: string[];
    const budgetedCategories = userBudgets.map(b => b.category);

    if (expense) { // If editing an existing expense
      // Ensure the current expense's category is in the list, plus all budgeted categories
      categoriesForSelect = Array.from(new Set([...budgetedCategories, expense.category]));
    } else { // If adding a new expense
      categoriesForSelect = budgetedCategories;
    }
    setAvailableCategories(categoriesForSelect.sort((a,b) => a.localeCompare(b)));
  }, [userBudgets, expense]);
  
  const defaultValues: Partial<ExpenseFormValues> = expense
    ? {
        description: expense.description,
        amount: expense.amount,
        category: expense.category,
        date: new Date(expense.date),
      }
    : {
        description: "",
        amount: "" as any, 
        category: "",
        date: new Date(),
      };

  const form = useForm<ExpenseFormValues>({
    resolver: zodResolver(expenseFormSchema),
    defaultValues,
  });

  const descriptionValue = form.watch("description");

  async function onSubmit(data: ExpenseFormValues) {
    setIsSubmitting(true);
    const expensePayload = {
      description: data.description,
      amount: data.amount,
      category: data.category,
      date: data.date, 
    };

    try {
      if (expense) {
        await updateExpense({ id: expense.id, ...expensePayload });
        toast({ title: "Expense Updated", description: "Your expense has been successfully updated." });
      } else {
        await addExpense(expensePayload);
        toast({ title: "Expense Added", description: "New expense logged successfully." });
        form.reset({description: "", amount: "" as any, category: "", date: new Date() }); 
      }
      onFormSubmit?.();
      setOpen?.(false);
    } catch (error: any) {
      console.error("Expense form submission error:", error);
      toast({ 
        title: expense ? "Update Failed" : "Add Failed", 
        description: error.message || "Could not save expense. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleSuggestCategory = async () => {
    if (!descriptionValue || descriptionValue.length < 3) {
      form.setError("description", { type: "manual", message: "Enter a description (min 3 chars) to get suggestions." });
      return;
    }
    setIsSuggesting(true);
    const formData = new FormData();
    formData.append('description', descriptionValue);
    
    try {
      const result = await handleSuggestCategoryAction(null, formData);
      if (result.error) {
        toast({ title: "Suggestion Failed", description: result.error, variant: "destructive" });
      } else if (result.category) {
        // Only set the value if it's an available (budgeted) category for new expenses,
        // or if it's the expense's current category when editing.
        if (availableCategories.includes(result.category)) {
          form.setValue("category", result.category, { shouldValidate: true });
        } else if (expense && expense.category === result.category) {
           form.setValue("category", result.category, { shouldValidate: true });
        }
        toast({ title: "Category Suggested!", description: `We think '${result.category}' is a good fit (Confidence: ${Math.round((result.confidence || 0)*100)}%). You may need to set a budget for this category if it's not selectable.` });
      }
    } catch (error: any) {
        console.error("AI Suggestion Error:", error);
        toast({ title: "Suggestion Error", description: "Could not get AI suggestion.", variant: "destructive"})
    } finally {
        setIsSuggesting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <div className="flex gap-2">
                <Input placeholder="e.g., Coffee with a friend" {...field} disabled={isSubmitting} />
                <Button 
                    type="button" 
                    variant="outline" 
                    size="icon" 
                    onClick={handleSuggestCategory}
                    disabled={isSuggesting || isSubmitting || !descriptionValue || descriptionValue.length < 3}
                    title="Suggest Category (AI)"
                >
                    <Sparkles className={cn("h-4 w-4", isSuggesting && "animate-pulse")} />
                </Button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount (₹)</FormLabel>
              <FormControl>
                <Input type="number" step="0.01" placeholder="0.00" {...field} disabled={isSubmitting} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value} disabled={isSubmitting}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category with a budget" />
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
                     <SelectItem value="no_category_budgeted" disabled>
                      {expense && expense.category ? expense.category : "No budgeted categories. Set a budget first."}
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
              {availableCategories.length === 0 && !expense && (
                <FormDescription>
                  Please set a budget for a category before adding expenses to it.
                </FormDescription>
              )}
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                      disabled={isSubmitting}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date > new Date() || date < new Date("1900-01-01") || isSubmitting
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" disabled={isSubmitting || (availableCategories.length === 0 && !expense) }>
          {isSubmitting ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-foreground"></div>
          ) : (
            expense ? "Update Expense" : "Add Expense"
          )}
        </Button>
      </form>
    </Form>
  );
}
