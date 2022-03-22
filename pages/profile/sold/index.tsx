import { Layout } from '@components/index';
import ProductList from '@components/product-list';
import type { NextPage } from 'next';

const Sold: NextPage = () => {
  return (
    <Layout title="판매내역" canGoBack>
      <div className="flex flex-col divide-y-[1px] py-2">
        <ProductList kind={'sales'} />
      </div>
    </Layout>
  );
};

export default Sold;
