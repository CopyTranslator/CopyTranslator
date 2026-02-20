export interface Mutation {
  type: string;
  payload: any;
}
export type { Identifier } from "../../common/types";

export type Config = { [key: string]: any };
