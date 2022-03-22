import { Layout, Message } from '@components/index';
import { useMutation, useUser } from '@libs/client';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import useSWR from 'swr';

interface ChatRoomDetail {
  id: 2;
  buyer: {
    id: 2;
    avatar: string;
    name: string;
  };
  product: {
    id: number;
    name: string;
    state: 'onList' | 'booked' | 'sold';
    user: {
      id: number;
      avatar: string;
      name: string;
    };
  };
  messages: [
    {
      id: number;
      message: string;
      chatRoomId: number;
      user: {
        id: number;
        name: string;
        avatar: string;
      };
    },
  ];
}

interface MessageResponse {
  ok: boolean;
  chatRoom: ChatRoomDetail;
}
interface MessageForm {
  message: string;
}

const ChatDetail: NextPage = () => {
  const router = useRouter();
  const { user, isLoading } = useUser();
  const { data, error, mutate, isValidating } = useSWR<MessageResponse>(
    router.query.id ? `/api/chats/${router.query.id}` : null,
  );
  const [sendMessage, { loading: messageLoading, data: messageData, error: messageError }] = useMutation(
    router.query.id ? `/api/chats/${router.query.id}` : '',
  );
  const { register, handleSubmit, reset } = useForm<MessageForm>();

  const onValid = (data: MessageForm) => {
    if (messageLoading) return;
    sendMessage(data);
    reset();
  };

  useEffect(() => {
    if (messageData && router.query.id) {
      mutate();
    }
  }, [messageData, mutate, router.query.id]);

  useEffect(() => {
    window.scrollTo(0, document.body.scrollHeight);
  }, [isValidating]);

  return (
    <Layout
      canGoBack
      title={
        !isLoading && data?.chatRoom
          ? `${data.chatRoom.buyer.id !== user?.id ? data.chatRoom.buyer.name : data.chatRoom.product.user.name}`
          : 'Loading'
      }
    >
      <div className="py-10 pb-16 px-4 space-y-4">
        {data?.chatRoom
          ? data?.chatRoom.messages.map((message) => {
              return (
                <Message
                  key={message.id}
                  message={message.message}
                  reversed={message.user.id === user?.id}
                  avatarUrl={message.user.avatar}
                />
              );
            })
          : null}
        <form className="fixed py-2 bg-white  bottom-0 inset-x-0">
          <div className="flex relative max-w-md items-center  w-full mx-auto">
            <input
              {...register('message', { maxLength: 140, required: true })}
              type="text"
              className="shadow-sm rounded-full w-full border-gray-300 focus:ring-orange-500 focus:outline-none pr-12 focus:border-orange-500"
            />
            <div className="absolute inset-y-0 flex py-1.5 pr-1.5 right-0">
              <button
                onClick={handleSubmit(onValid)}
                className="flex focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 items-center bg-orange-500 rounded-full px-3 hover:bg-orange-600 text-sm text-white"
              >
                &rarr;
              </button>
            </div>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default ChatDetail;
