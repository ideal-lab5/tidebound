import React, { lazy, Suspense } from 'react';

const LazyWorldRegistry = lazy(() => import('./WorldRegistry'));

const WorldRegistry = props => (
  <Suspense fallback={null}>
    <LazyWorldRegistry {...props} />
  </Suspense>
);

export default WorldRegistry;
