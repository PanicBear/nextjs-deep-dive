import { ProductState } from '.prisma/client';
import { FloatingButton, Item, Layout } from '@components/index';
import { ProductWithCount } from '@customTypes/index';
import { useUser } from '@libs/client/index';
import type { NextPage } from 'next';
import useSWR from 'swr';

interface ProductResponse {
  ok: boolean;
  products: ProductWithCount[];
}

function setState(state: ProductState) {
  switch (state) {
    case 'onList':
      return '판매중';
    case 'booked':
      return '예약완료';
    case 'sold':
      return '판매완료';
  }
}

const Home: NextPage = () => {
  const { data } = useSWR<ProductResponse>('/api/products');

  return (
    <Layout title="홈" hasTabBar>
      <div className="flex flex-col space-y-1 py-2 divide-y">
        {data?.products?.map((product) => (
          <Item
            key={product.id}
            id={product.id}
            title={`[${setState(product.state)}]` + product.name}
            price={product.price}
            hearts={product._count.favs}
            imageUrl={product.imageUrl}
            comments={1}
          />
        ))}
        <FloatingButton href={'/products/upload'}>
          <svg
            className="h-6 w-6"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </FloatingButton>
      </div>
    </Layout>
  );
};

export default Home;
