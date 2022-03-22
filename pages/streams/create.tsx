import { Stream } from '.prisma/client';
import { Button, Input, Layout, TextArea } from '@components/index';
import { useMutation } from '@libs/client';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

interface CreateForm {
  name: string;
  price: number;
  description: string;
}
interface CreateResponse {
  ok: boolean;
  stream: Pick<Stream, 'id'>;
}

const Create: NextPage = () => {
  const router = useRouter();
  const { register, handleSubmit } = useForm<CreateForm>();
  const [createStream, { loading, data, error }] = useMutation<CreateResponse>('/api/streams');

  const onValid = (data: CreateForm) => {
    if (!data || loading) return;
    createStream(data);
  };

  useEffect(() => {
    if (data && data.ok) {
      router.push(`/streams/${data.stream.id}`);
    }
  }, [data, router]);

  return (
    <Layout canGoBack title="Go Live">
      <form onSubmit={handleSubmit(onValid)} className="space-y-4 py-10 px-4">
        <Input
          register={register('name', { required: true, setValueAs: (value) => value + '' })}
          type="text"
          name="name"
          label="Name"
          required
        />
        <Input
          register={register('price', { required: true })}
          type="number"
          name="price"
          label="Price"
          placeholder="10000"
          kind="price"
          required
        />
        <TextArea
          register={register('description', { required: true, minLength: 5 })}
          name="description"
          label="Description"
        />
        <Button text={loading ? 'Loading' : 'Go live'} />
      </form>
    </Layout>
  );
};

export default Create;
