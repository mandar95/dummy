import React from 'react';

import { BucketWrap } from '../style'

export const RiskBucket = ({ industry_list = [], active }) => {
  return (<BucketWrap active={active}>
    <ol className="gradient-list">
      {industry_list.map(({ industry_name }, index) =>
        <li key={industry_name + index}>{industry_name}</li>
      )}
    </ol>
  </BucketWrap>)
}
