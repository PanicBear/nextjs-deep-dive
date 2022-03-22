import { Product, ProductState } from '.prisma/client';
import { Item } from '@components/index';
import { ProductWithCount } from '@customTypes/index';
import useSWR from 'swr';
import ButtonItem from './button-item';

interface ProductListProps {
  kind: 'favs' | 'sales' | 'purchases';
}

interface Record extends Product {
  id: number;
  product: ProductWithCount;
}

interface ProductListResponse {
  [key: string]: Record[];
}

function productStatehandler(state: ProductState, kind: 'favs' | 'sales' | 'purchases') {
  switch (state) {
    case 'onList':
      return '판매중';
    case 'booked':
      return kind === 'purchases' ? '구매중' : '예약완료';
    case 'sold':
      return kind === 'purchases' ? '구매완료' : '판매완료';
  }
}

export default function ProductList({ kind }: ProductListProps) {
  const { data } = useSWR<ProductListResponse>(`/api/users/me/${kind}`);

  return data ? (
    <>
      {kind === 'sales'
        ? data[kind]?.map((record) => {
            return (
              <ButtonItem
                key={record.id}
                id={record.product.id}
                title={`[${productStatehandler(record.product.state, kind)}]` + record.product.name}
                price={record.product.price}
                hearts={record.product._count.favs}
                imageUrl={record.product.imageUrl}
                comments={0}
                state={record.product.state}
              />
            );
          })
        : data[kind]?.map((record) => {
            return (
              <Item
                key={record.id}
                id={record.product.id}
                title={`[${productStatehandler(record.product.state, kind)}]` + record.product.name}
                price={record.product.price}
                hearts={record.product._count.favs}
                imageUrl={record.product.imageUrl}
                comments={0}
              />
            );
          })}
    </>
  ) : null;
}
