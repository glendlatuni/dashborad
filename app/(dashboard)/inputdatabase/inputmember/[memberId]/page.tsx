"use client";

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { UserIcon } from "lucide-react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
import { UseMemberUpdate } from "@/lib/useMemberUpdate";
import { useQuery } from "@apollo/client";
import {
  GET_FAMILIES_FOR_REGISTRATION,
  GET_MEMBER_BY_ID,
} from "@/graphQL/Query/Query";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useRouter } from "next/navigation";
import FormField from "@/lib/formField";

// Constants
const FAMILY_POSITIONS = ["Ayah", "Ibu", "Anak"] as const;
const CATEGORIES = ["PKB", "PW", "PAM", "PAR"] as const;

// Schema definition
const schema = z.object({
  FullName: z.string().min(1, "Full name is required"),
  Gender: z.enum(["Laki-Laki", "Perempuan"]),
  BirthDate: z.union([z.date(), z.string(), z.null()]),
  BirthPlace: z.string().min(1, "Birth place is required"),
  FamilyPosition: z.enum(FAMILY_POSITIONS),
  Category: z.enum(CATEGORIES),
  Family_id: z.string().min(1, "Family ID is required"),
  Leaders: z.boolean(),
  Liturgos: z.boolean(),
});

type MemberUpdate = z.infer<typeof schema>;

interface Family {
  id: string;
  FamilyName: string;
}

const EditForm = ({ params }: { params: { memberId: string } }) => {
  const router = useRouter();
  const { memberId } = params;
  const { updateData } = UseMemberUpdate();

  // State management
  const [families, setFamilies] = useState<Family[]>([]);
  const [birthDate, setBirthDate] = useState<Date | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form setup
  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<MemberUpdate>({
    resolver: zodResolver(schema),
    defaultValues: {
      Leaders: false,
      Liturgos: false,
    },
  });

  // Queries
  const { data: familiesData } = useQuery(GET_FAMILIES_FOR_REGISTRATION);
  const { data: memberData, loading: memberLoading } = useQuery(GET_MEMBER_BY_ID, {
    variables: { getMemberByIdId: memberId },
    skip: !memberId,
  });

  // Effects
  useEffect(() => {
    if (familiesData?.queryGetFamily) {
      setFamilies(familiesData.queryGetFamily);
    }
  }, [familiesData]);

  useEffect(() => {
    if (memberData?.getMemberByID) {
      const member = memberData.getMemberByID;
      const birthDate = member.BirthDate ? new Date(parseInt(member.BirthDate)) : null;

      // Update form values
      Object.entries(member).forEach(([key, value]) => {
        if (key === "BirthDate") {
          setBirthDate(birthDate);
          setValue(key, birthDate?.toDateString() ?? null);
        } else {
          setValue(key as keyof MemberUpdate, value);
        }
      });
    }
  }, [memberData, setValue]);

  // Form submission
  const onSubmit = async (data: MemberUpdate) => {
    setIsSubmitting(true);

    try {
      const updatedData = {
        ...data,
        BirthDate: data.BirthDate ? new Date(data.BirthDate).toISOString() : null,
      };

      await updateData(memberId, updatedData);
      alert("Member updated successfully");
      router.push(`/viewdata/${data.Family_id}`);
    } catch (error) {
      console.error("Update failed:", error);
      alert("Failed to update member. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (memberLoading) return <div>Loading...</div>;

  // Render form
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">
          Edit Member Form
        </CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          {/* Basic Information Fields */}
          <FormField
            label="Full Name"
            error={errors.FullName?.message}
            icon={<UserIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />}
          >
            <Input
              {...register("FullName")}
              placeholder="Enter your full name"
            />
          </FormField>

          {/* Gender Selection */}
          <FormField label="Gender" error={errors.Gender?.message}>
            <RadioGroup>
              {["Laki-Laki", "Perempuan"].map((gender) => (
                <div key={gender} className="flex items-center space-x-2">
                  <RadioGroupItem
                    value={gender}
                    id={gender}
                    {...register("Gender")}
                  />
                  <Label htmlFor={gender}>{gender}</Label>
                </div>
              ))}
            </RadioGroup>
          </FormField>

          {/* Date Picker */}
          <FormField label="Birth Date">
            <DatePicker
              selected={birthDate}
              onChange={(date: Date | null) => {
                setBirthDate(date);
                setValue("BirthDate", date ? date.getTime().toString() : null);
              }}
              showYearDropdown
              scrollableYearDropdown
              yearDropdownItemNumber={100}
              dateFormat="dd/MM/yyyy"
              placeholderText="Select birth date"
              className="w-full p-2 border rounded"
            />
          </FormField>

          {/* Additional form fields... */}
          {/* Note: Similar pattern for remaining fields */}

          <Button
            type="submit"
            className="w-full mt-4"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </Button>
        </CardContent>
      </form>
    </Card>
  );
};



export default EditForm