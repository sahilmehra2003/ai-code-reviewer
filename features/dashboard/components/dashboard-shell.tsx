import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { TooltipProvider } from '@/components/ui/tooltip';
import { UserMenuUser } from '@/features/auth/components/user-menu';
import React from 'react'
import { DashboardSidebar } from './dashboard-sidebar';

type DashboardShellProps={
    children:React.ReactNode;
    user:UserMenuUser;
    plan?:string
}

const DashboardShell = ({
    children,
    user,
    plan
}:DashboardShellProps) => {
   return (
    <TooltipProvider>
      <SidebarProvider>
        <DashboardSidebar user={user} plan={plan} />
        <SidebarInset className="min-h-svh">{children}</SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
}

export default DashboardShell