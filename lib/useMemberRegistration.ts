'use-client';

import { useMutation } from "@apollo/client";
import { useRouter } from "next/navigation";
import { REGISTER_MUTATION_MEMBER } from "@/graphQL/Mutation/Mutation";

interface MemberRegistrationProps {
    FullName: string;
    Gender: string;
    BirthDate: string;
    BirthPlace: string | undefined;
    FamilyPosition?: string;
    Category: string;
    Family_id: string;
    Leaders: boolean;
    Liturgos: boolean;
}


export function useMemberRegistration()  {

  const router = useRouter();

  const [createMember, {loading, error}] = useMutation(REGISTER_MUTATION_MEMBER);


  const register = async (data: MemberRegistrationProps) => {
 
   

    try {


        const result = await createMember({
            variables: {
                data
            }
        })

        console.log("TESSSSSSSSSSSSSSSSSSSSSSSSSSSSSSss",result)

        router.push('/')
    } catch (error) {

        console.log(error, "register error")
        
    }

}

return {register, loading, error}

}
