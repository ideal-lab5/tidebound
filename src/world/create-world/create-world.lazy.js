import React, { lazy, Suspense } from 'react';

const LazyCreateWorld = lazy(() => import('./CreateWorld'));

const CreateWorld = props => (
  <Suspense fallback={null}>
    <LazyCreateWorld {...props} />
  </Suspense>
);

export default CreateWorld;
