/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useFamilyReg } from "@/lib/useFamilyReg";

// import { Label } from "@/components/ui/label";
import { Users } from "lucide-react";
import { useQuery } from "@apollo/client";
import { GET_ALL_RAYONS, GET_RAYON_BY_ID } from "@/graphQL/Query/Query";
import { useToast } from "@/hooks/use-toast";

const schema = z.object({
  FamilyName: z.string().min(1, { message: "Family Name is required" }),
  rayonId: z.string(),
  kspId: z.string(),
  Address: z.string(),
});

type FamilyFormData = z.infer<typeof schema>;

const FamilyInputForm: React.FC = () => {
  const [selectedRayon, setSelectedRayon] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const {
    registerNewFamily: registerNewFamily,
    loading,
   
  } = useFamilyReg();

  const form = useForm<FamilyFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      FamilyName: "",
      rayonId: "",
      kspId: "",
      Address: "",
    },
  });

  const { data: rayonsData } = useQuery(GET_ALL_RAYONS);

  const { data: kspData } = useQuery(GET_RAYON_BY_ID, {
    variables: { queryGetKsPbyRayonIdId: selectedRayon },
    skip: !selectedRayon,
  });

  const { toast } = useToast();

  const onSubmit = async (data: FamilyFormData, e: any) => {
    try {
      e.preventDefault();
      setIsSubmitting(true);
      console.log("DATA YANG AKAN DIKIRIM", data);
      const results = await registerNewFamily({
        FamilyName: data.FamilyName,
        rayonId: data.rayonId,
        kspId: data.kspId,
        Address: data.Address,
      });

   
      if (results) {
        setIsSubmitting(false);

        toast({
          title: "Family added successfully",
          description: `${data.FamilyName} added successfully`,
          variant: "default"
        });

        form.reset();
      }
    } catch (error: any) {
      console.error("Ini error dalam  block catch:", {
        message: error.message,
        graphQLErrors: error.graphQLErrors,
        networkError: error.networkError,
        stack: error.stack,
      });

      const errorMessage =
        error?.graphQLErrors?.[0]?.message ||
        ` ${data.FamilyName} already exists`||
        "An unexpected error occurred";

      setErrorMessage(errorMessage);
      setIsAlertOpen(true);

      setIsSubmitting(false);
      form.reset();
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen font-bold text-2xl">
        Loading
      </div>
    );



  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl text-center">
          Family Information
        </CardTitle>
      </CardHeader>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="FamilyName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Family Name</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input {...field} placeholder="Enter family name" />
                      <Users
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                        size={18}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="rayonId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rayon</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value); // This sets the rayonId in form data
                      setSelectedRayon(value);
                      // Reset KSP selection when rayon changes
                      form.setValue("kspId", "");
                    }}
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Rayon" />
                    </SelectTrigger>
                    <SelectContent>
                      {rayonsData?.queryGetAllRayons.map((rayon: any) => (
                        <SelectItem key={rayon.id} value={rayon.id}>
                          Rayon {rayon.rayonNumber}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="kspId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>KSP</FormLabel>
                  <Select
                    onValueChange={field.onChange} // This sets the kspId in form data
                    defaultValue={field.value}
                    disabled={!selectedRayon}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select KSP" />
                    </SelectTrigger>
                    <SelectContent>
                      {kspData?.queryGetKSPbyRayonID[0]?.ksps.map(
                        (ksp: any) => (
                          <SelectItem key={ksp.id} value={ksp.id}>
                            {ksp.kspname}
                          </SelectItem>
                        )
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="Address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input {...field} placeholder="Enter address" />
                      <Users
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                        size={18}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting}
              onClick={form.handleSubmit(onSubmit)}
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </Button>
          </CardContent>
        </form>
      </Form>

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
    </Card>
  );
};

export default FamilyInputForm;
