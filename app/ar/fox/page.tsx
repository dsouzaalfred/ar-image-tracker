'use client';

import { useEffect, useState } from 'react';
import Script from 'next/script';
import Image from 'next/image';

export default function FoxAR() {
  const [isLoading, setIsLoading] = useState(true);
  const [isScriptsLoaded, setIsScriptsLoaded] = useState(false);
  const [debugInfo, setDebugInfo] = useState('Loading AR Experience...');
  const [showMarkerInfo, setShowMarkerInfo] = useState(true);
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
        setDebugInfo('Camera access denied');
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
        setDebugInfo('Failed to initialize AR');
        return;
      }

      // Set up scene loaded handler
      const handleSceneLoaded = () => {
        console.log('AR Scene loaded');
        setIsLoading(false);
        setDebugInfo('Camera ready. Looking for marker...');
      };
      scene.addEventListener('loaded', handleSceneLoaded);

      // Handle marker events
      const marker = document.querySelector('a-marker');
      if (marker) {
        const handleMarkerFound = () => {
          console.log('Marker found');
          setDebugInfo('Marker detected! Fox should appear.');
        };

        const handleMarkerLost = () => {
          console.log('Marker lost');
          setDebugInfo('Marker lost. Keep the marker in view.');
        };

        marker.addEventListener('markerFound', handleMarkerFound);
        marker.addEventListener('markerLost', handleMarkerLost);
      }

      // Handle model loading events
      const foxModel = document.querySelector('[gltf-model]');
      if (foxModel) {
        const handleModelLoaded = () => {
          console.log('Fox model loaded');
          setDebugInfo('Fox model loaded successfully!');
        };

        const handleModelError = (error: any) => {
          console.error('Model error:', error);
          setError('Failed to load fox model');
          setDebugInfo('Error loading fox model');
        };

        foxModel.addEventListener('model-loaded', handleModelLoaded);
        foxModel.addEventListener('model-error', handleModelError);
      }

      // Set a timeout to force-hide loading screen if it doesn't hide automatically
      timeout = setTimeout(() => {
        if (isLoading) {
          setIsLoading(false);
          setDebugInfo('AR scene loaded (timeout)');
        }
      }, 5000);

      return () => {
        clearTimeout(timeout);
        if (marker) {
          marker.removeEventListener('markerFound', handleMarkerFound);
          marker.removeEventListener('markerLost', handleMarkerLost);
        }
        if (scene) {
          scene.removeEventListener('loaded', handleSceneLoaded);
        }
        if (foxModel) {
          foxModel.removeEventListener('model-loaded', handleModelLoaded);
          foxModel.removeEventListener('model-error', handleModelError);
        }
      };
    };

    // Small delay to ensure DOM is ready
    const initTimeout = setTimeout(initAR, 1000);

    return () => {
      clearTimeout(timeout);
      clearTimeout(initTimeout);
    };
  }, [isScriptsLoaded, isLoading]);

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
          setDebugInfo('Failed to load A-Frame');
        }}
      />
      <Script 
        src="https://raw.githack.com/AR-js-org/AR.js/master/aframe/build/aframe-ar.js" 
        strategy="afterInteractive" 
        onLoad={() => console.log('AR.js loaded')}
        onError={(e) => {
          console.error('AR.js failed to load:', e);
          setError('Failed to load AR components');
          setDebugInfo('Failed to load AR.js');
        }}
      />
      
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%' }}>
        <a-scene 
          embedded 
          arjs="sourceType: webcam; debugUIEnabled: false; patternRatio: 0.75;"
          renderer="antialias: true; alpha: true"
          vr-mode-ui="enabled: false"
        >
          <a-assets>
            <a-asset-item id="fox-model" src="/fox.glb"></a-asset-item>
          </a-assets>

          <a-marker type="pattern" url="/pattern-fox.patt">
            <a-entity
              position="0 0.5 0"
              scale="0.05 0.05 0.05"
              rotation="-90 0 0"
              gltf-model="#fox-model"
              animation-mixer="clip: Survey"
            ></a-entity>
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

        {!isLoading && (
          <div style={{
            position: 'fixed',
            top: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(255, 255, 255, 0.8)',
            padding: '10px',
            borderRadius: '5px',
            fontFamily: 'monospace',
            zIndex: 1000,
            textAlign: 'center'
          }}>
            {debugInfo}
          </div>
        )}

        {showMarkerInfo && (
          <div 
            style={{
              position: 'fixed',
              bottom: '20px',
              left: '50%',
              transform: 'translateX(-50%)',
              background: 'white',
              padding: '15px',
              borderRadius: '10px',
              textAlign: 'center',
              zIndex: 1000,
              maxWidth: '90%',
              cursor: 'pointer'
            }}
            onClick={() => setShowMarkerInfo(false)}
          >
            Point camera at this marker:
            <br />
            <Image 
              src="/fox-marker.jpg"
              alt="Fox Marker"
              width={300}
              height={300}
              className="max-w-[300px] max-h-[300px] mt-2.5 border-2 border-black mx-auto"
            />
            <br />
            (Tap anywhere to hide this)
          </div>
        )}
      </div>
    </>
  );
}
