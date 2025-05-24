
"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

export function Calculator() {
  const [displayValue, setDisplayValue] = useState<string>('0');
  const [firstOperand, setFirstOperand] = useState<number | null>(null);
  const [operator, setOperator] = useState<string | null>(null);
  const [waitingForSecondOperand, setWaitingForSecondOperand] = useState<boolean>(false);

  const inputDigit = (digit: string) => {
    if (waitingForSecondOperand) {
      setDisplayValue(digit);
      setWaitingForSecondOperand(false);
    } else {
      setDisplayValue(displayValue === '0' ? digit : displayValue + digit);
    }
  };

  const inputDecimal = () => {
    if (waitingForSecondOperand) {
      setDisplayValue('0.');
      setWaitingForSecondOperand(false);
      return;
    }
    if (!displayValue.includes('.')) {
      setDisplayValue(displayValue + '.');
    }
  };

  const handleOperator = (nextOperator: string) => {
    const inputValue = parseFloat(displayValue);

    if (operator && waitingForSecondOperand) {
      setOperator(nextOperator);
      return;
    }

    if (firstOperand === null) {
      setFirstOperand(inputValue);
    } else if (operator) {
      const result = performCalculation();
      setDisplayValue(String(parseFloat(result.toFixed(7)))); // Limit precision
      setFirstOperand(result);
    }

    setWaitingForSecondOperand(true);
    setOperator(nextOperator);
  };

  const performCalculation = (): number => {
    const inputValue = parseFloat(displayValue);
    if (firstOperand === null || operator === null) return inputValue;

    switch (operator) {
      case '+':
        return firstOperand + inputValue;
      case '-':
        return firstOperand - inputValue;
      case '*':
        return firstOperand * inputValue;
      case '/':
        return firstOperand / inputValue;
      default:
        return inputValue;
    }
  };

  const handleEquals = () => {
    if (operator && firstOperand !== null) {
      const result = performCalculation();
      setDisplayValue(String(parseFloat(result.toFixed(7))));
      setFirstOperand(null); // Reset for new calculation chain
      setOperator(null);
      setWaitingForSecondOperand(true); // Ready for new number or operator
    }
  };

  const resetCalculator = () => {
    setDisplayValue('0');
    setFirstOperand(null);
    setOperator(null);
    setWaitingForSecondOperand(false);
  };

  const calculatorButtons = [
    { label: 'AC', action: resetCalculator, className: 'col-span-2 bg-destructive hover:bg-destructive/90 text-destructive-foreground' },
    { label: '%', action: () => handleOperator('%'), className: 'bg-secondary hover:bg-secondary/80' }, // Placeholder for percent
    { label: '/', action: () => handleOperator('/'), className: 'bg-accent hover:bg-accent/90 text-accent-foreground' },
    { label: '7', action: () => inputDigit('7') },
    { label: '8', action: () => inputDigit('8') },
    { label: '9', action: () => inputDigit('9') },
    { label: '*', action: () => handleOperator('*'), className: 'bg-accent hover:bg-accent/90 text-accent-foreground' },
    { label: '4', action: () => inputDigit('4') },
    { label: '5', action: () => inputDigit('5') },
    { label: '6', action: () => inputDigit('6') },
    { label: '-', action: () => handleOperator('-'), className: 'bg-accent hover:bg-accent/90 text-accent-foreground' },
    { label: '1', action: () => inputDigit('1') },
    { label: '2', action: () => inputDigit('2') },
    { label: '3', action: () => inputDigit('3') },
    { label: '+', action: () => handleOperator('+'), className: 'bg-accent hover:bg-accent/90 text-accent-foreground' },
    { label: '0', action: () => inputDigit('0'), className: 'col-span-2' },
    { label: '.', action: inputDecimal },
    { label: '=', action: handleEquals, className: 'bg-primary hover:bg-primary/90 text-primary-foreground' },
  ];

  return (
    <div className="space-y-4 p-4 bg-card-foreground/5 rounded-lg">
      <Input
        type="text"
        value={displayValue}
        readOnly
        className="h-16 text-4xl text-right font-mono bg-background border-2 border-input focus-visible:ring-primary"
        aria-label="Calculator display"
      />
      <div className="grid grid-cols-4 gap-2">
        {calculatorButtons.map((btn) => (
          <Button
            key={btn.label}
            onClick={btn.action}
            variant={btn.className?.includes('bg-destructive') || btn.className?.includes('bg-primary') || btn.className?.includes('bg-accent') ? 'default' : 'outline'}
            className={cn(
              "h-16 text-2xl active:scale-95 transition-transform",
              btn.className
            )}
            aria-label={btn.label === 'AC' ? 'All Clear' : `Button ${btn.label}`}
          >
            {btn.label}
          </Button>
        ))}
      </div>
    </div>
  );
}

// Note: The '%' operator is a placeholder and doesn't have full functionality here.
// Full percentage logic would require decisions on how it interacts (e.g., immediate operation or part of a chain).
