"use client"
import { ModeToggle } from "@/components/ui/mode-toggle";
import { UserMenuWithSession } from "@/features/auth/components/user-menu";
import {authClient} from "@/lib/auth-client";

export default function Home() {
  const {data}=authClient.useSession()
  console.log("data: ",data);
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <UserMenuWithSession variant="compact"/>
      <ModeToggle/>
    </div>
  );
}
