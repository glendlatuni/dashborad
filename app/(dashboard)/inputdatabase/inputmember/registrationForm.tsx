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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useMemberRegistration } from "@/lib/useMemberRegistration";
import { useQuery } from "@apollo/client";
import { GET_FAMILIES_FOR_REGISTRATION } from "@/graphQL/Query/Query";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import router from "next/router";
import { useToast } from "@/hooks/use-toast";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const schema = z.object({
  FullName: z.string().min(1, "Full name is required"),
  Gender: z.enum(["Laki-Laki", "Perempuan"]),
  BirthDate: z.date(),
  BirthPlace: z.string().min(1, "Birth place is required"),
  MarriageStatus: z.enum(["kawin", "belum kawin"]),
  FamilyPosition: z.enum(["ayah", "ibu", "anak"]),
  Category: z.enum(["pkb", "pw", "pam", "par"]),
  Family_id: z.string().min(1, "Family ID is required"),
  Leaders: z.boolean(),
  Liturgos: z.boolean(),
});

type MemberRegistrationProps = z.infer<typeof schema>;

const RegisterMemberForm: React.FC = () => {
 
  const [families, setFamilies] = useState<
    { id: string; FamilyName: string }[]
  >([]);

  const [familyPosition, setFamilyPosition] = useState<string>("");

  const [marriageStatus, setMarriageStatus] = useState<string>("");
  const [category, setCategory] = useState<string>("");

  const [birthDate, setBirthDate] = useState<Date | undefined>(undefined);

  const { register: registerMember } = useMemberRegistration();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [selectedFamilyId, setSelectedFamilyId] = useState<string | undefined>(
    undefined
  );
  const {
    register,
    setValue,
    handleSubmit,
    reset,
    formState: { errors },
    watch,
  } = useForm<MemberRegistrationProps>({
    resolver: zodResolver(schema),
    defaultValues: {
      Leaders: false,
      Liturgos: false,
    },
  });

  const { toast } = useToast();

  const { loading, error, data } = useQuery(GET_FAMILIES_FOR_REGISTRATION);

  useEffect(() => {
    if (data && data.queryGetFamily) {
    

  
     
      setFamilies(data.queryGetFamily);
    }

    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    }
  }, [data]);

  const leadersValue = watch("Leaders");
  const liturgosValue = watch("Liturgos");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmit = async (data: MemberRegistrationProps, e: any) => {

    try {
      e.preventDefault();
      setIsSubmitting(true);
      console.log('Starting submission...');
    console.log('Form data:', data);
    const formattedBirthDate = data.BirthDate.toISOString();

    const result = await registerMember({ ...data, BirthDate: formattedBirthDate });

    if (result) {
      setIsSubmitting(false);

      toast({
        title: "Member added successfully",
        description: `${data.FullName} added successfully`,
        variant: "default"
      });

      reset();

      setBirthDate(undefined);
      setFamilyPosition("");
      setMarriageStatus("");
      setCategory("");
      setSelectedFamilyId(undefined);


    }
    
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error : any) {
    console.error("Ini error dalam  block catch:", {
      message: error.message,
      graphQLErrors: error.graphQLErrors,
      networkError: error.networkError,
      stack: error.stack,
    });


    const errorMessage =
        error?.graphQLErrors?.[0]?.message ||
        ` ${data.FullName} already exists`||
        "An unexpected error occurred";

      setErrorMessage(errorMessage);
      setIsAlertOpen(true);

      setIsSubmitting(false);
  


    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">
          Registration Form
        </CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="FullName">Full Name</Label>
            <div className="relative">
              <Input
                id="FullName"
                {...register("FullName")}
                placeholder="Enter your full name"
              />
              <UserIcon
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={18}
              />
            </div>
            {errors.FullName && (
              <span className="text-red-500">{errors.FullName.message}</span>
            )}
          </div>

          <div className="space-y-2">
            <Label>Gender</Label>
            <RadioGroup>
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  value="Laki-Laki"
                  id="Laki-Laki"
                  {...register("Gender")}
                />
                <Label htmlFor="Laki-Laki">Laki-laki</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  value="Perempuan"
                  id="Perempuan"
                  {...register("Gender")}
                />
                <Label htmlFor="Perempuan">Perempuan</Label>
              </div>
            </RadioGroup>
            {errors.Gender && (
              <span className="text-red-500">{errors.Gender.message}</span>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="MarriageStatus">Marriage Status</Label>
            <Select
              value={marriageStatus}
              onValueChange={(value) => {
                setMarriageStatus(value);
                setValue("MarriageStatus", value as "kawin"| "belum kawin", {
                  shouldValidate: true,
                });
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select your marriage status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="kawin">Kawin</SelectItem>
                <SelectItem value="belum kawin">Belum Kawin</SelectItem>
              </SelectContent>
            </Select>
            {errors.MarriageStatus && (
              <span className="text-red-500">
                {errors.MarriageStatus.message}
              </span>
            )}
          </div>

          <div className="space-y-2 ">
            <Label htmlFor="birthDate" className="mr-2">
              Birth Date:{" "}
            </Label>
            <DatePicker
              selected={birthDate}
              onChange={(date) =>{ 
                setBirthDate(date || undefined);
                setValue('BirthDate', date as Date);
              }}
              showYearDropdown
              scrollableYearDropdown
              yearDropdownItemNumber={100}
              dateFormat="dd/MM/yyyy"
              placeholderText="Select birth date"
              className="w-full p-2 border rounded"
            />
          </div>
          {errors.BirthDate && (
            <span className="text-red-500">{errors.BirthDate.message}</span>
          )}
          <div className="space-y-2">
            <Label htmlFor="FullName">Birth Place</Label>
            <div className="relative">
              <Input
                id="BirthPlace"
                {...register("BirthPlace")}
                placeholder="Enter Birth Place"
              />
              <UserIcon
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={18}
              />
            </div>
            {errors.BirthPlace && (
              <span className="text-red-500">{errors.BirthPlace.message}</span>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="FamilyPosition">Family Position</Label>
            <Select
              value={familyPosition}
              onValueChange={(value) => {
                setFamilyPosition(value);
                setValue("FamilyPosition", value as "ayah" | "ibu" | "anak", {
                  shouldValidate: true,
                });
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select family position" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ayah">Ayah</SelectItem>
                <SelectItem value="ibu">Ibu</SelectItem>
                <SelectItem value="anak">Anak</SelectItem>
              </SelectContent>
            </Select>
            {errors.FamilyPosition && (
              <span className="text-red-500">
                {errors.FamilyPosition.message}
              </span>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="Category">Category</Label>
            <Select
              value={category}
              onValueChange={(value) => {
                setCategory(value);
                setValue("Category", value as "pkb" | "pam" | "pw" | "par", {
                  shouldValidate: true,
                });
              }}
            >
              {/* "pkb", "pw", "pam", "par" */}
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pkb">PKB</SelectItem>
                <SelectItem value="pw">PW</SelectItem>
                <SelectItem value="pam">PAM</SelectItem>
                <SelectItem value="par">PAR</SelectItem>
              </SelectContent>
            </Select>
            {errors.Category && (
              <span className="text-red-500">{errors.Category.message}</span>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="Family_id">Family Name</Label>
            <Select
              value={selectedFamilyId}
              onValueChange={(value) => {
                setSelectedFamilyId(value);
                setValue("Family_id", value);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a family" />
              </SelectTrigger>
              <SelectContent>
                {loading && <div>Loading...</div>}
                {error && <div>Error loading families</div>}
                {!loading &&
                  !error &&
                  families.map((family) => (
                    <SelectItem key={family.id} value={family.id}>
                      {family.FamilyName}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
            {errors.Family_id && (
              <span className="text-red-500">{errors.Family_id.message}</span>
            )}
          </div>

          <div className="space-y-2">
            <Label>Leaders</Label>
            <RadioGroup
              value={leadersValue ? "majelis" : "non-majelis"}
              onValueChange={(value) => {
                setValue("Leaders", value === "majelis", {
                  shouldValidate: true,
                });
              }}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="majelis" id="majelis" />
                <Label htmlFor="majelis">Majelis</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="non-majelis" id="non-majelis" />
                <Label htmlFor="non-majelis">Non-Majelis</Label>
              </div>
            </RadioGroup>
            {errors.Leaders && (
              <span className="text-red-500">{errors.Leaders.message}</span>
            )}
          </div>

          <div className="space-y-2">
            <Label>Liturgos</Label>
            <RadioGroup
              value={liturgosValue ? "liturgos" : "non-liturgos"}
              onValueChange={(value) => {
                setValue("Liturgos", value === "liturgos", {
                  shouldValidate: true,
                });
              }}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="liturgos" id="liturgos" />
                <Label htmlFor="liturgos">Liturgos</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="non-liturgos" id="non-liturgos" />
                <Label htmlFor="non-liturgos">Non-Liturgos</Label>
              </div>
            </RadioGroup>
            {errors.Liturgos && (
              <span className="text-red-500">{errors.Liturgos.message}</span>
            )}
          </div>

          <Button 
          type="submit" 
          className="w-full mt-4"
          disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </Button>
        </CardContent>

        <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Alert!!!!</AlertDialogTitle>
            <AlertDialogDescription>{errorMessage}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setIsAlertOpen(false)}>
              Close
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>


      </form>

     

    </Card>
  );
};

export default RegisterMemberForm;
