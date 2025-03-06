'use client';

import { useEffect, useState } from 'react';
import Script from 'next/script';

export default function VideoAR() {
  const [isLoading, setIsLoading] = useState(true);
  const [isScriptsLoaded, setIsScriptsLoaded] = useState(false);
  const [isAudioEnabled, setIsAudioEnabled] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isScriptsLoaded) return;

    let timeout: NodeJS.Timeout;

    const checkCameraPermission = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        stream.getTracks().forEach(track => track.stop());
      } catch (err) {
        console.error('Camera permission error:', err);
        setError('Please allow camera access to use AR');
        return false;
      }
      return true;
    };

    const initAR = async () => {
      const hasPermission = await checkCameraPermission();
      if (!hasPermission) return;
      // Initialize AR scene after scripts are loaded
      const scene = document.querySelector('a-scene');
      if (!scene) {
        setError('AR scene could not be initialized');
        return;
      }

      // Set up scene loaded handler
      const handleSceneLoaded = () => {
        console.log('AR Scene loaded');
        setIsLoading(false);
      };
      scene.addEventListener('loaded', handleSceneLoaded);

      // Handle marker events
      const marker = document.querySelector('a-marker');
      if (marker) {
        const handleMarkerFound = () => {
          console.log('Marker found');
          const video = document.querySelector('#ar-video') as HTMLVideoElement;
          if (video) {
            video.play().catch(err => {
              console.error('Error playing video:', err);
              setError('Failed to play video. Please try again.');
            });
          }
        };

        const handleMarkerLost = () => {
          console.log('Marker lost');
          const video = document.querySelector('#ar-video') as HTMLVideoElement;
          if (video) {
            video.pause();
          }
        };

        marker.addEventListener('markerFound', handleMarkerFound);
        marker.addEventListener('markerLost', handleMarkerLost);
      }

      // Enable audio on user interaction
      const handleClick = () => {
        if (!isAudioEnabled) {
          const video = document.querySelector('#ar-video') as HTMLVideoElement;
          if (video) {
            video.muted = false;
            setIsAudioEnabled(true);
          }
        }
      };

      document.addEventListener('click', handleClick);

      // Set a timeout to force-hide loading screen if it doesn't hide automatically
      timeout = setTimeout(() => {
        setIsLoading(false);
      }, 5000);

      return () => {
        clearTimeout(timeout);
        document.removeEventListener('click', handleClick);
        if (marker) {
          marker.removeEventListener('markerFound', handleMarkerFound);
          marker.removeEventListener('markerLost', handleMarkerLost);
        }
        if (scene) {
          scene.removeEventListener('loaded', handleSceneLoaded);
        }
      };
    };

    // Small delay to ensure DOM is ready
    const initTimeout = setTimeout(initAR, 1000);

    return () => {
      clearTimeout(timeout);
      clearTimeout(initTimeout);
    };
  }, [isScriptsLoaded, isAudioEnabled]);

  return (
    <>
      <Script 
        src="https://aframe.io/releases/1.4.0/aframe.min.js" 
        strategy="afterInteractive" 
        onLoad={() => {
          console.log('A-Frame loaded');
          setIsScriptsLoaded(true);
        }}
        onError={(e) => {
          console.error('A-Frame failed to load:', e);
          setError('Failed to load AR components');
        }}
      />
      <Script 
        src="https://raw.githack.com/AR-js-org/AR.js/master/aframe/build/aframe-ar.js" 
        strategy="afterInteractive" 
        onLoad={() => console.log('AR.js loaded')}
        onError={(e) => {
          console.error('AR.js failed to load:', e);
          setError('Failed to load AR components');
        }}
      />
      
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%' }}>
        <a-scene 
          embedded 
          arjs="sourceType: webcam; debugUIEnabled: false; detectionMode: mono_and_matrix; matrixCodeType: 3x3;"
          renderer="antialias: true; alpha: true"
          vr-mode-ui="enabled: false"
        >
          <a-assets>
            <video 
              id="ar-video" 
              src="/duck-quack.mp3"
              preload="auto"
              muted
              loop
              crossOrigin="anonymous"
              playsinline
              webkit-playsinline
              onloadeddata={() => {
                console.log('Video loaded');
                setIsLoading(false);
              }}
              onerror={(e) => {
                console.error('Video error:', e);
                setError('Failed to load video');
              }}
            ></video>
          </a-assets>

          <a-marker preset="hiro" smooth="true" smoothCount="5">
            <a-video
              src="#ar-video"
              position="0 0.1 0"
              rotation="-90 0 0"
              width="2"
              height="1.5"
            ></a-video>
          </a-marker>
          <a-entity camera />
        </a-scene>

        {(isLoading || error) && (
          <div style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: 'rgba(0, 0, 0, 0.7)',
            color: 'white',
            padding: '20px',
            borderRadius: '10px',
            textAlign: 'center',
            zIndex: 1000
          }}>
            {error ? (
              <p style={{ color: '#ff6b6b' }}>{error}</p>
            ) : (
              <>
                <p>Loading AR Experience...</p>
                <p style={{ fontSize: '14px', marginTop: '10px' }}>Please allow camera access when prompted</p>
              </>
            )}
          </div>
        )}

        {!isAudioEnabled && !isLoading && (
          <div style={{
            position: 'fixed',
            bottom: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(0, 0, 0, 0.7)',
            color: 'white',
            padding: '10px 20px',
            borderRadius: '20px',
            textAlign: 'center',
            zIndex: 1000
          }}>
            <p>Tap anywhere to enable audio</p>
          </div>
        )}
      </div>
    </>
  );
}
