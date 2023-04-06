import RFQHome from './home/home'

import QCR from './home/steps/quote-slip/QCR';
export * from './home/steps/quote-slip/placement-slip/QuoteDetails';
export * from './home/steps/quote-slip/placement-slip/CreateQuote';
export * from './home/steps/quote-slip/placement-slip/ViewQuoteDetail';

// export * from './select-plan/SelectPlan';
export * from './data-upload';
export * from './plan-configuration/Configuration';
export * from './approve-rfq/ApproveRFQ';
export * from './uw-quote-view/uw-quote-view';
export * from './uw-quote-view/quote-view';
export * from './uw-quote-view/plan-view';
export * from './bucket-config/bucket-config';
// export * from './reports/reports';
export * from './work-flow/work-flow';
export * from './work-flow/list-view';
export * from './user-list-view/list-view';
export { default as FeatureConfig } from './feature-config/Features'
export { default as EditFeature } from './feature-config/CreateFeature'

export {
  RFQHome,
  QCR
}
