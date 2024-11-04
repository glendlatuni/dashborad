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

export const UPDATE_MEMBER_MUTATION = gql`
mutation UpdateMember($updateMemberId: ID!, $data: updateMemberInput!) {
  updateMember(id: $updateMemberId, data: $data) {

    FullName
    FamilyPosition
    BirthPlace
    BirthDate
    id
    Gender
    Leaders
    Liturgos
    Category
  }
}`


export const CREATE_NEW_FAMILY = gql`
mutation CreateFamily($data: FamilyInput!) {
  createFamily(data: $data) {
    FamilyName
    KSP {
      kspname
    }
    Rayon {
      rayonNumber
    }
  }
}
`

export const NEW_MEMBER_REGISTRATION = gql`
mutation RegisterNewUser($email: String!, $password: String!, $memberId: String!, $phoneNumber: String!) {
  registerNewUser(Email: $email, Password: $password, Member_Id: $memberId, PhoneNumber: $phoneNumber) {
    refreshToken
    token

  }
}
`


export const BASIC_DATA = gql`
mutation CreateBasicData($input: ChurchInput!) {
  createBasicData(input: $input) {
    name
    
  }
}`