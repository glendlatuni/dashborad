'use-client'


import { useMutation } from "@apollo/client";

import { CREATE_NEW_FAMILY } from "@/graphQL/Mutation/Mutation";

interface FamilyRegistrationProps {
    FamilyName: string;
    rayonId : string;
    kspId: string ;
    Address: string;
}

export const useFamilyReg = () => {
    const [createFamily, { loading, error }] = useMutation(CREATE_NEW_FAMILY);

    const registerNewFamily = async (data: FamilyRegistrationProps) => {
        try {
            const result = await createFamily({
                variables: {
                    data:{
                        FamilyName: data.FamilyName,
                        rayonId: data.rayonId,
                        kspId: data.kspId,
                        Address: data.Address
                    }
                  
                }
            })

            return result

        } catch (error) {
      
         
            throw error; 
        }
    }
return{ registerNewFamily, loading, errors: error }
}