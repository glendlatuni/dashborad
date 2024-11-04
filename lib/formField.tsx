import React from 'react'
import { Label } from "@/components/ui/label";

const FormField = ({
    label,
    error,
    children,
    icon
  }: {
    label: string;
    error?: string;
    children: React.ReactNode;
    icon?: React.ReactNode;
  }) => (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="relative">
        {children}
        {icon}
      </div>
      {error && <span className="text-red-500">{error}</span>}
    </div>
  );

  export default FormField