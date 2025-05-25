'use client';

import { useState } from 'react';
import { PageHeader } from '@/components/shared/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Lightbulb, Terminal, CheckCircle2, AlertCircle } from 'lucide-react';
import { handleGetFinancialTipsAction } from '@/lib/actions';
import { cn } from '@/lib/utils';

export default function FinancialTipsPage() {
  const [tips, setTips] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTips = async () => {
    setIsLoading(true);
    setError(null);
    setTips([]); // Clear previous tips
    const result = await handleGetFinancialTipsAction(null); // prevState and formData are not used here
    if (result.error) {
      setError(result.error);
    } else if (result.tips) {
      setTips(result.tips);
    }
    setIsLoading(false);
  };

  return (
    <>
      <PageHeader
        title="Financial Tips"
        description="Get helpful AI-powered suggestions to manage your finances better."
        icon={Lightbulb}
        imageUrl="https://placehold.co/300x200.png"
        imageHint="idea lightbulb"
      />
      <div className="mt-6">
        <Card className={cn(
          "shadow-lg transition-all duration-300 ease-in-out",
          "hover:scale-105 hover:shadow-xl hover:border-accent"
        )}>
          <CardHeader>
            <CardTitle>Smart Financial Suggestions</CardTitle>
            <CardDescription>
              Click the button below to get a few randomly generated financial tips.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={fetchTips} disabled={isLoading} className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground">
              {isLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-foreground mr-2"></div>
              ) : (
                <Lightbulb className="mr-2 h-5 w-5" />
              )}
              {isLoading ? 'Getting Tips...' : 'Get Financial Tips'}
            </Button>

            {error && (
              <Alert variant="destructive" className="mt-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {!isLoading && !error && tips.length === 0 && (
               <Alert className="mt-4 border-primary/50">
                <Terminal className="h-4 w-4" />
                <AlertTitle>Ready for Advice?</AlertTitle>
                <AlertDescription>
                  Click the button above to load some financial wisdom!
                </AlertDescription>
              </Alert>
            )}

            {tips.length > 0 && (
              <div className="mt-6 space-y-3">
                <h3 className="text-lg font-semibold text-foreground">Here are your tips:</h3>
                <ul className="list-none space-y-2">
                  {tips.map((tip, index) => (
                    <li key={index} className="flex items-start p-3 bg-secondary/50 rounded-md shadow-sm hover:bg-secondary transition-colors">
                      <CheckCircle2 className="h-5 w-5 text-primary mr-3 mt-1 shrink-0" />
                      <span className="text-foreground">{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
