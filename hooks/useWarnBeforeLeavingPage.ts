import { useEffect } from 'react';
import { useRouter } from 'next/router';

const useWarnBeforeLeavingPage = (changesMade: boolean) => {
  const router = useRouter();

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (changesMade) {
        event.preventDefault();
        event.returnValue = '';
      }
    };

    const handleRouteChange = (url: string) => {
      if (changesMade) {
        const shouldWarn = window.confirm('Are you sure you want to leave this page?');
        if (!shouldWarn) {
          router.events.emit('routeChangeError');
          throw 'Abort route change.';
        }
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    router.events.on('routeChangeStart', handleRouteChange);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      router.events.off('routeChangeStart', handleRouteChange);
    };
  }, [changesMade, router.events]);
};

export default useWarnBeforeLeavingPage;