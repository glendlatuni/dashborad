"use-client";

import { useMutation } from "@apollo/client";
// import { useRouter } from "next/navigation";
import { REGISTER_MUTATION_MEMBER } from "@/graphQL/Mutation/Mutation";

interface MemberRegistrationProps {
  FullName: string;
  Gender: string;
  BirthDate: string;
  BirthPlace: string | undefined;
  FamilyPosition?: string;
  MarriageStatus: string;
  Category: string;
  Family_id: string;
  Leaders: boolean;
  Liturgos: boolean;
}

export function useMemberRegistration() {
  //   const router = useRouter();

  const [createMember, { loading, error }] = useMutation(
    REGISTER_MUTATION_MEMBER
  );

  const register = async (data: MemberRegistrationProps) => {
    try {
      const result = await createMember({
        variables: {
          data: {
            FullName: data.FullName,
            Gender: data.Gender,
            BirthDate: data.BirthDate,
            BirthPlace: data.BirthPlace,
            MarriageStatus: data.MarriageStatus,
            FamilyPosition: data.FamilyPosition,
            Category: data.Category,
            Family_id: data.Family_id,
            Leaders: data.Leaders,
            Liturgos: data.Liturgos,
          },
        },
      });

      console.log(result);

      return result;
    } catch (error) {
      throw error; 
    }
  };

  return { register, loading, error };
}
