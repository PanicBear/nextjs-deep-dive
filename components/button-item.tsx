import { ProductState } from '.prisma/client';
import { useMutation, useUser } from '@libs/client';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import useSWR from 'swr';

interface ItemProps {
  title: string;
  id: number;
  price: number;
  hearts: number;
  imageUrl: string;
  comments: number;
  state: ProductState;
}

export default function ButtonItem({ title, id, price, hearts, imageUrl, state, comments }: ItemProps) {
  const router = useRouter();
  const { user } = useUser();
  const { mutate } = useSWR(`/api/users/me/sales`);
  const [setProductState, { loading, data, error }] = useMutation(`/api/users/me/sales/${id}`);

  const onSetBookedClick = () => {
    if (!user || loading || error) return;
    router.push(`/profile/sold/${id}`);
  };
  const onSetOnListClick = () => {
    if (!user || !id || !state || loading || error) return;
    setProductState({ id, kind: 'onList' });
  };
  const onSetSoldClick = () => {
    if (!user || !id || !state || loading || error) return;
    setProductState({ id, kind: 'sold' });
  };

  useEffect(() => {
    if (data) {
      mutate();
    }
  }, [mutate, data]);

  return (
    <div className="py-8 pb-4 space-y-4 px-4">
      <Link href={`/products/${id}`}>
        <a className="flex cursor-pointer justify-between">
          <div className="flex space-x-4">
            {imageUrl ? (
              <Image
                src={`https://res.cloudinary.com/dydish47p/image/upload/c_thumb,w_80,h_80/v1646886648/${imageUrl}`}
                className="rounded-md"
                height={80}
                width={80}
                alt="product thumbnail"
              />
            ) : (
              <div className="w-20 h-20 bg-gray-400 rounded-md" />
            )}
            <div className="pt-2 flex flex-col">
              <h3 className="text-sm font-medium text-gray-900">{title}</h3>
              <span className="font-medium mt-1 text-gray-900">₩{price}</span>
            </div>
          </div>
          <div className="flex space-x-2 items-end justify-end">
            <div className="flex space-x-0.5 items-center text-sm  text-gray-600">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                ></path>
              </svg>
              <span>{hearts}</span>
            </div>
          </div>
        </a>
      </Link>
      <div className="flex justify-around h-12 divide-x-[1px]">
        {state === 'onList' && (
          <button
            onClick={onSetBookedClick}
            className="cursor-pointer w-full hover:bg-orange-500 hover:text-white active:bg-orange-600 active:text-white first:rounded-l-md last:rounded-r-md active:hover:bg-orange-600 focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 focus:outline-none focus:border-none"
          >
            {loading ? 'Loading...' : '예약중으로 변경하기'}
          </button>
        )}
        {state === 'booked' && (
          <>
            <button
              onClick={onSetOnListClick}
              className="cursor-pointer w-full hover:bg-orange-500 hover:text-white active:bg-orange-600 active:text-white first:rounded-l-md last:rounded-r-md active:hover:bg-orange-600 focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 focus:outline-none focus:border-none"
            >
              {loading ? 'Loading...' : '판매중으로 변경하기'}
            </button>
            <button
              onClick={onSetSoldClick}
              className="cursor-pointer w-full hover:bg-orange-500 hover:text-white active:bg-orange-600 active:text-white first:rounded-l-md last:rounded-r-md active:hover:bg-orange-600 focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 focus:outline-none focus:border-none"
            >
              {loading ? 'Loading...' : '거래완료로 변경하기'}
            </button>
          </>
        )}
        {state === 'sold' && (
          <button
            onClick={onSetOnListClick}
            className="cursor-pointer w-full hover:bg-orange-500 hover:text-white active:bg-orange-600 active:text-white first:rounded-l-md last:rounded-r-md active:hover:bg-orange-600 focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 focus:outline-none focus:border-none"
          >
            {loading ? 'Loading...' : '판매중으로 변경하기'}
          </button>
        )}
      </div>
    </div>
  );
}
