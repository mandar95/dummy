import common from './common'

export default {
  // SUBMIT CLAIM
  submit_claim: {
    mobile_no: common.mobile,
    email: {
      min: 5,
      max: 100
    },
    doctor: {
      min: 2,
      max: 100,
      regex: common.doctor_name.regex
    },
    hospital_name: {
      min: 2,
      max: 300
    },
    hospital_address: {
      min: 2,
      max: 200
    },
    reason: {
      min: 2,
      max: 200,
      regex: common.alphabets
    },
    disease: {
      min: 2,
      max: 200,
      regex: common.alphabets
    },
    bill_no: {
      min: 2,
      max: 40,
      regex: common.aplhaNumeric
    },
    claim_amt: {
      min: 1,
      max: 99999999,
      length: 8
    },
    comment: {
      min: 1,
      max: 200,
      regex: common.alphabets
    },
    file: {
      name_length: 100,
      type: common.file(['jpg', 'jpeg', 'pdf', 'png'])
    },
    pincode: common.pincode
  },

  // REIMBURSEMENT CASHLESS CLAIM
  reimb_cashless_claim: {
    mobile_no: common.mobile,
    email: {
      min: 5,
      max: 100
    },
    doctor: {
      min: 2,
      max: 200,
      regex: common.doctor_name.regex
    },
    hospital_name: {
      min: 2,
      max: 300
    },
    hospital_address: {
      min: 2,
      max: 200
    },
    admitted_for: {
      min: 2,
      max: 100,
      regex: common.alphabets
    },
    remark: {
      min: 2,
      max: 200,
      regex: common.alphabets
    },
    estimated_claim: {
      min: 1,
      max: 99999999,
      length: 8
    },
    file_no: {
      min: 1,
      max: 40,
      regex: common.aplhaNumeric
    }
  },

  // USER MANAGMENT
  onboard: {
    name: {
      min: 2,
      max: 200,
      regex: common.alphabets
    },
    email: {
      min: 5,
      max: 100
    },
    contact: common.mobile,
    PAN: common.PAN,
    GST: common.GST,
    employee_code: {
      length: 10,
      regex: common.aplhaNumeric
    },
    logo: common.file(['jpg', 'jpeg', 'png']),
    address_line: common.address,
    pincode: common.pincode
  },
  user: {
    name: {
      min: 2,
      max: 200,
      regex: common.alphabets
    },
    email: {
      min: 5,
      max: 100
    },
    contact: common.mobile,
  },
  module: {
    name: {
      min: 2,
      max: 40,
      regex: /^[a-zA-Z-\s]+$/
    },
    url: {
      min: 2,
      max: 100,
      // eslint-disable-next-line no-useless-escape
      regex: /^[a-zA-Z0-9-_\/]+$/ // Alphanumeric - _ /
    },
    icon: {
      min: 2,
      max: 40,
      regex: /^[a-zA-Z-\s]+$/
    },
    sequence: {
      min: 0,
      max: 999,
      length: 3
    }
  },

  // HELP
  help: {
    text: {
      length: 1000
    },
    faq: {
      question: 200,
      answer: 300,
      file: common.file(['xls', 'xlsx'])
    },
  },

  // NWH
  network_hospital: {
    name: 40,
    pincode: 6
  }
}
