import type { NextPage } from 'next';
import { Layout, Item } from '@components/index';
import ProductList from '@components/product-list';

const Bought: NextPage = () => {
  return (
    <Layout title="구매내역" canGoBack>
      <div className="flex flex-col space-y-5 py-10">
        <ProductList kind={'purchases'} />
      </div>
    </Layout>
  );
};

export default Bought;
