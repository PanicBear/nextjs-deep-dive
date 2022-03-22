import { Button, Input, Layout } from '@components/index';
import { useMutation, useUser } from '@libs/client';
import type { NextPage } from 'next';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

interface EditProfileForm {
  email?: string;
  phone?: string;
  name?: string;
  avatar?: FileList;
  formErrors?: string;
}

interface EditProfileResponse {
  ok: boolean;
  error?: string;
}

const EditProfile: NextPage = () => {
  const { user } = useUser();
  const [editProfile, { loading, data }] = useMutation<EditProfileResponse>('/api/users/me');
  const {
    register,
    handleSubmit,
    setValue,
    setError,
    formState: { errors },
    watch,
  } = useForm<EditProfileForm>();
  const [avatarPreview, setAvatarPreview] = useState('');
  const avatar = watch('avatar');

  const onValid = async ({ email, phone, name, avatar }: EditProfileForm) => {
    if (loading) return;
    if (!email && !phone && !name) {
      return setError('formErrors', { message: 'Email or Phone number is required' });
    }
    if (avatar && avatar.length && user) {
      const form = new FormData();
      form.append('file', avatar[0], user.id + '');
      form.append('upload_preset', 'dpsqflqu');
      const { public_id: avatarId } = await (
        await fetch('https://api.cloudinary.com/v1_1/dydish47p/image/upload', {
          method: 'POST',
          body: form,
        })
      ).json();
      editProfile({ email, phone, name, avatarId });
    }
    editProfile({ email, phone, name });
  };

  useEffect(() => {
    setValue('name', user?.name ?? '');
    setValue('email', user?.email ?? '');
    setValue('phone', user?.phone ?? '');
    if (user?.avatar && !avatarPreview)
      setAvatarPreview(`https://res.cloudinary.com/dydish47p/image/upload/v1646815874/${user?.avatar}`);
  }, [user, setValue, avatarPreview]);

  useEffect(() => {
    if (data && !data.ok) {
      setError('formErrors', { message: data?.error });
    }
  }, [data, setError]);

  useEffect(() => {
    if (avatar && avatar.length) {
      const file = avatar[0];
      setAvatarPreview(URL.createObjectURL(file));
    }
  }, [avatar]);

  return (
    <Layout title="Edit Profile" canGoBack>
      <form onSubmit={handleSubmit(onValid)} className="py-10 px-4 space-y-4">
        <div className="flex items-center space-x-3">
          {avatarPreview ? (
            <img src={avatarPreview} className="w-14 h-14 rounded-full bg-slate-500" />
          ) : (
            <div className="w-14 h-14 rounded-full bg-slate-500" />
          )}
          <label
            htmlFor="picture"
            className="cursor-pointer py-2 px-3 border hover:bg-gray-50 border-gray-300 rounded-md shadow-sm text-sm font-medium focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 text-gray-700"
          >
            Change
            <input {...register('avatar')} id="picture" type="file" className="hidden" accept="image/*" />
          </label>
        </div>
        <Input register={register('name', { required: true })} name="Name" label="name" type="text" required={true} />
        <Input
          register={register('email', {
            pattern: /[\w-\.]+@([\w-]+\.)+[\w-]{2,4}/,
          })}
          name="email"
          label="Email address"
          type="email"
          required={false}
        />
        <Input
          register={register('phone', {
            pattern: /[0-9]{2,3}[0-9]{3,4}[0-9]{4}/,
          })}
          name="phone"
          label="Phone number"
          kind="phone"
          type="tel"
          required={false}
        />
        {errors.formErrors ? (
          <span className="my-2 text-red-500 font-medium text-center block">{errors.formErrors.message}</span>
        ) : null}
        <Button text={loading ? 'Loading' : 'Update profile'} />
      </form>
    </Layout>
  );
};

export default EditProfile;
