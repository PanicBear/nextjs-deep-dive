import { useState } from 'react';

interface UseMutationState<T> {
  loading: boolean;
  data?: T;
  error?: object;
}

const uploadPreset = 'dpsqflqu';
const cloudName = 'dydish47p';

export default function useImage<T = any>(): [(data: any) => void, UseMutationState<T>] {
  const [state, setState] = useState<UseMutationState<T>>({
    loading: false,
    data: undefined,
    error: undefined,
  });

  function mutation(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', uploadPreset);
    setState((prev) => {
      return { ...prev, loading: true };
    });
    fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: 'POST',
      body: formData,
    })
      .then((response) => response.json().catch(() => {}))
      .then((data) =>
        setState((prev) => {
          return { ...prev, data };
        }),
      )
      .catch((error) =>
        setState((prev) => {
          return { ...prev, error };
        }),
      )
      .finally(() =>
        setState((prev) => {
          return { ...prev, loading: false };
        }),
      );
  }

  return [mutation, state];
}
