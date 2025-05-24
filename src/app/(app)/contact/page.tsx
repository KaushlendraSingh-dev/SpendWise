
"use client";

import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, MapPin } from "lucide-react";

export default function ContactPage() {
  return (
    <>
      <PageHeader
        title="Contact Us"
        description="Get in touch with the developer."
        icon={Mail}
        imageUrl="https://placehold.co/300x200.png"
        imageHint="contact mail"
      />
      <div className="mt-6">
        <Card className="shadow-lg hover:border-accent transition-colors duration-300 ease-in-out">
          <CardHeader>
            <CardTitle>Developer Information</CardTitle>
            <CardDescription>Details for Kaushlendra Singh.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-foreground flex items-center">
                <MapPin className="mr-2 h-5 w-5 text-primary" />
                Address
              </h3>
              <p className="text-muted-foreground ml-7">N.P.A Colony</p>
              <p className="text-muted-foreground ml-7">Shivrampally</p>
              <p className="text-muted-foreground ml-7">Hyderabad, Telangana</p>
              <p className="text-muted-foreground ml-7">India</p>
            </div>
             <div>
              <h3 className="text-lg font-semibold text-foreground flex items-center">
                <Mail className="mr-2 h-5 w-5 text-primary" />
                Get in Touch
              </h3>
              <p className="text-muted-foreground ml-7">
                For any inquiries or feedback, please feel free to reach out.
              </p>
              {/* You can add an email link or form here in the future */}
              {/* <a href="mailto:kaushlendra.singh@example.com" className="text-primary hover:underline ml-7">
                kaushlendra.singh@example.com
              </a> */}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
