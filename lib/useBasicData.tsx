'use-client'


import { useMutation } from "@apollo/client";

import {BASIC_DATA} from "@/graphQL/Mutation/Mutation";


interface KSPInput {
    name: string;
  }
  
  interface RayonInput {
    number: number;
    ksps: KSPInput[];
  }
  
  interface ChurchInput {
    churchName: string;
    rayons: RayonInput[];
  }
  


  export function useBasicData() {
    const [createChurch, { loading, error, data }] = useMutation
 (BASIC_DATA);

    const registerChurch = async (churchData: ChurchInput) => {
      try {
        const result = await createChurch({
          variables: {
            input:{
                churchName: churchData.churchName,
                rayons : churchData.rayons.map((rayon) => ({
                  number: rayon.number,
                  ksps: rayon.ksps.map((ksp) => ({
                    name: ksp.name,
                  })),
                }))
            }
          },
        });
        return result.data?.createChurch;
      } catch (error) {
        throw error;
      }
    };

    return {
      registerChurch,
      loading,
      errors: error,
      data,
    };

  }