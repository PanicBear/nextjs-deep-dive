import { Layout } from '@components/index';
import { useMutation, useUser } from '@libs/client';
import { Product, User } from '@prisma/client';
import type { NextPage } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import useSWR from 'swr';

type UserInfo = Pick<User, 'id' | 'name' | 'avatar'>;

interface Buyer {
  buyer: {
    id: number;
    name: string;
    avatar: string;
  };
}

interface ChatRoomResult {
  ok: boolean;
  users: Buyer[];
  product: Product;
}

const BuyerPick: NextPage = () => {
  const router = useRouter();
  const { user, isLoading } = useUser();
  const { data, error } = useSWR<ChatRoomResult>(
    user?.id && router.query.id ? `/api/chats/sale/${router.query.id}` : null,
  );
  const [setReserver, { loading: buyerLoading, data: buyerData, error: buyerError }] = useMutation(
    router.query.id ? `/api/chats/sale/${router.query.id}` : '',
  );

  const onClickReservor = (buyer: UserInfo) => {
    if (!user || !buyer || buyerError || buyerLoading) return;
    setReserver(buyer);
  };

  useEffect(() => {
    if (buyerData && buyerData.ok && !buyerLoading && !buyerError) {
      router.replace('/profile/sold');
    }
  }, [buyerData, buyerLoading, buyerError, router]);

  return (
    <Layout canGoBack title="예약자 선택">
      <div className="divide-y-[1px] ">
        {data
          ? data.users?.map((user) => {
              const buyer: UserInfo = user.buyer;
              return (
                <div className="flex justify-between" key={buyer.id}>
                  <Link href={`/chats/${buyer.id}`}>
                    <a className="flex px-4 cursor-pointer py-3 items-center space-x-3">
                      <Image
                        src={`https://res.cloudinary.com/dydish47p/image/upload/c_thumb,w_48,h_48,g_face/v1646978352/${buyer.avatar}`}
                        className="w-12 h-12 rounded-full bg-slate-300 flex-shrink-0"
                        width={48}
                        height={48}
                        alt="opponent avatar"
                      />
                      <div className="overflow-x-hidden">
                        <p className="text-gray-700">{buyer.name}</p>
                      </div>
                    </a>
                  </Link>
                  <div className="flex px-4 py-4">
                    <button
                      onClick={() => onClickReservor(buyer)}
                      className="items-center w-16 cursor-pointer rounded-md border-[1px] hover:bg-orange-500 hover:text-white active:hover:bg-orange-600 focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 focus:outline-none focus:border-none"
                    >
                      선택
                    </button>
                  </div>
                </div>
              );
            })
          : null}
      </div>
    </Layout>
  );
};

export default BuyerPick;
