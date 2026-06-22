import React from 'react'
import type { Metadata } from 'next'
import { requireAuth } from '@/features/auth/actions'
import { redirect } from 'next/navigation'
import { getInstallationStatus } from '@/features/github/server/installation'
import { DashboardHeader } from '@/features/dashboard/components/dashboard-header'
import { GithubConnectCard } from '@/features/github/components/github-connect-card'


export const metadata:Metadata={
    title:"Github App- Dashboard",
    description:"Install or disconnect the reviewer app on your Github Account"
}

const DashboardGithubPage = async() => {
    const session=await requireAuth();
    if (!session) {
        redirect("/sign-in")
    }
    const installation=await getInstallationStatus(session.user.id)
  return (
    <>
      <DashboardHeader
        title='Github App'
        description='Install or disconnect the reviewer app on your Github Account'
      />
      <GithubConnectCard userId={session.user.id} installation={installation}/>
    </>
  )
}

export default DashboardGithubPage