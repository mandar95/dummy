import React from 'react';
import { Card } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import styled from 'styled-components';

const CardWrapper = styled.div`
display : inline-block;
margin-top : 3rem;
flex-wrap : wrap;
.card {
    background-color: ${({ theme }) => theme.dark ? '#2a2a2a' : '#ffffff'}
}
span {
    color: ${({ theme }) => theme.dark ? "#000000" : "#FFFFFF"}
}
`
const imgURL = ["level1.png", "level2.png", "level3.png"];


export const ContactCard = ({
  address_line_1,
  address_line_2,
  address_line_3,
  contact_1,
  contact_2,
  contact_3,
  email_1,
  email_2,
  email_3,
  name,
  name_1,
  name_2,
  name_3 }) => {

  const { globalTheme } = useSelector(state => state.theme)

  return (
    <>
      {((address_line_1 && address_line_1 !== 'NULL') || (contact_1 && contact_1 !== 'NULL') || (email_1 && email_1 !== 'NULL')) && <CardWrapper>
        <Card style={{
          width: '20rem', borderRadius: '2em', padding: '1em',
          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",

        }} className={'mx-4 my-2'}>
          <div className="text-right my-2">
            <span className="mx-4 my-1 border  border-light rounded-pill px-2 py-1"
              style={{ backgroundColor: "#D4E157" }}>level 1 </span> </div>
          <Card.Body style={{
            margin: '0em 0em', padding: "0.5em",
            background: `url(assets/images/icon/${imgURL[1]})  no-repeat bottom right`,
          }}>

            <div className="py-2">
              <Card.Title style={{ margin: "0em", padding: "0em 0em", fontSize: globalTheme.fontSize ? `calc(1em + ${globalTheme.fontSize - 92}%)` : '1em', fontWeight: 600, color: "#aa671d" }}>
                Name
              </Card.Title>
              <Card.Text style={{ margin: "0em", padding: "0em", fontWeight: 600, fontSize: globalTheme.fontSize ? `calc(0.8em + ${globalTheme.fontSize - 92}%)` : '0.8em' }} className="mb-2">
                {name_1 || name || '-'}
              </Card.Text>

              <Card.Title style={{ margin: "0em", padding: "0em 0em", fontSize: globalTheme.fontSize ? `calc(1em + ${globalTheme.fontSize - 92}%)` : '1em', fontWeight: 600, color: "#aa671d" }}>
                Email Id
              </Card.Title>
              <Card.Text style={{ margin: "0em", padding: "0em", fontWeight: 600, fontSize: globalTheme.fontSize ? `calc(0.8em + ${globalTheme.fontSize - 92}%)` : '0.8em' }} className="mb-2">
                {(email_1 !== 'NULL' && email_1) || '-'}
              </Card.Text>


              <Card.Title style={{ margin: "0em", padding: "0em 0em", fontSize: globalTheme.fontSize ? `calc(1em + ${globalTheme.fontSize - 92}%)` : '1em', fontWeight: 600, color: "#aa671d" }}>
                Mobile No
              </Card.Title>
              <Card.Text style={{ margin: "0em", padding: "0em", fontWeight: 600, fontSize: globalTheme.fontSize ? `calc(0.8em + ${globalTheme.fontSize - 92}%)` : '0.8em' }} className="mb-2">
                {(contact_1 !== 'NULL' && contact_1) || '-'}
              </Card.Text>

              <Card.Title style={{ margin: "0em", padding: "0em 0em", fontSize: globalTheme.fontSize ? `calc(1em + ${globalTheme.fontSize - 92}%)` : '1em', fontWeight: 600, color: "#aa671d" }}>
                Address
              </Card.Title>
              <Card.Text style={{ margin: "0em", padding: "0em", fontWeight: 600, fontSize: globalTheme.fontSize ? `calc(0.8em + ${globalTheme.fontSize - 92}%)` : '0.8em' }} className="mb-2">
                {(address_line_1 !== 'NULL' && address_line_1) || '-'}
              </Card.Text>
            </div>
          </Card.Body>
        </Card>
      </CardWrapper>}

      {((address_line_2 && address_line_2 !== 'NULL') || (contact_2 && contact_2 !== 'NULL') || (email_2 && email_2 !== 'NULL')) && <CardWrapper>
        <Card style={{
          width: '20rem', borderRadius: '2em', padding: '1em',
          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",

        }} className={'mx-4 my-2'}>
          <div className="text-right my-2">
            <span className="mx-4 my-1 border  border-light rounded-pill px-2 py-1"
              style={{ backgroundColor: "#D4E157" }}>level 2 </span> </div>
          <Card.Body style={{
            margin: '0em 0em', padding: "0.5em",
            background: `url(assets/images/icon/${imgURL[2]})  no-repeat bottom right`,
          }}>

            <div className="py-2">
              <Card.Title style={{ margin: "0em", padding: "0em 0em", fontSize: globalTheme.fontSize ? `calc(1em + ${globalTheme.fontSize - 92}%)` : '1em', fontWeight: 600, color: "#aa671d" }}>
                Name
              </Card.Title>
              <Card.Text style={{ margin: "0em", padding: "0em", fontWeight: 600, fontSize: globalTheme.fontSize ? `calc(0.8em + ${globalTheme.fontSize - 92}%)` : '0.8em' }} className="mb-2">
                {name_2 || name || '-'}
              </Card.Text>

              <Card.Title style={{ margin: "0em", padding: "0em 0em", fontSize: globalTheme.fontSize ? `calc(1em + ${globalTheme.fontSize - 92}%)` : '1em', fontWeight: 600, color: "#aa671d" }}>
                Email Id
              </Card.Title>
              <Card.Text style={{ margin: "0em", padding: "0em", fontWeight: 600, fontSize: globalTheme.fontSize ? `calc(0.8em + ${globalTheme.fontSize - 92}%)` : '0.8em' }} className="mb-2">
                {(email_2 !== 'NULL' && email_2) || '-'}
              </Card.Text>


              <Card.Title style={{ margin: "0em", padding: "0em 0em", fontSize: globalTheme.fontSize ? `calc(1em + ${globalTheme.fontSize - 92}%)` : '1em', fontWeight: 600, color: "#aa671d" }}>
                Mobile No
              </Card.Title>
              <Card.Text style={{ margin: "0em", padding: "0em", fontWeight: 600, fontSize: globalTheme.fontSize ? `calc(0.8em + ${globalTheme.fontSize - 92}%)` : '0.8em' }} className="mb-2">
                {(contact_2 !== 'NULL' && contact_2) || '-'}
              </Card.Text>

              <Card.Title style={{ margin: "0em", padding: "0em 0em", fontSize: globalTheme.fontSize ? `calc(1em + ${globalTheme.fontSize - 92}%)` : '1em', fontWeight: 600, color: "#aa671d" }}>
                Address
              </Card.Title>
              <Card.Text style={{ margin: "0em", padding: "0em", fontWeight: 600, fontSize: globalTheme.fontSize ? `calc(0.8em + ${globalTheme.fontSize - 92}%)` : '0.8em' }} className="mb-2">
                {(address_line_2 !== 'NULL' && address_line_2) || '-'}
              </Card.Text>
            </div>
          </Card.Body>
        </Card>
      </CardWrapper>}

      {((address_line_3 && address_line_3 !== 'NULL') || (contact_3 && contact_3 !== 'NULL') || (email_3 && email_3 !== 'NULL')) && <CardWrapper>
        <Card style={{
          width: '20rem', borderRadius: '2em', padding: '1em',
          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",

        }} className={'mx-4 my-2'}>
          <div className="text-right my-2">
            <span className="mx-4 my-1 border  border-light rounded-pill px-2 py-1"
              style={{ backgroundColor: "#D4E157" }}>level 3 </span> </div>
          <Card.Body style={{
            margin: '0em 0em', padding: "0.5em",
            background: `url(assets/images/icon/${imgURL[3]})  no-repeat bottom right`,
          }}>

            <div className="py-2">
              <Card.Title style={{ margin: "0em", padding: "0em 0em", fontSize: globalTheme.fontSize ? `calc(1em + ${globalTheme.fontSize - 92}%)` : '1em', fontWeight: 600, color: "#aa671d" }}>
                Name
              </Card.Title>
              <Card.Text style={{ margin: "0em", padding: "0em", fontWeight: 600, fontSize: globalTheme.fontSize ? `calc(0.8em + ${globalTheme.fontSize - 92}%)` : '0.8em' }} className="mb-2">
                {name_3 || name || '-'}
              </Card.Text>

              <Card.Title style={{ margin: "0em", padding: "0em 0em", fontSize: globalTheme.fontSize ? `calc(1em + ${globalTheme.fontSize - 92}%)` : '1em', fontWeight: 600, color: "#aa671d" }}>
                Email Id
              </Card.Title>
              <Card.Text style={{ margin: "0em", padding: "0em", fontWeight: 600, fontSize: globalTheme.fontSize ? `calc(0.8em + ${globalTheme.fontSize - 92}%)` : '0.8em' }} className="mb-2">
                {(email_3 !== 'NULL' && email_3) || '-'}
              </Card.Text>


              <Card.Title style={{ margin: "0em", padding: "0em 0em", fontSize: globalTheme.fontSize ? `calc(1em + ${globalTheme.fontSize - 92}%)` : '1em', fontWeight: 600, color: "#aa671d" }}>
                Mobile No
              </Card.Title>
              <Card.Text style={{ margin: "0em", padding: "0em", fontWeight: 600, fontSize: globalTheme.fontSize ? `calc(0.8em + ${globalTheme.fontSize - 92}%)` : '0.8em' }} className="mb-2">
                {(contact_3 !== 'NULL' && contact_3) || '-'}
              </Card.Text>

              <Card.Title style={{ margin: "0em", padding: "0em 0em", fontSize: globalTheme.fontSize ? `calc(1em + ${globalTheme.fontSize - 92}%)` : '1em', fontWeight: 600, color: "#aa671d" }}>
                Address
              </Card.Title>
              <Card.Text style={{ margin: "0em", padding: "0em", fontWeight: 600, fontSize: globalTheme.fontSize ? `calc(0.8em + ${globalTheme.fontSize - 92}%)` : '0.8em' }} className="mb-2">
                {(address_line_3 !== 'NULL' && address_line_3) || '-'}
              </Card.Text>
            </div>
          </Card.Body>
        </Card>
      </CardWrapper>}
    </>
  )
}
