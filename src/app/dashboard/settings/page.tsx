import { getBusinessProfile } from '@/app/actions/business-profile'
import DashboardLayout from '@/components/layout/dashboard-layout'
import BusinessProfileDisplay from '@/components/settings/business-profile-display'
import BusinessProfileForm from '@/components/settings/business-profile-form'

export default async function SettingsPage() {
  const profile = await getBusinessProfile()

  return (
    <DashboardLayout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Settings</h1>
          <p className="text-slate-600 mt-1">Manage your business profile</p>
        </div>

        {profile ? (
          <BusinessProfileDisplay profile={profile} />
        ) : (
          <BusinessProfileForm profile={null} />
        )}
      </div>
    </DashboardLayout>
  )
}