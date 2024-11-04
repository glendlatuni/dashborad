"use client";

import { useMutation } from "@apollo/client";

import { UPDATE_MEMBER_MUTATION } from "@/graphQL/Mutation/Mutation";

type  MemberUpdateProps = {
  FullName: string;
  Gender: "Laki-Laki" | "Perempuan";
  BirthDate: string | Date | null;
  BirthPlace: string;
  FamilyPosition: "Ayah" | "Ibu" | "Anak" | undefined;
  Category: "PKB" | "PW" | "PAM" | "PAR";
  Family_id: string;
  Leaders: boolean;
  Liturgos: boolean;
}

export function UseMemberUpdate() {


  const [updateMember, { loading, error }] = useMutation(
    UPDATE_MEMBER_MUTATION
  );

  const updateData = async ( memberId: string, data: MemberUpdateProps) => {
    console.log("TESSSSSSSSSSSSSSSSSSSSSSSSSSSSSSss", memberId, data);

    try {
      const result = await updateMember({
      variables: {
        updateMemberId: memberId,
        data : data,
      },
    });
    console.log("TESSSSSSSSSSSSSSSSSSSSSSSSSSSSSSss", result);
    return result.data.updateMember;
 
    } catch (error) {
      console.log(error, "register error");
    }
    
  };
  return {
    updateData,
    loading,
    error,
  };
}
