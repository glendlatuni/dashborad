'use-client';

import { useMutation } from "@apollo/client";
import { useRouter } from 'next/navigation';

import { NEW_MEMBER_REGISTRATION } from "@/graphQL/Mutation/Mutation";



interface NewMemberRegProps{
    Email: string,
    Password: string,
    Member_Id: string,
    PhoneNumber: string
}



export function useNewMemberReg() {

    const router = useRouter();


    const [RegisterNewUser, { data, loading, error }] = useMutation(NEW_MEMBER_REGISTRATION);

    const registerNewUser = async (data: NewMemberRegProps) => {

        try {
const result = await RegisterNewUser({
            variables: {
                email : data.Email,
                password : data.Password,
                memberId : data.Member_Id,
                phoneNumber : data.PhoneNumber
            },
        })

        console.log("INI ADALAH",result)

        if(result?.data) {
            console.log("BERHASILLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLL")
            router.refresh();
            
        }

        }catch (error) {
console.log(error, "register error")

        }
    }

    return { registerNewUser, loading, error, data }

}