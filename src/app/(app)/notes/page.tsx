
"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { NotebookPen, Save } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useDataStore } from "@/hooks/use-data-store";
import { useAuth } from "@/context/auth-context";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

export default function NotesPage() {
  const { notes: storedNotes, saveUserNotes, isLoading: isStoreLoading } = useDataStore();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [currentNotes, setCurrentNotes] = useState<string>("");
  const [isSaving, setIsSaving] = useState<boolean>(false);

  useEffect(() => {
    // Initialize local state with notes from the store when they are loaded
    if (storedNotes !== undefined) { // Check for undefined to avoid overwriting during initial load
      setCurrentNotes(storedNotes);
    }
  }, [storedNotes]);

  const handleSaveNotes = async () => {
    if (!user) {
      toast({ title: "Error", description: "You must be logged in to save notes.", variant: "destructive" });
      return;
    }
    setIsSaving(true);
    try {
      await saveUserNotes(user.uid, currentNotes);
      toast({ title: "Notes Saved", description: "Your notes have been successfully saved." });
    } catch (error: any) {
      toast({ title: "Save Failed", description: error.message || "Could not save notes. Please try again.", variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  // Show a loading indicator if the store is loading initial data (which includes notes)
  if (isStoreLoading && storedNotes === "") {
    return (
       <>
        <PageHeader
            title="Notes"
            description="Jot down your thoughts and reminders."
            icon={NotebookPen}
            imageUrl="https://cdn-icons-png.flaticon.com/512/3075/3075908.png"
            imageHint="pencil note"
        />
        <div className="mt-6 flex justify-center items-center h-64">
            <p className="text-muted-foreground animate-pulse">Loading your notes...</p>
        </div>
      </>
    );
  }


  return (
    <>
      <PageHeader
        title="Notes"
        description="Jot down your thoughts and reminders. Your notes are saved automatically to the cloud."
        icon={NotebookPen}
        imageUrl="https://cdn-icons-png.flaticon.com/512/3075/3075908.png"
        imageHint="pencil note"
      />
      <div className="mt-6">
        <Card className={cn(
          "shadow-lg transition-all duration-300 ease-in-out",
          "hover:scale-105 hover:shadow-xl hover:border-accent"
        )}>
          <CardHeader>
            <CardTitle>Your Personal Notes</CardTitle>
            <CardDescription>Type your notes below. They will be saved per user.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Start typing your notes here..."
              value={currentNotes}
              onChange={(e) => setCurrentNotes(e.target.value)}
              rows={10}
              className="resize-none text-base"
              disabled={isSaving}
            />
            <Button onClick={handleSaveNotes} disabled={isSaving || isStoreLoading} className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground">
              {isSaving ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-foreground mr-2"></div>
              ) : (
                <Save className="mr-2 h-5 w-5" />
              )}
              {isSaving ? "Saving..." : "Save Notes"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
