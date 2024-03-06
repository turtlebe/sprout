import React from 'react';

export interface UseGetProfilePicUrlReturn {
  isLoading: boolean;
  profilePicUrl: string | undefined;
}

export const DEFAULT_PIC = '/static/img/navbar/default_profile_image.png';

/**
 * This hook fetches the google user profile picture url from backend.
 * @todo When hyp goes away we should replace this with usage of useSwr.
 */
export const useGetProfilePicUrl = (): UseGetProfilePicUrlReturn => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [profilePicUrl, setProfilePicUrl] = React.useState<string>();

  async function fetchProfilePicUrl() {
    setIsLoading(true);

    try {
      const result = await fetch('/login/google-profile');
      const data = await result.json();
      setProfilePicUrl(data?.picture || DEFAULT_PIC);
    } catch (err) {
      setProfilePicUrl(DEFAULT_PIC);
    } finally {
      setIsLoading(false);
    }
  }

  React.useEffect(() => {
    void fetchProfilePicUrl();
  }, []);

  return { isLoading, profilePicUrl };
};
