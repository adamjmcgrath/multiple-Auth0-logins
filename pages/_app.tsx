import '../reset.css';
import React, { useEffect, useState } from 'react';
import debounce from 'lodash/debounce';
import type { AppProps } from 'next/app';

export default function App(appProps: AppProps) {
  const { Component, pageProps } = appProps;

  const [, setWindowWidth] = useState(0);
  useEffect(() => {
    const handleResize = debounce(() => {
      setWindowWidth(window.innerWidth);
    }, 500);
    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div style={{ padding: 12 }}>
      <Component {...pageProps} />
    </div>
  );
}
