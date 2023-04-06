/*
 * @desc: To Control Modules/Fetaures wrt ther Server Environment
 */

const REACT_APP_SERVER = process.env.REACT_APP_SERVER;

const Wellness_Partners = [
  {
    benefit_id: 177,
    wellness_partner_id: 131,
    label: 'PRISTYNE_CARE'
  },
  {
    benefit_id: 178,
    wellness_partner_id: 132,
    label: 'DOC_ONLINE'
  },
  {
    benefit_id: 179,
    wellness_partner_id: 133,
    label: 'VISIT'
  },
  {
    benefit_id: 180,
    wellness_partner_id: 134,
    label: 'MEDI_BUDDY'
  },
  {
    benefit_id: 181,
    wellness_partner_id: 135,
    label: 'MERA_DOC'
  },
  {
    benefit_id: 182,
    wellness_partner_id: 136,
    label: 'LYBRATE'
  },
  {
    benefit_id: 183,
    wellness_partner_id: 137,
    label: 'Connect_Heal'
  },
  {
    benefit_id: 185,
    wellness_partner_id: 139,
    label: '1MG'
  },
]


/* Stagged Fetaures
  - Enrolment Redirection
  - Self SI Update
  - ClaimSubType
*/

export const ModuleControl = {
  /*
    - Care Pre-Sales
    - Landing Page Mockup
    - CustomFont
    - CoInsurer
  */
  inDevelopment: ['DEVELOPMENT'].includes(REACT_APP_SERVER),

  /*
    - UCC Multi Broker
  */
  isFyntune: ['DEVELOPMENT', 'FYNTUNE_PRODUCTION'].includes(process.env.REACT_APP_SERVER),

  /*
    - Encrypt Depcrypt
    - DevTools Disbale
    - Session TimeOut
    - Direct Login
    - No OTP
    - No ReadAccess
  */
  isDevelopment: ['DEVELOPMENT'].includes(REACT_APP_SERVER),

  // Custom 🔨
  /*
    - Base + Topup
    - Employee Year Filter
    - JSON Copy Policy
  */
  CustomRelease: ['DEVELOPMENT', 'FYNTUNE_PRODUCTION',
    'HERO_UAT',
    'PALM_UAT',
    'HOWDEN_UAT',
    'TATA_UAT',
    'KMDASTUR_UAT',
    'ACE_UAT',
    'SPA_UAT',
    'UIB_UAT'].includes(REACT_APP_SERVER),

  NewBrokerDashboard: ['DEVELOPMENT', 'FYNTUNE_PRODUCTION',
    "PALM_UAT", "PALM_PRODUCTION",
    'KMDASTUR_UAT', 'KMDASTUR_PRODUCTION'].includes(REACT_APP_SERVER),

  NewFlexProceedDesign: ['DEVELOPMENT',
    'TATA_UAT',/*  'TATA_PRODUCTION', */
    'PALM_UAT', 'PALM_PRODUCTION'].includes(REACT_APP_SERVER),

  FlexSummaryTooltip: ['DEVELOPMENT', 'FYNTUNE_PRODUCTION',
    'TATA_UAT'].includes(REACT_APP_SERVER),

  DataToSend: ['DEVELOPMENT', 'FYNTUNE_PRODUCTION',
    'HERO_UAT',
    'PALM_UAT', 'PALM_PRODUCTION',
    'HOWDEN_UAT', 'HOWDEN_PRODUCTION',
    'TATA_UAT',
    'KMDASTUR_UAT',
    'ACE_UAT',
    'SPA_UAT',
    'UIB_UAT'].includes(REACT_APP_SERVER),

  TwoFactorAuthentication: {
    onlySms: [].includes(REACT_APP_SERVER),
    onlyEmail: ['SPA_UAT', 'SPA_PRODUCTION',
      'UIB_UAT', 'UIB_PRODUCTION'].includes(REACT_APP_SERVER),
    both: ['DEVELOPMENT',
      'KMDASTUR_UAT', 'KMDASTUR_PRODUCTION'].includes(REACT_APP_SERVER),
    allowed: ['DEVELOPMENT',
      'KMDASTUR_UAT', 'KMDASTUR_PRODUCTION',
      'SPA_UAT', 'SPA_PRODUCTION',
      'UIB_UAT', 'UIB_PRODUCTION'].includes(REACT_APP_SERVER)
  },

  GoogleMapIntegration: [
    "PALM_UAT", "PALM_PRODUCTION",
    'ACE_UAT', 'ACE_PRODUCTION',
    'UIB_UAT', 'UIB_PRODUCTION',].includes(process.env.REACT_APP_SERVER),

  // Howden 🥲
  /*
    - Udaan, Rakuten, Persisten & Pearson Custom Logics
    - SMS API RFQ OTP
    - Template BG-White
    - Old Migraion
    - E-Card Message Update
    - Flex Topup Name
  */
  isHowden: ['HOWDEN_UAT', 'HOWDEN_PRODUCTION', 'DEVELOPMENT'].includes(REACT_APP_SERVER),
  Azure: [].includes(REACT_APP_SERVER),
  HideOldFlex: ['HOWDEN_UAT', 'DEVELOPMENT'].includes(REACT_APP_SERVER),

  // TMIBASL 👋🏻
  /*
    - No Salary Shown in Instalments
    - Adopted/Special File Non-Mandatory
    - Flex Summary Old
    - No Bank Detail
  */
  isTATA: ["TATA_UAT", "TATA_PRODUCTION"].includes(REACT_APP_SERVER),


  // Hero 🦸🏻‍♂️
  isHero: ['HERO_UAT', 'HERO_PRODUCTION'].includes(REACT_APP_SERVER),
  Heaps: ['HERO_UAT', 'HERO_PRODUCTION'].includes(REACT_APP_SERVER),
  PlanHospitalization: ["FYNTUNE_PRODUCTION", "DEVELOPMENT", "HERO_UAT", "HERO_PRODUCTION",].includes(REACT_APP_SERVER),


  // Palm 🌴
  ChatBot: ['DEVELOPMENT', 'FYNTUNE_PRODUCTION', 'PALM_UAT', 'PALM_PRODUCTION'].includes(REACT_APP_SERVER),
  UserManual: ["PALM_UAT", "PALM_PRODUCTION"].includes(process.env.REACT_APP_SERVER),


  /*
  - Hide Premium Employer Dashbaord 
  */
  // ACE ♠
  isACE: ['ACE_UAT', 'ACE_PRODUCTION'].includes(REACT_APP_SERVER),


  /*
  - Remove GST Barclays Global Service Centre Pvt Ltd
  */
  // UIB 📵
  isUIB: ['UIB_PRODUCTION'].includes(REACT_APP_SERVER),


  PrivacyPolicy: [
    'PALM_UAT', 'PALM_PRODUCTION',
    'KMDASTUR_UAT', 'KMDASTUR_PRODUCTION',
    'ACE_UAT', 'ACE_PRODUCTION'
  ].includes(REACT_APP_SERVER),

  Wellness_Partners

}



