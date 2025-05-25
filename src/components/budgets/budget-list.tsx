
"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
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
import { BudgetForm } from "./budget-form";
import { useDataStore, useCalculatedData } from "@/hooks/use-data-store";
import type { Budget } from "@/lib/types";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";


export function BudgetList() {
  const { deleteBudget } = useDataStore();
  const { getBudgetProgress } = useCalculatedData();
  const budgets = getBudgetProgress();

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState<Budget | null>(null);

  const currencyFormatter = (value: number) => value.toLocaleString('en-IN', { style: 'currency', currency: 'INR' });

  if (budgets.length === 0) {
    return <p className="text-muted-foreground mt-4">No budgets set yet. Create your first budget goal!</p>;
  }

  return (
    <>
      <Dialog
        open={isEditDialogOpen}
        onOpenChange={(open) => {
          setIsEditDialogOpen(open);
          if (!open) {
            setSelectedBudget(null);
          }
        }}
      >
        <ScrollArea className={cn(
          "h-auto max-h-[300px] sm:max-h-[450px] md:max-h-[550px] lg:max-h-[600px]",
          "border rounded-md shadow-sm",
          "hover:scale-105 hover:shadow-xl hover:border-accent transition-all duration-300 ease-in-out"
          )}>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Category</TableHead>
                <TableHead>Budget Amount</TableHead>
                <TableHead>Amount Spent</TableHead>
                <TableHead>Remaining</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead className="w-[50px] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {budgets.map((budget) => {
                const progressValue = budget.amount > 0 ? (budget.spent / budget.amount) * 100 : 0;
                const isOverBudget = budget.spent > budget.amount;
                return (
                  <TableRow 
                    key={budget.id}
                    className={cn(
                      "relative transition-all duration-150 ease-in-out",
                      "hover:scale-[1.01] hover:shadow-lg hover:bg-muted/80 hover:z-10"
                    )}
                  >
                    <TableCell className="font-medium">{budget.category}</TableCell>
                    <TableCell>{currencyFormatter(budget.amount)}</TableCell>
                    <TableCell className={cn(isOverBudget && "text-destructive")}>{currencyFormatter(budget.spent)}</TableCell>
                    <TableCell className={cn(budget.remaining < 0 && "text-destructive")}>{currencyFormatter(budget.remaining)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                         <Progress
                            value={Math.min(progressValue,100)}
                            className={cn(
                              "w-[80px] sm:w-[100px] h-3", 
                              isOverBudget
                                ? "[&>div]:bg-destructive"
                                : progressValue >= 70
                                ? "[&>div]:bg-orange-500" 
                                : progressValue > 50 
                                ? "[&>div]:bg-yellow-400" 
                                : "" 
                            )}
                          />
                         <span className="text-xs text-muted-foreground">{Math.round(progressValue)}%</span>
                      </div>
                    </TableCell>
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
                            <DropdownMenuItem onClick={() => setSelectedBudget(budget)}>
                              <Edit2 className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                          </DialogTrigger>
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive focus:bg-destructive/10"
                            onClick={() => {
                              setSelectedBudget(budget);
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
                );
              })}
            </TableBody>
          </Table>
        </ScrollArea>

        {/* Edit Dialog Content */}
        {selectedBudget && isEditDialogOpen && (
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit Budget</DialogTitle>
            </DialogHeader>
            <BudgetForm
              budget={selectedBudget}
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
            setSelectedBudget(null);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the budget for
              "{selectedBudget?.category}".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => {
              setSelectedBudget(null);
            }}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (selectedBudget) deleteBudget(selectedBudget.id);
                setSelectedBudget(null);
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
