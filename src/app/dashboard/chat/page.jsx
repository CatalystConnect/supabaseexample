"use client";
import ChatLayout from "@/components/chat/ChatLayout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { supabaseBrowser } from "@/lib/supabase/browser";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
export default function Page() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const logout = async () => {
    const supabase = supabaseBrowser();
    await supabase.auth.signOut();
    router.replace("/");
  };
  useEffect(() => {
    const loadUser = async () => {
      const supabase = supabaseBrowser();
      const { data, error } = await supabase.auth.getUser();

      if (error || !data?.user) {
        router.replace("/");
        return;
      }

      setUser(data.user);
    };

    loadUser();
  }, [router]);
  return (
    <>
      <Card className="rounded-2xl shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle className="text-2xl">
                Dashboard
                <Button onClick={() => router.replace("/dashboard")} className='ml-4 cursor-pointer'>
                  Country
                </Button>
              </CardTitle>
              <CardDescription className="mt-1">
                Signed in as{" "}
                <span className="font-medium text-foreground">
                  {user?.email || "—"}
                </span>
              </CardDescription>
            </div>

            <Button
              variant="destructive"
              className="cursor-pointer"
              onClick={logout}
            >
              Logout
            </Button>
          </div>
        </CardHeader>
      </Card>
      <ChatLayout />
    </>
  );
}
