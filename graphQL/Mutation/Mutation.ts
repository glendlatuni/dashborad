import { gql } from "@apollo/client";


export const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(Email: $email, Password: $password) {
      token
      refreshToken
      user {
        Member {
          id
          FullName
          Category

        }
      }
    }
  }
`;



export const REGISTER_MUTATION_MEMBER = gql`
mutation CreateMember($data: CreateMemberInput!) {
  createMember(data: $data) {
    FullName
    Category
    Gender
    Family {
      FamilyName
    }
  }
}
`