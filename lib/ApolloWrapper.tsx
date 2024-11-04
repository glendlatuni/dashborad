"use client";

import {
  ApolloClient,
  ApolloProvider,
  createHttpLink,
  InMemoryCache,
  from,
  FetchResult,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";
import { Observable } from "@apollo/client/utilities";

import { gql } from "@apollo/client";

const REFRESH_TOKEN_MUTATION = gql`
  mutation RefreshAccessToken($refreshToken: String!) {
    refreshAccessToken(refreshToken: $refreshToken) {
      accessToken
    }
  }
`;

const httpLink = createHttpLink({
  uri: "http://localhost:4000/graphql",
  credentials: "include",
});

let isRefreshing = false;
type PendingRequest = () => void;
let pendingRequests: PendingRequest[] = [];

const resolvePendingRequests = () => {
  pendingRequests.forEach((callback) => callback());
  pendingRequests = [];
};

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem("token");
  // console.log("Token from localStorage:", token)
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const errorLink = onError(
  ({ graphQLErrors, networkError, operation, forward }) => {
    if (graphQLErrors) {
      console.log(`[GraphQL error]: ${graphQLErrors}`);
      for (const err of graphQLErrors) {
        if (err.message.includes("Family already exists")) {
          // Error akan di-throw dan ditangkap di catch block komponen
          throw new Error("Family already exists");
        }

        // if (
        //   err.message.includes("expired refresh token") ||
        //   err.extensions?.code === "INTERNAL_SERVER_ERROR" || err.message.includes("Invalid refresh token")
        // ) {
        //   console.log("expired refresh token atau invalid refresh token");
        //   localStorage.removeItem("token");
        //   localStorage.removeItem("refreshToken");
        //   window.location.href = "/login";
        //   return;
        // }

        if (
          err.extensions?.code === "Unauthorized" ||
          err.message.includes(
            "Zone filter requires authentication. Not authenticated"
          )
        ) {
          console.log("SEPERTINYA DATA YANG TERBACA ADALAH UNAUTHORIZED");
          console.log(err.message);
          console.log("Path", err.path);

          if (!isRefreshing) {
            isRefreshing = true;

            return new Observable<FetchResult>((observer) => {
              refreshToken()
                .then(({ accessToken }) => {
                  localStorage.setItem("token", accessToken);
                  const oldHeaders = operation.getContext().headers;
                  operation.setContext({
                    headers: {
                      ...oldHeaders,
                      authorization: `Bearer ${accessToken}`,
                    },
                  });

                  resolvePendingRequests();
                  const subscriber = {
                    next: observer.next.bind(observer),
                    error: observer.error.bind(observer),
                    complete: observer.complete.bind(observer),
                  };
                  forward(operation).subscribe(subscriber);
                })
                .catch((error) => {
                  pendingRequests = [];
                  console.log("-------------------",error);
                  localStorage.removeItem("token");
                  localStorage.removeItem("refreshToken");
                  window.location.href = "/login";
                  observer.error(error);
                })
                .finally(() => {
                  isRefreshing = false;
                });
            });
          } else {
            return new Observable<FetchResult>((observer) => {
              pendingRequests.push(() => {
                forward(operation).subscribe({
                  next: observer.next.bind(observer),
                  error: observer.error.bind(observer),
                  complete: observer.complete.bind(observer),
                });
              });
            });
          }
        }
      }
    }

    if (networkError) {
      console.log(`[Network error]: ${networkError}`);
      return new Observable<FetchResult>((observer) => {
        refreshToken()
          .then(({ accessToken }) => {
            localStorage.setItem("token", accessToken);
            const oldHeaders = operation.getContext().headers;
            operation.setContext({
              headers: {
                ...oldHeaders,
                authorization: `Bearer ${accessToken}`,
              },
            });

            resolvePendingRequests();
            const subscriber = {
              next: observer.next.bind(observer),
              error: observer.error.bind(observer),
              complete: observer.complete.bind(observer),
            };
            forward(operation).subscribe(subscriber);
          })
          .catch((error) => {
            pendingRequests = [];
            localStorage.removeItem("token");
            localStorage.removeItem("refreshToken");
            window.location.href = "/login";
            observer.error(error);
          })
          .finally(() => {
            isRefreshing = false;
          });
      });
    } else {
      return new Observable<FetchResult>((observer) => {
        pendingRequests.push(() => {
          forward(operation).subscribe({
            next: observer.next.bind(observer),
            error: observer.error.bind(observer),
            complete: observer.complete.bind(observer),
          });
        });
      });
    }
  }
);

async function refreshToken(): Promise<{ accessToken: string }> {
  const refreshToken = localStorage.getItem("refreshToken");
  console.log("Refresh token from localStorage:", refreshToken);

  if (!refreshToken) {
    console.error("No refresh token found in localStorage");
    throw new Error("No refresh token available");
  }

  try {
    const response = await client.mutate({
      mutation: REFRESH_TOKEN_MUTATION,
      variables: { refreshToken },
    });
    console.log("Refresh token response:", response);

    const newAccessToken = response.data.refreshAccessToken.accessToken;
    if (newAccessToken) {
      localStorage.setItem("token", newAccessToken);
      console.log("New access token saved:", newAccessToken);
    } else {
      console.error("New access token not received from server");
    }

    return { accessToken: newAccessToken };
  } catch (error) {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    window.location.href = "/login";
    console.error("Failed to refresh token:", error);
    throw new Error("Failed to refresh token");
  }
}

const client = new ApolloClient({
  link: from([errorLink, authLink, httpLink]),
  cache: new InMemoryCache(),
});

export function ApolloWrapper({ children }: { children: React.ReactNode }) {
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}
