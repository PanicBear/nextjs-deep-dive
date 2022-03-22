import type { NextPage } from 'next';
import Link from 'next/link';
import { Layout } from '@components/index';
import useSWR from 'swr';
import { useUser } from '@libs/client';
import { Message, User } from '@prisma/client';
import Image from 'next/image';

type UserInfo = Pick<User, 'id' | 'name' | 'avatar'>;

interface ChatRoom {
  id: number;
  buyer: UserInfo;
  product: {
    user: UserInfo;
  };
  messages: Message[];
}

interface ChatRoomResult {
  ok: boolean;
  chatRooms: ChatRoom[];
}

const Chats: NextPage = () => {
  const { user, isLoading } = useUser();
  const { data, error } = useSWR<ChatRoomResult>(user?.id ? `/api/chats` : null);
  return (
    <Layout hasTabBar title="채팅">
      <div className="divide-y-[1px] ">
        {data?.chatRooms.map((chatRoom) => {
          const opponent: UserInfo = chatRoom.buyer.id !== user?.id ? chatRoom.buyer : chatRoom.product.user;
          return (
            <Link href={`/chats/${chatRoom.id}`} key={chatRoom.id}>
              <a className="flex px-4 cursor-pointer py-3 items-center space-x-3">
                <div className="flex-shrink-0">
                  <Image
                    src={`https://res.cloudinary.com/dydish47p/image/upload/c_thumb,w_48,h_48,g_face/v1646978352/${opponent.avatar}`}
                    className="w-12 h-12 rounded-full bg-slate-300"
                    width={48}
                    height={48}
                    alt="opponent avatar"
                  />
                </div>
                <div className="overflow-x-hidden">
                  <p className="text-gray-700">{opponent.name}</p>
                  <p className="inline-block text-sm text-gray-500">
                    {chatRoom.messages[0] ? chatRoom.messages[0].message : '나눈 대화가 없습니다'}
                  </p>
                </div>
              </a>
            </Link>
          );
        })}
      </div>
    </Layout>
  );
};

export default Chats;
