import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FcGoogle } from "react-icons/fc";
import Link from "next/link";

export default function SignupPage() {
  return (
    <div className="flex items-center relative justify-center min-h-screen">
      <Card className="w-full max-w-md p-6 bg-white shadow-lg rounded-2xl">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">
            Sign Up
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <Input
              type="text"
              placeholder="Full Name"
              className="w-full"
              required
            />
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
            <Input
              type="password"
              placeholder="Re-enter Password"
              className="w-full"
              required
            />
            <Link href=" /Login">
              <Button
                className="w-full mt-4 bg-red-950 hover:bg-red-700"
                type="submit"
              >
                Sign Up
              </Button>
            </Link>
          </form>
          <div className="mt-4 text-center">
            <p className="text-gray-500">or</p>
            <Button
              className="w-full flex items-center justify-center gap-2 mt-2"
              variant="outline"
            >
              <FcGoogle size={20} /> Sign up with Google
            </Button>
          </div>
          <div className="mt-4 text-center">
            <p className="text-gray-600">
              Already have an account?{" "}
              <Link
                href=" /Login"
                className="text-blue-600 hover:underline"
              >
                Login
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
