import { Message, Stream, User } from '.prisma/client';
import { Layout, Message as Chat } from '@components/index';
import { useMutation, useUser } from '@libs/client';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import useSWR from 'swr';

interface MessageWithUser extends Message {
  user: Pick<User, 'id' | 'avatar'>;
}

interface StreamWithMessages extends Stream {
  messages: Pick<MessageWithUser, 'id' | 'message' | 'user'>[];
}

interface StreamResponse {
  ok: boolean;
  stream: StreamWithMessages;
}

interface MessageForm {
  message: string;
}

const Stream: NextPage = () => {
  const router = useRouter();
  const { user, isLoading } = useUser();
  const { data, mutate } = useSWR<StreamResponse>(router.query.id ? `/api/streams/${router.query.id}` : null, {
    refreshInterval: 1000,
  });
  const { register, handleSubmit, reset } = useForm<MessageForm>();
  const [send, { loading: sendLoading, data: sendData, error: sendError }] = useMutation(
    `/api/streams/${router.query.id}/message`,
  );

  const onValid = (data: MessageForm) => {
    if (!data || sendLoading) return;
    reset();
    mutate(
      (prev) =>
        prev &&
        ({
          ...prev,
          stream: {
            ...prev.stream,
            messages: [...prev.stream.messages, { id: Date.now(), message: data.message, user: { ...user } }],
          },
        } as any),
      false,
    );
    send(data);
  };

  return (
    <Layout canGoBack>
      <div className="py-10 px-4  space-y-4">
        {data?.stream.cloudflareId ? (
          <iframe
            className="w-full rounded-md shadow-sm bg-slate-300 aspect-video"
            src={`https://iframe.videodelivery.net/${data?.stream.cloudflareId}`}
            allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
            allowFullScreen={true}
          />
        ) : (
          <div className="w-full rounded-md shadow-sm bg-slate-300 aspect-video" />
        )}
        <div className="mt-5">
          <h1 className="text-3xl font-bold text-gray-900">{data ? data.stream?.name : 'Loading'}</h1>
          <span className="text-2xl block mt-3 text-gray-900">{data ? data.stream?.price : 'Loading'}</span>
          <p className=" my-6 text-gray-700">{data ? data.stream?.description : 'Loading'}</p>
          <div className="bg-orange-300 p-5 rounded-md overflow-x-scroll flex flex-col space-y-3">
            <span>Stream Keys (secret)</span>
            <span className="text-white">
              <span className="font-medium text-gray-600">URL:</span>
              {data ? data.stream?.cloudflareUrl : 'Loading'}
            </span>
            <span className="text-white">
              <span className="font-medium text-gray-600">Key:</span>
              {data ? data.stream?.cloudflareKey : 'Loading'}
            </span>
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Live Chat</h2>
          <div className="py-10 pb-16 h-[50vh] overflow-y-scroll  px-4 space-y-4">
            {data?.stream?.messages.map((message) => {
              return (
                <Chat
                  key={message.id}
                  message={message.message}
                  avatarUrl={message.user.avatar}
                  reversed={user?.id === message.user.id}
                />
              );
            })}
          </div>
          <div className="fixed py-2 bg-white bottom-0 inset-x-0">
            <form onSubmit={handleSubmit(onValid)} className="flex relative max-w-md items-center  w-full mx-auto">
              <input
                {...register('message', { required: true })}
                type="text"
                className="shadow-sm rounded-full w-full border-gray-300 focus:ring-orange-500 focus:outline-none pr-12 focus:border-orange-500"
              />
              <div className="absolute inset-y-0 flex py-1.5 pr-1.5 right-0">
                <button className="flex focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 items-center bg-orange-500 rounded-full px-3 hover:bg-orange-600 text-sm text-white">
                  &rarr;
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Stream;
