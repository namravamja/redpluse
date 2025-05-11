import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-[#D9D9D9]">
      <Card className="w-full max-w-sm p-10 bg-white shadow-lg rounded-2xl">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold mb-4">
            Admin Login
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <Input
              type="email"
              placeholder="Email"
              className="w-full"
              required
            />
            <Input
              type="password"
              placeholder="Password"
              className="w-full"
              required
            />
            <Link href="/frontend/Admin">
              <Button
                className="mt-8 w-full bg-red-950 hover:bg-red-700"
                type="submit"
              >
                Login
              </Button>
            </Link>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
