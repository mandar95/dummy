export const _createOtherMemberData = (company_data, relationListData) => relationListData
  .filter(({ relation_id }) => relation_id > 8 && company_data?.family_type.includes(relation_id))
  .map((item) => ({ id: item?.relation_id, value: item?.relation_id, label: item?.relation_name, ...item }))