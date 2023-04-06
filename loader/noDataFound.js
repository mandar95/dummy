import React from 'react';

export default function NoDataFound({ text = 'No Data Found', img }) {
  return (
    <div className='d-flex flex-wrap align-items-center justify-content-center'>
      <img width='280px'
        src={img || '/assets/images/empty-data.jpg'} alt='no data' />
      <span className='h1 text-secondary text-center'>{text}</span>
    </div>
  )
}
