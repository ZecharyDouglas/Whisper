import { gql } from "@apollo/client";

export const CREATE_ACCOUNT = gql`
  mutation CreateUser(
    $name: String!
    $email: String!
    $password: String!
    $phonenumber: String!
  ) {
    createUser(
      name: $name
      email: $email
      password: $password
      phonenumber: $phonenumber
    ) {
      id
      email
      username
    }
  }
`;

export const USERS = gql`
  query {
    getUsers
  }
`;

export const LOGIN = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        id
        email
        username
      }
    }
  }
`;

export const GETUSERFRIENDS = gql`
  query CurrentUserFriends($user_id: String!) {
    currentUserFriends(user_id: $user_id) {
      id
      username
      relationship_id
    }
  }
`;

export const SENDMESSAGE = gql`
  mutation SendMessage(
    $user_id: String!
    $relationship_id: String!
    $message: String!
  ) {
    sendMessage(
      user_id: $user_id
      relationship_id: $relationship_id
      message: $message
    )
  }
`;
