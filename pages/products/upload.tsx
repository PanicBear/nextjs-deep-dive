import { Product } from '.prisma/client';
import { Button, Input, Layout, TextArea } from '@components/index';
import { useMutation, useUser } from '@libs/client/index';
import type { NextPage } from 'next';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

interface UploadProductForm {
  name: string;
  price: number;
  description: string;
  photo: FileList;
}

interface UploadProductMutation {
  ok: boolean;
  product: Product;
  sale: boolean;
}

const Upload: NextPage = () => {
  const router = useRouter();
  const { user } = useUser();
  const { register, handleSubmit, watch } = useForm<UploadProductForm>();
  const [upload, { loading, data, error }] = useMutation<UploadProductMutation>('/api/products');
  const [photoPreview, setPhotoPreview] = useState('');
  const photo = watch('photo');

  useEffect(() => {
    if (data?.ok && data.sale) router.replace(`/products/${data.product.id}`);
  }, [data, router]);

  useEffect(() => {
    if (photo && photo.length) {
      const file = photo[0];
      setPhotoPreview(URL.createObjectURL(file));
    }
  }, [photo]);

  const onValid = async ({ name, price, description, photo }: UploadProductForm) => {
    if (loading || !user) return;
    if (photo && photo.length) {
      const form = new FormData();
      form.append('file', photo[0], name);
      form.append('upload_preset', 'xp2um1vf');
      const { public_id: photoId } = await (
        await fetch('https://api.cloudinary.com/v1_1/dydish47p/image/upload', {
          method: 'POST',
          body: form,
        })
      ).json();
      upload({ name, price, description, photoId });
      return;
    }
    upload(data);
  };

  return (
    <Layout canGoBack title="Upload Product">
      <form className="p-4 space-y-4" onSubmit={handleSubmit(onValid)}>
        <div>
          <label className="w-full cursor-pointer text-gray-600 hover:border-orange-500 hover:text-orange-500 flex items-center justify-center border-2 border-dashed border-gray-300 h-48 rounded-md">
            {photoPreview ? (
              <div className="relative py-24 px-60">
                <Image
                  src={photoPreview}
                  className="rounded-md object-contain "
                  layout="fill"
                  alt="product preview image"
                />
              </div>
            ) : (
              <svg className="h-12 w-12" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                <path
                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
            <input {...register('photo')} accept="image/*" className="hidden" type="file" />
          </label>
        </div>
        <Input register={register('name', { required: true })} name="name" label="Name" type="text" required />
        <Input
          register={register('price', { required: true })}
          name="price"
          label="Price"
          placeholder="1000"
          type="number"
          kind="price"
          required
        />
        <TextArea
          register={register('description', { required: true })}
          name="description"
          label="Description"
          required
        />
        <Button text={`${loading ? 'Loading...' : 'Upload item'}`} />
      </form>
    </Layout>
  );
};

export default Upload;
