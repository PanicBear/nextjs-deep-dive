import { Answer, Post, User } from '.prisma/client';
import { Layout, TextArea } from '@components/index';
import { cls, useMutation } from '@libs/client';
import type { NextPage } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import useSWR from 'swr';

interface AnswerForm {
  answer: string;
}

interface AnswerResponse {
  ok: boolean;
  answer: Answer;
  post: Post;
}

interface AnswerWithUser extends Answer {
  user: Pick<User, 'id' | 'name' | 'avatar'>;
}

interface PostWithUser extends Post {
  answers: AnswerWithUser[];
  user: Pick<User, 'id' | 'name' | 'avatar'>;
  _count: {
    wonderings: number;
    answers: number;
  };
}

interface CommunityPostResponse {
  ok: boolean;
  post: PostWithUser;
  isWondered: boolean;
}

const CommunityPostDetail: NextPage = () => {
  const router = useRouter();
  const { data, mutate } = useSWR<CommunityPostResponse>(router.query.id ? `/api/posts/${router.query.id}` : null);
  const [sendAnswer, { loading: answerLoading, data: answerData, error: answerError }] = useMutation<AnswerResponse>(
    `/api/posts/${router.query.id}/answer`,
  );
  const { register, handleSubmit, reset } = useForm<AnswerForm>();
  const [wonder, { loading: wonderLoading }] = useMutation(`/api/posts/${router.query.id}/wonder`);

  const onWonderClick = () => {
    if (!data) return;
    mutate(
      (prev) =>
        prev && {
          ...prev,
          isWondered: !prev.isWondered,
          post: {
            ...prev.post,
            _count: {
              ...prev.post._count,
              wonderings: prev.isWondered ? prev.post._count.wonderings - 1 : prev.post._count.wonderings + 1,
            },
          },
        },
      false,
    );
    if (!wonderLoading) {
      wonder({});
    }
  };
  const onValid = (form: AnswerForm) => {
    if (answerLoading) return;
    sendAnswer(form);
  };

  useEffect(() => {
    if (answerData && answerData.ok) {
      reset();
      mutate();
    }
  }, [answerData, reset, mutate]);

  return (
    <Layout canGoBack>
      <div>
        <span className="inline-flex my-3 ml-4 items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
          동네질문
        </span>
        <div className="flex mb-3 px-4 cursor-pointer pb-3 items-center space-x-3">
          {data?.post?.user.avatar ? (
            <Image
              src={`https://res.cloudinary.com/dydish47p/image/upload/c_thumb,w_40,h_40/v1646886648/${data.post.user.avatar}`}
              className="rounded-full "
              width={40}
              height={40}
              alt="writer avatar"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-slate-300" />
          )}
          <div>
            <p className="text-sm font-medium text-gray-700">{data ? `${data.post?.user.name}` : 'Loading'}</p>
            <Link href={`/users/profiles/${data?.post?.user.id}`}>
              <a className="text-xs font-medium text-gray-500">View profile &rarr;</a>
            </Link>
          </div>
        </div>
        <div>
          <div className="mt-2 px-4 text-gray-700">
            <span className="text-orange-500 font-medium">Q. </span>
            {data ? `${data.post?.question}` : 'Loading'}
          </div>
          <div className="flex px-4 space-x-5 mt-3 text-gray-700 py-2.5 border-t border-b-[2px]  w-full">
            <button
              onClick={onWonderClick}
              className={cls('flex space-x-2 items-center text-sm', data?.isWondered ? 'text-teal-400' : '')}
            >
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
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
              <span>궁금해요 {data ? `${data.post?._count.wonderings}` : 0}</span>
            </button>
            <span className="flex space-x-2 items-center text-sm">
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
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                ></path>
              </svg>
              <span>답변 {data ? `${data.post?._count.answers}` : 0}</span>
            </span>
          </div>
        </div>
        <div className="px-4 my-5 space-y-5">
          {data?.post?.answers.map((answer) => {
            return (
              <div key={answer.id} className="flex items-start space-x-3">
                {answer.user.avatar ? (
                  <Image
                    src={`https://res.cloudinary.com/dydish47p/image/upload/c_thumb,w_32,h_32/v1646886648/${answer.user.avatar}`}
                    className="bg-slate-200 rounded-full "
                    width={32}
                    height={32}
                    alt="comment avatar"
                  />
                ) : (
                  <div className="w-8 h-8 bg-slate-200 rounded-full" />
                )}
                <div>
                  <span className="text-sm block font-medium text-gray-700">{answer.user.name}</span>
                  <span className="text-xs text-gray-500 block ">{answer.createdAt}</span>
                  <p className="text-gray-700 mt-2">{answer.answer}</p>
                </div>
              </div>
            );
          })}
        </div>
        <form onSubmit={handleSubmit(onValid)} className="px-4">
          <TextArea
            register={register('answer', { required: true, minLength: 5 })}
            name="answer"
            placeholder="Answer this question!"
            required
          />
          <button className="mt-2 w-full bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 focus:outline-none ">
            {answerLoading ? 'Loading' : 'Reply'}
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default CommunityPostDetail;
