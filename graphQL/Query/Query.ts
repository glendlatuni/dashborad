import { gql } from "@apollo/client";

export const GET_FAMILY_QUERY = gql`
  query QueryGetCurrentFamilyUser {
    queryGetCurrentFamilyUser {
      id
      FamilyName
      FamilyMembers {
        id
        FullName
        Gender
        BirthDate
        BirthPlace
        FamilyPosition
        Category

        Leaders
        Liturgos
      }
      Address
      KSP {
      id
      kspname
    }
    Rayon {
      id
      rayonNumber
      church {
        id
        name
      }
    }
    }
  }
`;

export const GET_ALL_FAMILY_QUERY = gql`
  query QueryGetFamily {
  queryGetFamily {
    Address
    id
    FamilyName
    KSP {
      id
      kspname
    }
    Rayon {
      id
      rayonNumber
      church {
        id
        name
      }
    }
  }
}
`;

export const GET_FAMILIES_FOR_REGISTRATION = gql`
  query QueryGetFamily {
    queryGetFamily {
      id
      FamilyName
    }
  }
`;

export const GET_FAMILIES_PAGINATION = gql`
  query GetFamilies($rayon: Int!, $page: Int!, $pageSize: Int!) {
    queryGetFamilyPagination(rayon: $rayon, page: $page, pageSize: $pageSize) {
      data {
        id
        # tambahkan field lainnya sesuai kebutuhan
        FamilyMembers {
          id
          FullName
          Category
          Gender
          IsLeaders
          BirthPlace
          BirthDate
        }
      }
      totalCount
      totalPages
    }
  }
`;


// get Fammily dari ID
export const GET_FAMILY_MEMBERS = gql`
query QueryGetFamilyByID($queryGetFamilyByIdId: ID!) {
  queryGetFamilyByID(id: $queryGetFamilyByIdId) {
    FamilyMembers {
      id
      FullName
      Gender
      Category
      FamilyPosition
      BirthDate
    }
  }
}
`

export const GET_MEMBER_BY_ID = gql`
query GetMemberByID($getMemberByIdId: ID!) {
  getMemberByID(id: $getMemberByIdId) {
    FullName
    Gender
    Leaders
    FamilyPosition
    Role
    Category
    BirthPlace
    BirthDate
    IsLeaders {
      Title
      onDuty
    }
    Schedule {
      id
      Day
      Date
      Category
      Month
      Time
      Years
    }
  }
}
`


export const GET_ALL_RAYONS = gql`
query QueryGetAllRayons {
  queryGetAllRayons {
    id
    rayonNumber
    ksps {
      kspname
    }
  }
}`


export const GET_RAYON_BY_ID = gql`
query QueryGetKSPbyRayonID($queryGetKsPbyRayonIdId: String!) {
  queryGetKSPbyRayonID(id: $queryGetKsPbyRayonIdId) {
    id
    rayonNumber
    church {
      name
    }
    ksps {
      id
      kspname
    }
    }
  }

`