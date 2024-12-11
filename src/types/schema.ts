export type token = string;

export type User = {
  exp: number;
  iat?: number;
  id: string;
  idClienteFazenda?: string;
  name: string;
  profilePicture?: string;
  type?: "tecnicoCampo" | string;
};

export type AvatarProps = {
  initials: string;
  profilePicture?: string;
};
