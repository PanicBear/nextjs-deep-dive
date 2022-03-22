import { cls } from '@libs/client/utils';
import Image from 'next/image';

interface MessageProps {
  message: string;
  reversed?: boolean;
  avatarUrl?: string | null;
}

export default function Message({ message, avatarUrl, reversed }: MessageProps) {
  return (
    <div className={cls('flex items-start space-x-2', reversed ? 'flex-row-reverse space-x-reverse' : '')}>
      {avatarUrl ? (
        <Image
          src={`https://res.cloudinary.com/dydish47p/image/upload/c_thumb,w_32,h_32,g_face/v1646886648/${avatarUrl}`}
          className="rounded-full bg-slate-400 "
          width={32}
          height={32}
          alt="message avatar"
        />
      ) : (
        <div className="w-8 h-8 rounded-full bg-slate-400" />
      )}
      <div className="w-1/2 text-sm text-gray-700 p-2 border border-gray-300 rounded-md">
        <p className="break-words">{message}</p>
      </div>
    </div>
  );
}
