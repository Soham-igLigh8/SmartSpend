import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-neutral-100">
      <Card className="w-full max-w-md mx-4">
        <CardContent className="pt-6">
          <div className="flex items-center mb-4 gap-2">
            <AlertCircle className="h-8 w-8 text-[#FF5630]" />
            <h1 className="text-2xl font-bold text-[#172B4D]">404 Page Not Found</h1>
          </div>

          <p className="mb-6 text-gray-600">
            We couldn't find the page you were looking for. It might have been moved or deleted.
          </p>
          
          <div className="flex justify-center">
            <Link href="/">
              <Button className="bg-[#0052CC] hover:bg-[#0747A6]">
                Return to Dashboard
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
