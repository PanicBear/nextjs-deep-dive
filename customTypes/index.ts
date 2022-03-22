import { Product } from '.prisma/client';

export interface ResponseType {
  ok: boolean;
  [key: string]: any;
}

export interface ProductWithCount extends Product {
  _count: any;
}
