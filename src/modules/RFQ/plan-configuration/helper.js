import React from 'react';
import { BasicDetails, ProductFeature, BucketDetails, RaterDetails, FamilyDetail } from "./steps";

export const components = [
  <BasicDetails />,
  <FamilyDetail />,
  <BucketDetails />,
  <ProductFeature />,
  <RaterDetails />
];

export const formIds = [
  "basic-details-form",
  "family-details-form",
  "premium-details-form",
  "hr-details-form",
  "additional-details-form"
];

export class FormConfig {
  constructor(config = {}, formId = '') {
    this.id = config.id;
    this.content = config.content;
    this.image = config.image;
    this.formId = formId;
    this.completed = false;
  }
}

export const steps = [
  { "id": 1, "content": "Enter RFQ Basic Details", "image": "/assets/images/step-icons/1.png" },
  { "id": 2, "content": "Select Family Construct & Add respective Family members", "image": "/assets/images/step-icons/5.png" },
  { "id": 3, "content": "Select Industries Bucket & their Risk Factor", "image": "/assets/images/step-icons/3.png" },
  { "id": 4, "content": "Add Product Features & thier Sum-Insureds & Premiums", "image": "/assets/images/step-icons/4.png" },
  { "id": 5, "content": "Please set Policy Rates as you are on rater screens", "image": "/assets/images/step-icons/7.png" }
];

// export const ExcludeSumIns = [
//   33,//Inpatient Treatment (24 Hours)
//   15,//Pre
//   16,//Post
//   14,//Maternity Cover,
//   4,// New Born Baby
//   2,//First 30 day waiting period
//   20,//Specific Diseases waiting period
//   1,//Pre existing diseases,
//   18,//Pre Natal
//   19,//Post Natal
//   39,//Terrorism
//   40, 41, 42, 43, 44, 45, 52, 53, 54, 55
// ]

// export const noYearOption = [
//   15,//Pre Hosp
//   16,//Post Hosp
//   18,//Pre Natal
//   19,//Post Natal
// ]

export const noMultipleAdd = [
  // 33,//Inpatient Treatment (24 Hours)
  // 14,// Maternity Cover  
  // 2,//First 30 day waiting period
  // 39,//Terrorism
  // 40, 41, 42, 43, 44, 45, 52, 53, 54, 55
]

// 14 Maternity Cover
export const MaternityDependence = [
  // 17/*Maternity Limit*/,
  // // 4/*New Born Baby Cover*/,
  // 18/*Pre natal*/,
  // 19/*Post natal*/,
]

// Family

export const mergeRelation = {
  1: 'Self',
  2: 'Spouse',
  3: 'Children',
  5: 'Parents',
  7: 'Parents in law',
  9: 'Siblings'
}

export const getRelationName = (relations, current_relation_id) => {
  if (current_relation_id >= 3 && current_relation_id <= 8) {
    return mergeRelation[current_relation_id]
  }
  return relations.find((elem) =>
    elem.id === current_relation_id)?.name
}

export const sortRelation = (relations) => {
  let storeRelation = []
  for (let relation of relations) {
    if ([4, 6, 8].includes(relation.id)) {

    } else if ([3, 5, 7].includes(relation.id)) {
      storeRelation.push({ ...relation, name: mergeRelation[relation.id] })
    } else {
      storeRelation.push(relation)
    }
  }
  return storeRelation
}

export const refillRelations = (ages) => {
  let storeRelation = []
  for (let age of ages) {
    if ([4, 6, 8].includes(Number(age?.relation_id))) {

    } else if ([3, 5, 7].includes(Number(age?.relation_id))) {
      if (Number(age.relation_id) === 3 && age.no_of_relation) {
        distrubuteChildAge(age, storeRelation)
      } else {
        storeRelation.push(age)
        storeRelation.push({ ...age, relation_id: Number(age?.relation_id) + 1 })
      }
      // storeRelation.push(age)
      // storeRelation.push({ ...age, relation_id: Number(age?.relation_id) + 1 })
    } else {
      storeRelation.push(age)
    }
  }
  return storeRelation
}

export const relationImages = {
  1: '/assets/images/RFQ/Employee.png',
  2: '/assets/images/RFQ/Spouse.png',
  3: '/assets/images/RFQ/Children.png',
  5: '/assets/images/RFQ/Parent.png',
  7: '/assets/images/RFQ/Parent.png',
}

export const sortRelationCustomer = (relations) => {
  let storeRelation = []
  for (let relation of relations) {
    if ([4, 6, 8].includes(relation.relation_id) || relation.relation_id > 8) {

    } else if ([3, 5, 7].includes(relation.relation_id)) {
      storeRelation.push({
        id: relation.relation_id,
        content: mergeRelation[relation.relation_id],
        imgSrc: relationImages[relation.relation_id]
      })
    } else {
      storeRelation.push({
        id: relation.relation_id,
        content: relation.relation_name === "Self" ? 'Employee only' : relation.relation_name,
        imgSrc: relationImages[relation.relation_id] || '/assets/images/RFQ/Employee.png'
      })
    }
  }
  return storeRelation
}


export const refillRelationsCustomer = (relation_ids) => {
  let storeRelation = []
  for (let id of relation_ids) {
    if ([4, 6, 8].includes(Number(id))) {

    } else if ([3, 5, 7].includes(Number(id))) {
      storeRelation.push(id)
      storeRelation.push(Number(id) + 1)
    } else {
      storeRelation.push(id)
    }
  }
  return storeRelation
}

const distrubuteChildAge = (age, storeRelation) => {
  let divider1 = age.no_of_relation / 2
  let divider2 = Math.floor(age.no_of_relation / 2)
  if (divider1 > divider2) {
    storeRelation.push({ ...age, no_of_relation: (divider1 + 0.5) })
    storeRelation.push({ ...age, relation_id: Number(age?.relation_id) + 1, no_of_relation: divider2 ? 1 : divider2 })
  }
  else {
    storeRelation.push({ ...age, no_of_relation: divider1 })
    storeRelation.push({ ...age, relation_id: Number(age?.relation_id) + 1, no_of_relation: divider1 })
  }
}

export const getChildAge = (rfqData) => {
  let _rfqData = Array.isArray(rfqData) ? rfqData : rfqData?.relations
  let childAge = []
  for (let i = 0; i < _rfqData.length; i++) {
    if (_rfqData[i]?.relation_id === 3) {
      childAge.push({
        age: _rfqData[i].no_of_relation + _rfqData[i + 1].no_of_relation
      })
    }
  }
  return childAge[0].age
}
