export type SignInRequest = {
  email: string;
  password: string;
};

export type SignInResponse = {
  accessToken: string;
};

export type SignUpRequest = {
  email: string;
  password: string;
  name: string;
};

export type SignUpResponse = {
  userId: number;
  email: string;
  name: string;
  createdAt: string;
};

export type CheckEmailResponse = {
  available: boolean;
};
