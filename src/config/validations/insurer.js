import common from './common'

export default {
  plan_config: {
    plan_name: {
      min: 2,
      max: 200,
      regex: common.alphabets
    },
    ic_name: {
      min: 2,
      max: 200,
      regex: common.alphabets
    },
    // policy_sub_type: {},
    // policy_type: {},
    max_no_of_employee: {
      min: 50,
      max: 99999999,
      length: 8
    },
    co_oprate_buffer: {
      min: 0,
      max: 100,
      length: 3

    },
    co_pay_percentage: {
      min: 0,
      max: 100,
      length: 3
    },
    max_discount: {
      min: 0,
      max: 100,
      length: 3
    },
    plan_description: {
      length: 800
    },
    risk_factor: {
      min: 0,
      max: 150,
      length: 3
    },
    sum_prem: {
      min: 1,
      max: 99999999,
      length: 8
    },
    pre_post_days: {
      min: 1,
      max: 90,
      length: 2
    },
    room_prem: {
      max: 99999999,
      length: 8
    },
    file: common.file(['xls', 'xlsx'])
  },
  industry_bucket: {
    name: {
      min: 2,
      max: 200,
      regex: common.alphabets
    }
  },
  documents: {
    name: {
      min: 2,
      max: 100,
      regex: common.alphabets
    },
    file: common.file(['pdf'])
  },
  insurance: {
    name: {
      min: 2,
      max: 200,
      regex: common.alphabets
    },
    // file: common.file(['jpg'], ['jpeg'], ['png'])
    file: common.file(['jpg', 'jpeg', 'png', 'svg', 'gif'])
  },
  query_complaint: {
    name: {
      length: 80,
      // eslint-disable-next-line no-useless-escape
      regex: /^[a-zA-Z0-9-\\\/\s]+$/ // Alphanumeric - \ /
    },
    reply: 50
  },
  faq: {
    question: 200,
    answer: 250,
    file: common.file(['xls', 'xlsx'])
  },
  profile: {
    name: {
      min: 2,
      max: 200,
      regex: common.alphabets
    },
    email: {
      min: 5,
      max: 100,
    },
    contact_no: common.mobile,
    address_line: common.address,
    pincode: common.pincode,
    PAN: common.PAN,
    GST: common.GST,
    file: common.file(['jpg'], ['jpeg'], ['png'])
  }
}
