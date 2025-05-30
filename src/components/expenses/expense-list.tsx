
"use client";

import { useState } from "react";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Edit2, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ExpenseForm } from "./expense-form";
import { useDataStore } from "@/hooks/use-data-store";
import type { Expense } from "@/lib/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

export function ExpenseList() {
  const { expenses, deleteExpense } = useDataStore();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
  
  const currencyFormatter = (value: number) => value.toLocaleString('en-IN', { style: 'currency', currency: 'INR' });

  if (expenses.length === 0) {
    return <p className="text-muted-foreground mt-4">No expenses logged yet. Add your first expense!</p>;
  }
  
  const sortedExpenses = [...expenses].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <>
      <Dialog 
        open={isEditDialogOpen} 
        onOpenChange={(open) => {
          setIsEditDialogOpen(open);
          if (!open) {
            setSelectedExpense(null);
          }
        }}
      >
        <ScrollArea className={cn(
            "h-auto sm:max-h-[450px] md:max-h-[550px] lg:max-h-[600px]", 
            "border rounded-md shadow-sm",
            "hover:shadow-xl hover:border-accent transition-all duration-300 ease-in-out" // Removed hover:scale-105
          )}>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="w-[50px] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedExpenses.map((expense) => (
                <TableRow 
                  key={expense.id} 
                  className={cn(
                    "relative transition-all duration-150 ease-in-out",
                    "hover:scale-[1.01] hover:shadow-lg hover:bg-muted/80 hover:z-10"
                  )}
                >
                  <TableCell>{format(new Date(expense.date), "MMM d, yyyy")}</TableCell>
                  <TableCell className="font-medium max-w-[100px] sm:max-w-[150px] md:max-w-[200px] truncate" title={expense.description}>{expense.description}</TableCell>
                  <TableCell>{expense.category}</TableCell>
                  <TableCell className="text-right">{currencyFormatter(expense.amount)}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DialogTrigger asChild>
                          <DropdownMenuItem onClick={() => setSelectedExpense(expense)}>
                            <Edit2 className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                        </DialogTrigger>
                        <DropdownMenuItem 
                          className="text-destructive focus:text-destructive focus:bg-destructive/10" 
                          onClick={() => {
                            setSelectedExpense(expense);
                            setIsDeleteAlertOpen(true);
                          }}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>

        {/* Edit Dialog Content */}
        {selectedExpense && isEditDialogOpen && (
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit Expense</DialogTitle>
            </DialogHeader>
            <ExpenseForm
              expense={selectedExpense}
              onFormSubmit={() => {
                setIsEditDialogOpen(false);
              }}
              setOpen={setIsEditDialogOpen}
            />
          </DialogContent>
        )}
      </Dialog>
      
      {/* Delete Alert Dialog */}
      <AlertDialog 
        open={isDeleteAlertOpen} 
        onOpenChange={(open) => {
          setIsDeleteAlertOpen(open);
          if (!open) {
            setSelectedExpense(null);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the expense
              "{selectedExpense?.description}".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => {
              setSelectedExpense(null);
            }}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (selectedExpense) deleteExpense(selectedExpense.id);
                setSelectedExpense(null);
              }}
              className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

