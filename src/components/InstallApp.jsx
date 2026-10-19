import { useEffect, useState } from 'react';
import { DownloadIcon, XIcon } from '@heroicons/react/outline';

// Makes the "install on your phone" step obvious on every device.
//
// Android/Chrome fires `beforeinstallprompt`, which lets us show the native
// install sheet from a button. iOS Safari never fires it, and Chrome sometimes
// doesn't either, so when there's no native prompt we show the manual steps
// (Share -> Add to Home Screen on iPhone; browser menu -> Install app on
// Android). Previously the button was hidden entirely in those cases, which is
// why it looked like there was no way to "download the app".
const InstallApp = ({ className = '', label = 'Install App', onDone }) => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showHelp, setShowHelp] = useState(false);
  const [installed, setInstalled] = useState(false);

  const isStandalone =
    typeof window !== 'undefined' &&
    (window.matchMedia?.('(display-mode: standalone)').matches ||
      window.navigator.standalone === true);

  useEffect(() => {
    if (isStandalone) setInstalled(true);

    const onBeforeInstall = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    const onInstalled = () => {
      setDeferredPrompt(null);
      setInstalled(true);
    };
    window.addEventListener('beforeinstallprompt', onBeforeInstall);
    window.addEventListener('appinstalled', onInstalled);
    return () => {
      window.removeEventListener('beforeinstallprompt', onBeforeInstall);
      window.removeEventListener('appinstalled', onInstalled);
    };
  }, [isStandalone]);

  const ua = typeof navigator !== 'undefined' ? navigator.userAgent : '';
  const isIOS = /iphone|ipad|ipod/i.test(ua);
  const isAndroid = /android/i.test(ua);

  const handleClick = async () => {
    onDone?.();
    if (deferredPrompt) {
      deferredPrompt.prompt();
      try {
        await deferredPrompt.userChoice;
      } catch (err) {
        console.error('Install prompt dismissed:', err);
      }
      setDeferredPrompt(null);
      return;
    }
    setShowHelp(true);
  };

  // Already installed as an app — nothing to offer.
  if (installed) return null;

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        className={
          className ||
          'flex items-center px-3 py-2 rounded-md text-sm font-medium text-teal-800 bg-teal-50 hover:bg-teal-100 transition-colors ml-2'
        }
        title="Install this app on your phone"
      >
        <DownloadIcon className="h-4 w-4 mr-1" />
        {label}
      </button>

      {showHelp && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setShowHelp(false)}
        >
          <div
            className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <h3 className="text-lg font-bold text-gray-800">Install the school app</h3>
              <button
                type="button"
                onClick={() => setShowHelp(false)}
                className="text-gray-400 hover:text-gray-600"
                aria-label="Close"
              >
                <XIcon className="h-5 w-5" />
              </button>
            </div>

            {isIOS ? (
              <ol className="mt-4 space-y-3 text-sm text-gray-700 list-decimal list-inside">
                <li>Open this site in <strong>Safari</strong>.</li>
                <li>Tap the <strong>Share</strong> button (the square with an arrow ↑).</li>
                <li>Scroll down and tap <strong>Add to Home Screen</strong>.</li>
                <li>Tap <strong>Add</strong> — the app icon appears on your home screen.</li>
              </ol>
            ) : (
              <ol className="mt-4 space-y-3 text-sm text-gray-700 list-decimal list-inside">
                <li>Open this site in <strong>Chrome</strong> on your phone.</li>
                <li>{isAndroid ? 'Tap the ' : 'Open the browser '}
                  <strong>{isAndroid ? '⋮ menu (top-right)' : 'menu'}</strong>.
                </li>
                <li>Tap <strong>Install app</strong> or <strong>Add to Home screen</strong>.</li>
                <li>Confirm — the app icon appears on your home screen.</li>
              </ol>
            )}

            <p className="mt-4 text-xs text-gray-500">
              This installs the website as an app on your phone. No app store is needed, and it
              keeps working like a normal app with its own icon.
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default InstallApp;
