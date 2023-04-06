export default {
  alphabets: /^([A-Za-z\s])+$/,
  aplhaNumeric: /^[a-zA-Z0-9\s]+$/,
  mobile: {
    length: 10,
    regex: /^[6-9][0-9]{9}$/
  },
  address: {
    min: 8,
    max: 100
  },
  pincode: {
    length: 6,
    regex: /^[1-9][0-9]{5}$/
    //regex:/^[1-9]{1}[0-9]{2}\\s{0, 1}[0-9]{3}$/
  },
  doctor_name: {
    regex: /^([A-Za-z.\s])+$/
  },
  file: (type) => ({
    accept: type.map((value) => '.' + value).join(', '),
    description: `File Formats: ${type.join(', ')}`
  }),
  PAN: {
    length: 10,
    regex: /[a-zA-Z]{3}[PCHFATBLJG]{1}[a-zA-Z]{1}[0-9]{4}[a-zA-Z]{1}$/
  },
  GST: {
    length: 15,
    regex: /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/
  },
  fileType: [
    '.xls',
    '.xlsx',
    '.jpg',
    '.png',
    '.jpeg',
    '.svg',
    '.tiff',
    '.eml',
    '.msg',
    '.pdf',
    '.gif',
    '.doc',
    '.docx',
    '.csv',
    '.ppt',
    '.pptx',
  ]
}
