import { getClient, Body, RequestOptions, Response } from "@tauri-apps/api/http";

interface IGetParams {
  url: string,
  options?: RequestOptions;
}

export const get = async <T>({ url, options }: IGetParams): Promise<T> => {
  const client = await getClient();
  return client.get<T>(url, options).then(res => res.data);
}

export const rawGet = async <T>({ url, options }: IGetParams ): Promise<Response<T>> => {
  const client = await getClient();
  return client.get<T>(url, options);
}

interface IPostParams {
  url: string;
  body: Record<any, any>;
  options?: RequestOptions;
}

export const post = async <T>({ url, body, options }: IPostParams): Promise<T> => {
  const client = await getClient();
  return client.post<T>(url, Body.json(body), options).then(res => res.data);
}

export const rawPost = async <T>({ url, body, options }: IPostParams): Promise<Response<T>> => {
  const client = await getClient();
  return client.post<T>(url, Body.json(body), options);
}

interface IPutParams {
  url: string;
  body: Record<any, any>;
  options?: RequestOptions;
}

export const put = async <T>({ url, body, options }: IPutParams): Promise<T> => {
  const client = await getClient();
  return client.put<T>(url, Body.json(body), options).then(res => res.data);
}

export const rawPut = async <T>({ url, body, options }: IPutParams): Promise<Response<T>> => {
  const client = await getClient();
  return client.put<T>(url, Body.json(body), options);
}

interface IPatchParams {
  url: string;
  options?: RequestOptions;
}

export const patch = async <T>({ url, options }: IPatchParams): Promise<T> => {
  const client = await getClient();
  return client.patch<T>(url, options).then(res => res.data);
}

export const rawPatch = async <T>({ url, options }: IPatchParams): Promise<Response<T>> => {
  const client = await getClient();
  return client.patch<T>(url, options);
}
interface IDeleteParams {
  url: string;
  options?: RequestOptions;
}

export const del = async <T>({ url, options }: IDeleteParams): Promise<T> => {
  const client = await getClient();
  return client.delete<T>(url, options).then(res => res.data);
}

export const rawDel = async <T>({ url, options }: IDeleteParams): Promise<Response<T>> => {
  const client = await getClient();
  return client.delete<T>(url, options);
}
