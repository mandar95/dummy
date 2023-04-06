import React from 'react';
import { ECashlessIntimation } from '.';
import { Footer, NavBar } from '../../components';

export default function TPAClaim() {
  return (
    <>
      <NavBar noLink />
      <div style={{ padding: '0 0 49px 0' }}>
        <ECashlessIntimation />
      </div>
      <Footer noLogin />
    </>
  )
}
