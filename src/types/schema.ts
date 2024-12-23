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

export type ClientTypes = {
  id: string;
  proprietario: string;
  estado: string;
  createdAt: string;
  updatedAt: string;
  tiposAnotacao?: object[];
  idGestor: string;
};

export type ListControlProps = {
  id: string;
  name: string;
};

export type AnnotationType = {
  id: string;
  nrAnotacao: number;
  data: string;
  titulo: string;
  descricao: string;
  urgencia: number;
  latitude: number;
  longitude: number;
  updatedAt: string;
  idTalhao: string;
  idTecnicoCampo: string;
  audios: { id: string; audioUrl: string }[];
  imagens: { id: string; imageUrl: string }[];
};

export type FarmDataType = {
  createdAt: string;
  estado: string;
  id: string;
  idGestor: string;
  idTalhao: string;
  nomeFazenda: string;
  proprietario: string;
  tiposAnotacao: object[];
  updatedAt: string;
};

export type LastLocationType = {
  latitude: number;
  longitude: number;
};
