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
import { siteConfig } from "@/config/site";
import type { Expense } from "@/lib/types";
import { handleSuggestCategoryAction } from "@/lib/actions";
import React, { useState, useEffect } from "react";

const expenseFormSchema = z.object({
  description: z.string().min(2, "Description must be at least 2 characters.").max(100, "Description is too long."),
  amount: z.coerce.number().positive("Amount must be positive."),
  category: z.string().min(1, "Please select a category."),
  date: z.date({ required_error: "Please select a date." }),
});

type ExpenseFormValues = z.infer<typeof expenseFormSchema>;

interface ExpenseFormProps {
  expense?: Expense; // For editing
  onFormSubmit?: () => void; // Callback after successful submission
  setOpen?: (open: boolean) => void; // To close dialog/sheet
}

export function ExpenseForm({ expense, onFormSubmit, setOpen }: ExpenseFormProps) {
  const { addExpense, updateExpense } = useDataStore();
  const { getAllCategories } = useCalculatedData();
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);
  const { toast } = useToast();
  const [isSuggesting, setIsSuggesting] = useState(false);

  useEffect(() => {
    setAvailableCategories(getAllCategories());
  }, [getAllCategories]);
  
  const defaultValues: Partial<ExpenseFormValues> = expense
    ? {
        description: expense.description,
        amount: expense.amount,
        category: expense.category,
        date: new Date(expense.date),
      }
    : {
        date: new Date(),
      };

  const form = useForm<ExpenseFormValues>({
    resolver: zodResolver(expenseFormSchema),
    defaultValues,
  });

  const descriptionValue = form.watch("description");

  async function onSubmit(data: ExpenseFormValues) {
    const expenseData = {
      ...data,
      date: data.date.toISOString(),
    };
    if (expense) {
      updateExpense({ ...expense, ...expenseData });
      toast({ title: "Expense Updated", description: "Your expense has been successfully updated." });
    } else {
      addExpense(expenseData);
      toast({ title: "Expense Added", description: "New expense logged successfully." });
      form.reset({description: "", amount: undefined, category: "", date: new Date() }); // Reset form to defaults
    }
    onFormSubmit?.();
    setOpen?.(false);
  }

  const handleSuggestCategory = async () => {
    if (!descriptionValue || descriptionValue.length < 3) {
      form.setError("description", { type: "manual", message: "Enter a description (min 3 chars) to get suggestions." });
      return;
    }
    setIsSuggesting(true);
    const formData = new FormData();
    formData.append('description', descriptionValue);
    
    const result = await handleSuggestCategoryAction(null, formData);
    setIsSuggesting(false);

    if (result.error) {
      toast({ title: "Suggestion Failed", description: result.error, variant: "destructive" });
    } else if (result.category) {
      form.setValue("category", result.category, { shouldValidate: true });
      // Add to available categories if it's new
      if (!availableCategories.includes(result.category)) {
        setAvailableCategories(prev => [...prev, result.category!].sort());
      }
      toast({ title: "Category Suggested!", description: `We think '${result.category}' is a good fit (Confidence: ${Math.round((result.confidence || 0)*100)}%).` });
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
                <Input placeholder="e.g., Coffee with a friend" {...field} />
                <Button 
                    type="button" 
                    variant="outline" 
                    size="icon" 
                    onClick={handleSuggestCategory}
                    disabled={isSuggesting || !descriptionValue || descriptionValue.length < 3}
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
              <FormLabel>Amount ($)</FormLabel>
              <FormControl>
                <Input type="number" step="0.01" placeholder="0.00" {...field} />
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
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
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
                      date > new Date() || date < new Date("1900-01-01")
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
          {expense ? "Update Expense" : "Add Expense"}
        </Button>
      </form>
    </Form>
  );
}
