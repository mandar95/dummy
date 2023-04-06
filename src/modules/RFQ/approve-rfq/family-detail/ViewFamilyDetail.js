import React from 'react';

import { Button } from "components";
import { Row, Col, Table } from 'react-bootstrap';
import { sortRelation } from 'modules/RFQ/plan-configuration/helper';


export const ViewFamilyDetail = ({ rfqData, style, nextPage, options }) => {

  const filteredRelation = sortRelation(options.relations);
  let _memberCount = filteredRelation?.map((elem) => rfqData?.relations.find(({ relation_id }) => Number(relation_id) === Number(elem.id))).filter(Boolean)

  return (
    <>
      {/* Table */}
      <Table className="text-center" style={style.Table} responsive>
        <thead >
          <tr style={style.HeadRow}>
            <th style={style.TableHead} scope="col">Family Relation </th>
            {rfqData?.relations?.some((person) => person.max_age || person.min_age) &&
              <>
                <th scope="col">Min Age</th>
                <th scope="col">Max Age</th>
              </>}
            <th scope="col">Age Limit</th>
            <th scope="col">No Of Relation</th>
          </tr>
        </thead>
        <tbody>
          {_memberCount?.map((person, index) => {
            let getName = filteredRelation.find(({ id }) => id === person.relation_id)?.name
            let getRelationName = person.relation_id === 1 ? 'Self' : getName
            return <tr key={index + 'relations'}>
              {/* <th scope="row">{person.relation_name}</th> */}
              {getRelationName && <th scope="row">{getRelationName}</th>}
              {(rfqData?.relations?.some((person) => person.max_age || person.min_age) && (<td>{person.no_of_relation}</td>)) &&
                <>
                  <td>{(person.min_age || person.min_age === 0) ? `${person.min_age} Yrs` : "-"}</td>
                  <td>{person.max_age ? `${person.max_age} Yrs` : "-"}</td>
                </>}
              {getName && <td>{person.max_age ? "Yes" : "No"}</td>}
              {getName && <td>{(person.relation_id === 3)
                ? (person.no_of_relation + rfqData?.relations[index + 1].no_of_relation)
                : person.no_of_relation}</td>}
            </tr>
          })
          }
        </tbody>
      </Table>

      <Row >
        <Col md={12} className="d-flex justify-content-end mt-4">
          <Button type="button" onClick={nextPage}>
            Next
          </Button>
        </Col>
      </Row>
    </>
  )
}
