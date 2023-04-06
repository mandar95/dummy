import React, { Fragment, useEffect, useReducer } from 'react';
import styled from 'styled-components';

import { Container, Card } from 'react-bootstrap';

import { loadContact } from './contact.us.action';
import { serializeError } from '../../utils';
import { Loader } from '../../components';
import { useSelector } from 'react-redux';
import { ContactComponent } from '.';
import classes from "./index.module.css";
const Typography = styled.div`
  margin : 2em 0.5em 0em 0.5em;
  font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(1.2em + ${fontSize - 92}%)` : '1.2em'};
  display : inline-block;
`;
const Marker = styled.div`
display : inline-block;
height : 10px;
width : 10px;
border-radius : 50%;
background-color: ${({ theme }) => theme.PrimaryColors?.tableColor || '#d757f6'} ;
opacity : 0.9;
`
const Heading = styled.div`
margin : 0em 2em;
`;

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


const reducer = (state, { type, payload }) => {
  switch (type) {
    case 'GENERIC_UPDATE': return {
      ...state,
      ...payload
    }
    case 'ERROR': return {
      ...state,
      loading: false,
      error: serializeError(payload)
    }
    default: return state;
  }
}

const initialState = {
  loading: true,
  // details: { Broker: {}, Employer: {}, TPA: {}, Insurer: {} },
  details: [],
  other_details: {}
}

// const Types = {
//   'Broker': {
//     title: 'Broker',
//     type: 1,
//     data_key: 'broker'
//   },
//   'Employer': {
//     title: 'Employer',
//     type: 3,
//     data_key: 'employer'
//   },
//   'TPA': {
//     title: 'TPA',
//     type: 4,
//     data_key: 'tpa'
//   },
//   'Insurer': {
//     title: 'Insurer',
//     type: 2,
//     data_key: 'insurer'
//   }
// }



export const ContactUs = () => {

  const [{ details, loading, other_details }, dispatch] = useReducer(reducer, initialState);
  const { userType: userTypeName } = useSelector(state => state.login);


  useEffect(() => {
    if (userTypeName)
      loadContact(dispatch, userTypeName)

  }, [userTypeName]);


  return (
    <>
      <Container className="mt-4 mb-5">
        {details.map((elem) => {
          if (Array.isArray(elem)) {
            return elem.map(elem2 => <CardDetail elem={elem2} />)
          }
          else { return <CardDetail elem={elem} /> }
        })}
        <ContactComponent data={other_details} />
      </Container>
      {loading && <Loader />}
    </>
  )
}


const CardDetail = ({ elem }) => {
  elem.data.sort(function (a, b) {
    return a?.level - b?.level;
  });

  return !!elem.data.length &&
    <Fragment key={elem.type} >
      <Heading>
        <Marker />
        <Typography>{'\u00A0'}{elem.type} {elem.label !== 'null' ? ` - ${elem.label}` : ''}</Typography>
      </Heading>
      <div className={`${classes.autoscroll}`}>
        <div className="d-flex justify-content-start flex-nowrap">
          {elem.data.map((elem2) =>
            <ContactCard key={elem2.id} {...elem2} />
          )}
        </div></div>
    </Fragment>
}

const ContactCard = ({
  level,
  name,
  email,
  address,
  contact
}) => {

  const { globalTheme } = useSelector(state => state.theme)

  return (
    <CardWrapper>
      <Card style={{
        width: '20rem', borderRadius: '2em', padding: '1em',
        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",

      }} className={'mx-4 my-2'}>
        <div className="text-right my-2">
          <span className="mx-4 my-1 border  border-light rounded-pill px-2 py-1"
            style={{ backgroundColor: "#D4E157" }}>level {level} </span> </div>
        <Card.Body style={{
          margin: '0em 0em', padding: "0.5em",
          background: `url(assets/images/icon/${imgURL[1]})  no-repeat bottom right`,
        }}>

          <div className="py-2">
            <Card.Title style={{ margin: "0em", padding: "0em 0em", fontSize: globalTheme.fontSize ? `calc(1em + ${globalTheme.fontSize - 92}%)` : '1em', fontWeight: 600, color: "#aa671d" }}>
              Name
            </Card.Title>
            <Card.Text style={{ margin: "0em", padding: "0em", fontWeight: 600, fontSize: globalTheme.fontSize ? `calc(0.8em + ${globalTheme.fontSize - 92}%)` : '0.8em' }} className="mb-2">
              {(name !== 'NULL' && name) || '-'}
            </Card.Text>

            <Card.Title style={{ margin: "0em", padding: "0em 0em", fontSize: globalTheme.fontSize ? `calc(1em + ${globalTheme.fontSize - 92}%)` : '1em', fontWeight: 600, color: "#aa671d" }}>
              Email Id
            </Card.Title>
            <Card.Text style={{ margin: "0em", padding: "0em", fontWeight: 600, fontSize: globalTheme.fontSize ? `calc(0.8em + ${globalTheme.fontSize - 92}%)` : '0.8em' }} className="mb-2">
              {(email !== 'NULL' && email) || '-'}
            </Card.Text>


            <Card.Title style={{ margin: "0em", padding: "0em 0em", fontSize: globalTheme.fontSize ? `calc(1em + ${globalTheme.fontSize - 92}%)` : '1em', fontWeight: 600, color: "#aa671d" }}>
              Mobile No
            </Card.Title>
            <Card.Text style={{ margin: "0em", padding: "0em", fontWeight: 600, fontSize: globalTheme.fontSize ? `calc(0.8em + ${globalTheme.fontSize - 92}%)` : '0.8em' }} className="mb-2">
              {(contact !== 'NULL' && contact) || '-'}
            </Card.Text>

            <Card.Title style={{ margin: "0em", padding: "0em 0em", fontSize: globalTheme.fontSize ? `calc(1em + ${globalTheme.fontSize - 92}%)` : '1em', fontWeight: 600, color: "#aa671d" }}>
              Address
            </Card.Title>
            <Card.Text style={{ margin: "0em", padding: "0em", fontWeight: 600, fontSize: globalTheme.fontSize ? `calc(0.8em + ${globalTheme.fontSize - 92}%)` : '0.8em', whiteSpace: 'pre-line' }} className="mb- 2">
              {(address !== 'NULL' && address) || '-'}
            </Card.Text>
          </div>
        </Card.Body>
      </Card>
    </CardWrapper >
  )
}
