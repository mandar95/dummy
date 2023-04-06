import React from 'react'

import Widget from "components/Widget/Widgets";
import { WidgetWrapper, Container } from "modules/dashboard/dashboard-admin/style.js";

const mockupData = ({ total_corporate_buffer_amount, balance_corporate_bufffer_amount, utilized_corporate_buffer_amount }) => [{
  hex2: '#ff8a61',
  hex1: '#ff5674',
  name: 'Total Amount',
  number: total_corporate_buffer_amount,
  icon: '/assets/images/corporate-buffer/1.png',
},
{
  hex2: '#0099cc',
  hex1: '#cc99ff',
  name: 'Utilize Amount',
  number: utilized_corporate_buffer_amount,
  icon: '/assets/images/corporate-buffer/2.png',
},
{
  hex2: '#42d5a1',
  hex1: '#00ff97',
  name: 'Balance Amount',
  number: balance_corporate_bufffer_amount,
  icon: '/assets/images/corporate-buffer/3.png',
}]

export default function Widgets({ data = {} }) {
  const Data = mockupData(data)
  const List = (Data?.map((item = {}, index) => (
    <div className="p-1" key={'corprate_buffer-widget' + index}>
      <Widget
        Hex2={item.hex2}
        Hex1={item.hex1}
        Header={item.name}
        Number={item.number}
        Image={item.icon}
      />
    </div>
  ))
  );

  return (
    <Container>
      <WidgetWrapper>{List}</WidgetWrapper>
    </Container>
  );
}
