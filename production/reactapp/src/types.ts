export type ToDoType = {
  id: number;
  title: string;
  completed: boolean;
  author?: string;
  completed_at?: string,
  created_at?: string;
};

export enum FilterEnum {
  all = 'all',
  active = 'active',
  completed = 'completed',
};

export type DecodedJWT = {
  "token_type"?: string,
  "exp"?: number,
  "iat"?: number,
  "jti"?: string,
  "user_id": number
}

export type Token = {
  refresh: string;
  access: string;
}

export default interface IUser {
  id?: number | null,
  username?: string | null,
  email?: string,
}

export type AvailableButtonTypes = 'edit' | 'delete';