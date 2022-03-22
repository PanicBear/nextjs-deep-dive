import { Product, User } from '.prisma/client';
import { Button, Layout } from '@components/index';
import { cls, useMutation, useUser } from '@libs/client';
import type { NextPage } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import useSWR from 'swr';

interface ProductWithUser extends Product {
  user: User;
}

interface ItemDetailResponse {
  ok: boolean;
  product: ProductWithUser;
  relatedProducts: Product[];
  isLiked: boolean;
}

const ItemDetail: NextPage = () => {
  const router = useRouter();
  const { user, isLoading } = useUser();
  // const { mutate } = useSWRConfig();
  const { data, mutate: boundMutate } = useSWR<ItemDetailResponse>(
    router.query.id ? `/api/products/${router.query.id}` : null,
  );
  const [startChat, { loading: chatLoading, data: chatData, error: chatError }] = useMutation<{
    chatRoomId: number;
    ok: boolean;
  }>(`/api/products/${router.query.id}/chat`);
  const [toggleFav] = useMutation(`/api/products/${router.query.id}/fav`);
  const onFavClick = () => {
    if (!data) return;
    boundMutate((prev: any) => prev && { ...prev, isLiked: !prev.isLiked }, false);
    // mutate('/api/users/me', (prev: any) => ({ ok: !prev.ok }), false);
    toggleFav({});
  };
  const onChatClick = () => {
    if (!user || chatLoading) return;
    startChat(null);
  };

  useEffect(() => {
    if (chatData?.ok && chatData.chatRoomId) {
      router.push(`/chats/${chatData.chatRoomId}`);
    }
  }, [chatData, router]);

  return (
    <Layout canGoBack>
      <div className="px-4 py-10">
        <div className="mb-8">
          {data ? (
            <div className="relative pb-80">
              <Image
                src={`https://res.cloudinary.com/dydish47p/image/upload/v1646886648/${data?.product.imageUrl}`}
                className="object-contain"
                layout="fill"
                alt="product photo"
                priority={true}
              />
            </div>
          ) : (
            <div className="h-80 bg-slate-300" />
          )}
          <div className="flex cursor-pointer py-3 border-b items-center space-x-3">
            {data?.product.user.avatar ? (
              <Image
                src={`https://res.cloudinary.com/dydish47p/image/upload/v1646815874/${data.product.user.avatar}`}
                className="w-12 h-12 rounded-full bg-slate-300 "
                width={48}
                height={48}
                alt="user avatar"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-slate-300" />
            )}
            <div>
              {data ? (
                <>
                  <p className="text-sm font-medium text-gray-700">{data.product.user.name}</p>
                  <Link href={`/users/profiles/${data.product.userId}`}>
                    <a className="text-xs font-medium text-gray-500">View profile &rarr;</a>
                  </Link>
                </>
              ) : (
                <>
                  <p className="text-sm font-medium text-gray-700">Loading</p>
                  <a className="text-xs font-medium text-gray-500">View profile &rarr;</a>
                </>
              )}
            </div>
          </div>
          <div className="mt-5">
            {data ? (
              <>
                <h1 className="text-3xl font-bold text-gray-900">{data.product.name}</h1>
                <span className="text-2xl block mt-3 text-gray-900">{data.product.price}원</span>
                <p className=" my-6 text-gray-700">{data.product.description}</p>
              </>
            ) : (
              <>
                <h1 className="text-3xl font-bold text-gray-900">Loading</h1>
                <span className="text-2xl block mt-3 text-gray-900">Loading</span>
                <p className=" my-6 text-gray-700">Loading</p>
              </>
            )}
            <div className="flex items-center justify-between space-x-2">
              <Button large text={chatLoading ? 'Loading...' : 'Talk to seller'} onClick={onChatClick} />
              <button
                onClick={onFavClick}
                className={cls(
                  'p-3 rounded-md flex items-center justify-center hover:bg-gray-100',
                  data?.isLiked ? 'text-red-500  hover:text-red-600' : 'text-gray-400  hover:text-gray-500',
                )}
              >
                {data?.isLiked ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  <svg
                    className="h-6 w-6 "
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Similar items</h2>
          <div className=" mt-6 grid grid-cols-2 gap-4">
            {data?.relatedProducts?.map((relatedProduct) => (
              <Link href={`/products/${relatedProduct.id}`} key={relatedProduct.id}>
                <a>
                  {relatedProduct.imageUrl ? (
                    <div className="relative pb-56">
                      <Image
                        className="object-cover"
                        src={`https://res.cloudinary.com/dydish47p/image/upload/v1646886648/${relatedProduct.imageUrl}`}
                        layout="fill"
                        alt="related image"
                      />
                    </div>
                  ) : (
                    <div className="h-56 w-full mb-4 bg-slate-300" />
                  )}
                  <h3 className="text-gray-700 -mb-1">{relatedProduct.name}</h3>
                  <span className="text-sm font-medium text-gray-900">₩{relatedProduct.price}</span>
                </a>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ItemDetail;
