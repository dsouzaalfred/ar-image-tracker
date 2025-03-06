'use client';

import { useEffect, useState } from 'react';
import Script from 'next/script';

export default function DuckAR() {
  const [isLoading, setIsLoading] = useState(true);
  const [isScriptsLoaded, setIsScriptsLoaded] = useState(false);
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
          const duck = document.querySelector('#duck-model');
          if (duck) {
            duck.setAttribute('animation', 'property: rotation; to: 0 360 0; dur: 5000; easing: linear; loop: true');
          }
        };
        marker.addEventListener('markerFound', handleMarkerFound);
      }

      // Set up model loaded handler
      const model = document.querySelector('#duck-model');
      if (model) {
        const handleModelLoaded = () => {
          console.log('Duck model loaded');
        };
        model.addEventListener('model-loaded', handleModelLoaded);
      }

      // Set a timeout to force-hide loading screen if it doesn't hide automatically
      timeout = setTimeout(() => {
        setIsLoading(false);
      }, 5000);

      return () => {
        clearTimeout(timeout);
        if (marker) {
          marker.removeEventListener('markerFound', handleMarkerFound);
        }
        if (scene) {
          scene.removeEventListener('loaded', handleSceneLoaded);
        }
        if (model) {
          model.removeEventListener('model-loaded', handleModelLoaded);
        }
      };
    };

    // Small delay to ensure DOM is ready
    const initTimeout = setTimeout(initAR, 1000);

    return () => {
      clearTimeout(timeout);
      clearTimeout(initTimeout);
    };
  }, [isScriptsLoaded]);

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
          <a-marker preset="hiro" smooth="true" smoothCount="5">
            <a-entity
              id="duck-model"
              position="0 0.2 0"
              scale="0.3 0.3 0.3"
              gltf-model="/duck.glb"
              rotation="0 0 0"
            />
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
      </div>
    </>
  );
}
