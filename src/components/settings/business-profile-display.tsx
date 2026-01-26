'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Edit, Building2 } from 'lucide-react'
import Image from 'next/image'
import BusinessProfileForm from './business-profile-form'

interface BusinessProfile {
  business_name: string
  logo_url?: string | null
  address?: string | null
  phone?: string | null
  tax_id?: string | null
  currency?: string | null
  default_tax_rate?: number | null
}

export default function BusinessProfileDisplay({ profile }: { profile: BusinessProfile }) {
  const [isEditing, setIsEditing] = useState(false)

  if (isEditing) {
    return <BusinessProfileForm profile={profile} onCancel={() => setIsEditing(false)} />
  }

  return (
    <div className="max-w-2xl">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Business Profile</CardTitle>
            <CardDescription>Your business information</CardDescription>
          </div>
          <Button onClick={() => setIsEditing(true)} variant="outline">
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Logo */}
          <div>
            <p className="text-sm font-medium text-slate-700 mb-2">Logo</p>
            <div className="flex h-24 w-24 items-center justify-center rounded-lg border bg-slate-50">
              {profile.logo_url ? (
                <Image
                  src={profile.logo_url}
                  alt="Business logo"
                  width={96}
                  height={96}
                  className="h-full w-full rounded-lg object-contain p-2"
                />
              ) : (
                <Building2 className="h-8 w-8 text-slate-400" />
              )}
            </div>
          </div>

          {/* Business Name */}
          <div>
            <p className="text-sm font-medium text-slate-700">Business Name</p>
            <p className="text-base text-slate-900 mt-1">{profile.business_name}</p>
          </div>

          {/* Address */}
          {profile.address && (
            <div>
              <p className="text-sm font-medium text-slate-700">Address</p>
              <p className="text-base text-slate-900 mt-1 whitespace-pre-wrap">{profile.address}</p>
            </div>
          )}

          <div className="grid gap-6 md:grid-cols-2">
            {/* Phone */}
            {profile.phone && (
              <div>
                <p className="text-sm font-medium text-slate-700">Phone</p>
                <p className="text-base text-slate-900 mt-1">{profile.phone}</p>
              </div>
            )}

            {/* Tax ID */}
            {profile.tax_id && (
              <div>
                <p className="text-sm font-medium text-slate-700">Tax ID</p>
                <p className="text-base text-slate-900 mt-1">{profile.tax_id}</p>
              </div>
            )}

            {/* Currency */}
            <div>
              <p className="text-sm font-medium text-slate-700">Default Currency</p>
              <p className="text-base text-slate-900 mt-1">{profile.currency || 'USD'}</p>
            </div>

            {/* Tax Rate */}
            <div>
              <p className="text-sm font-medium text-slate-700">Default Tax Rate</p>
              <p className="text-base text-slate-900 mt-1">{profile.default_tax_rate || 0}%</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}