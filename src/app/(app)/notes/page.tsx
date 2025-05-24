
"use client";

import { PageHeader } from "@/components/shared/page-header";
import { NotebookPen } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function NotesPage() {
  return (
    <>
      <PageHeader
        title="Notes"
        description="Jot down your thoughts and reminders."
        icon={NotebookPen}
        imageUrl="https://placehold.co/300x200.png"
        imageHint="notes abstract"
      />
      <div className="mt-6">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Notes Area</CardTitle>
            <CardDescription>This feature is currently under development. Check back soon!</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Imagine a space here where you can create, edit, and manage your personal notes related to your finances or anything else.
            </p>
            {/* Placeholder for future notes UI */}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
