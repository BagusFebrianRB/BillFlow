"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  upsertBusinessProfile,
  uploadLogo,
} from "@/app/actions/business-profile";
import { toast } from "sonner";
import { Loader2, Upload, Building2 } from "lucide-react";
import Image from "next/image";

interface BusinessProfile {
  business_name: string;
  logo_url?: string | null;
  address?: string | null;
  phone?: string | null;
  tax_id?: string | null;
  currency?: string | null;
  default_tax_rate?: number | null;
}

interface BusinessProfileFormProps {
  profile: BusinessProfile | null;
  onCancel?: () => void;
}

export default function BusinessProfileForm({
  profile,
  onCancel,
}: BusinessProfileFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [logoPreview, setLogoPreview] = useState(profile?.logo_url || "");

  const [formData, setFormData] = useState({
    business_name: profile?.business_name || "",
    address: profile?.address || "",
    phone: profile?.phone || "",
    tax_id: profile?.tax_id || "",
    currency: profile?.currency || "USD",
    default_tax_rate: profile?.default_tax_rate || 0,
  });

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      // 2MB
      toast.error("Image must be less than 2MB");
      return;
    }

    setIsUploadingLogo(true);

    try {
      // Preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Upload
      await uploadLogo(file);
      toast.success("Logo uploaded successfully");
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("Failed to upload logo");
      setLogoPreview(profile?.logo_url || "");
    } finally {
      setIsUploadingLogo(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await upsertBusinessProfile(formData);
      toast.success("Business profile updated successfully");
      router.refresh();
      onCancel?.()
    } catch (error) {
      console.error(error);
      toast.error("Failed to update profile");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl space-y-6">
      {/* Logo Upload */}
      <Card>
        <CardHeader>
          <CardTitle>Business Logo</CardTitle>
          <CardDescription>
            Upload your business logo. This will appear on invoices and PDFs.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-6">
            {/* Logo Preview */}
            <div className="flex h-24 w-24 items-center justify-center rounded-lg border-2 border-dashed border-slate-300 bg-slate-50">
              {logoPreview ? (
                <Image
                  src={logoPreview}
                  alt="Business logo"
                  width={96}
                  height={96}
                  className="h-full w-full rounded-lg object-contain p-2"
                />
              ) : (
                <Building2 className="h-8 w-8 text-slate-400" />
              )}
            </div>

            {/* Upload Button */}
            <div>
              <input
                type="file"
                id="logo-upload"
                accept="image/*"
                onChange={handleLogoUpload}
                disabled={isUploadingLogo}
                className="hidden"
              />
              <label htmlFor="logo-upload">
                <Button
                  type="button"
                  variant="outline"
                  disabled={isUploadingLogo}
                  onClick={() =>
                    document.getElementById("logo-upload")?.click()
                  }
                  asChild
                >
                  <span>
                    {isUploadingLogo ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="mr-2 h-4 w-4" />
                        Upload Logo
                      </>
                    )}
                  </span>
                </Button>
              </label>
              <p className="text-xs text-slate-500 mt-2">
                PNG, JPG or GIF (max. 2MB)
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Business Info */}
      <Card>
        <CardHeader>
          <CardTitle>Business Information</CardTitle>
          <CardDescription>
            This information will appear on your invoices
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="business_name">Business Name *</Label>
              <Input
                id="business_name"
                value={formData.business_name}
                onChange={(e) =>
                  setFormData({ ...formData, business_name: e.target.value })
                }
                required
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
                rows={3}
                disabled={isSubmitting}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  disabled={isSubmitting}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tax_id">Tax ID / Business Number</Label>
                <Input
                  id="tax_id"
                  value={formData.tax_id}
                  onChange={(e) =>
                    setFormData({ ...formData, tax_id: e.target.value })
                  }
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="currency">Default Currency</Label>
                <Select
                  value={formData.currency}
                  onValueChange={(value) =>
                    setFormData({ ...formData, currency: value })
                  }
                  disabled={isSubmitting}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">$ USD - US Dollar</SelectItem>
                    <SelectItem value="IDR">
                      Rp IDR - Indonesian Rupiah
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="default_tax_rate">Default Tax Rate (%)</Label>
                <Input
                  id="default_tax_rate"
                  type="number"
                  min="0"
                  max="100"
                  step="0.01"
                  value={formData.default_tax_rate || 0}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      default_tax_rate: e.target.value
                        ? parseFloat(e.target.value)
                        : 0,
                    })
                  }
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-teal-500 hover:bg-teal-600"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
               {onCancel && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onCancel}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
