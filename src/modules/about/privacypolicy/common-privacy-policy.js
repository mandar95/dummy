import React from 'react';
import { BoldDiv, ContentDiv } from './privacy';

const StoreData = {
  'K.M. Dastur Reinsurance Brokers Pvt. Ltd.': {
    brokerShortName: 'KMD',
    address: 'Cambata Building, 42 Maharshi Karve Marg, Mumbai – 400020, MH, India',
    contactURL: 'https://kmdastur.com/contact-us-2'
  },
  'Ace Insurance Brokers (P) Limited.': {
    brokerShortName: 'ACE',
    address: 'B-17 Ashadeep Building, 9 Hailey Road, New Delhi- 110001',
    contactURL: 'https://www.aceinsuranceindia.com/Contact_Us.html'
  }
}

export const CommonPrivacyPolicy = ({ BROKER_NAME }) => {
  const currentWebsiteUrl = window.location.origin
  return (<>
    <div className="row">
      <ContentDiv>Thank you for visiting <a href={currentWebsiteUrl}>{currentWebsiteUrl.replace('https://', '').replace('http://', '')}</a>.
        By continuing to access this website (<a href={currentWebsiteUrl}>{currentWebsiteUrl.replace('https://', '').replace('http://', '')}</a>) and/or by availing the services offered herein,
        or  on any corresponding associate software applications (including mobile application) of ours
        (collectively, “<strong>website</strong>”), operated by {BROKER_NAME}  ("<strong>{StoreData[BROKER_NAME].brokerShortName}</strong>", "<strong>we</strong>", "<strong>us</strong>" or  "<strong>our</strong>"),
        you confirm that you have read, understood, and agreed with and consent to our  Privacy Policy (“<strong>Policy</strong>”), as may be modified or added
        from time to time, without any limitation, prior notice or qualification. By agreeing and consenting to the
        Policy, you consent to collection, storage, processing, handling, use, disclosure and transfer of personal
        information (including sensitive personal data / information) by {StoreData[BROKER_NAME].brokerShortName}, in accordance with this Policy and as
        permitted under applicable laws including but not limited to the Information Technology Act, 2000 and the
        rules thereunder.</ContentDiv>

      <BoldDiv className='mt-5'><strong>Personal Information</strong></BoldDiv>
      <ContentDiv>This Policy governs our relationship with you (“<strong>User</strong>”,  "<strong>you</strong>" or "<strong>your</strong>"), in terms of how we deal with your
        personal information (including sensitive personal data or information) that you may submit and/or that we
        may have access to by your use of the website. Your personal information that is provided to or collected
        by us under this Policy, will be stored {StoreData[BROKER_NAME].brokerShortName} ({BROKER_NAME}, a company
        incorporated in India and having its registered office at {StoreData[BROKER_NAME].address}) and any other person authorized by {StoreData[BROKER_NAME].brokerShortName}, from time to time.</ContentDiv>

      <BoldDiv className='mt-5'><strong>Collection of Personal Information</strong></BoldDiv>
      <ContentDiv>Your use of this website may require you to submit your personal information (including sensitive personal
        data / information), such as your name, address, contact details, gender, marital status, date of birth,
        personal identification numbers, your relationship to the policyholder, insured or claimant, medical records
        or photographs, financial information and occupation details. We reserve our right to terminate your
        account on the website or to refuse access to you to the products and services available on the website or
        to our website at any time if such information is found to be inaccurate. You agree that in addition to the
        information that you may expressly submit, the browser and/or cookies may collect certain information
        including such as your personal behaviour and your buying habits.</ContentDiv>
      <ContentDiv>You may choose not to provide us any personal information, even though such information might be
        essential to access our website and/or to avail any product or service, in which case you may not be able
        to avail certain aspects or features of the website or some of the products or services. You will, at all
        times, have an option to withdraw your consent to such collection of information by ceasing to use the
        website.</ContentDiv>

      <BoldDiv className='mt-5'><strong>Use of Personal Information </strong></BoldDiv>
      <ContentDiv>We do not sell any personal information of our Users. You agree that we may use all or any of such
        personal information for any purposes necessary or connected with providing you our products and
        services, to develop, manage or improve our products and services, to provide you customer support
        service, to personalize your user experience on the website or for our products and services, to conduct
        any research or analysis related to our products and services, to send you communications (including
        updates / changes, information about transactions / activities on the website, marketing and promotional
        communication, or any other information that {StoreData[BROKER_NAME].brokerShortName} or any authorized third party service provider may
        choose to communicate to you from time to time) through any mode of communication (including push
        notifications), to prevent fraud or to process payments.</ContentDiv>

      <BoldDiv className='mt-5'><strong>Sharing of Personal Information</strong></BoldDiv>
      <ContentDiv>You agree that we may share all or any of such personal information any of our companies, including our
        parent company, our affiliates, subsidiaries, insurance service providers or insurers, authorized third party
        suppliers or vendors, operating systems and platforms, regulatory bodies or to any such person as we
        may be required by law to share such information with. While sharing your personal information with a
        third-party service provider, we will ensure that such third party is subject to this Policy and/or follow
        practices at least as protective as those described under this Policy.</ContentDiv>
      <ContentDiv>Your password, medical records and financial details (including details regarding your bank account or
        credit card or debit card or any other payment instrument), are your sensitive personal data / information
        and we shall not disclose the same to anyone. However, we do not assume responsibility for any hacked
        passwords or financial information. Thus, if you share your password or your financial information with
        others, or your account is hacked, you are responsible for all actions taken in the name of your account.
        Further, by making any online financial transaction on our website, you represent and warrant that you
        have the right to use any such credit card, bank or other payment instrument related login details that you
        submit for your transaction and by submitting such information you acknowledge and agree that we may
        share any such information with a third party for the purposes of facilitating or processing the online /
        electronic financial transaction.</ContentDiv>

      <BoldDiv className='mt-5'><strong>Storage of Personal Information</strong></BoldDiv>
      <ContentDiv>We store information as per the applicable laws. However, we store your account information until you ask
        us to delete such information. If you ever decide to stop using the website, you can just ask us to delete
        your account and your personal information associated with your account.</ContentDiv>

      <BoldDiv className='mt-5'><strong>Control  over your Personal Information</strong></BoldDiv>
      <ContentDiv>We provide you with the right to access, updation or correction of your information. You can access and
        edit your personal information [in your account on the website or by contacting us].</ContentDiv>

      <BoldDiv className='mt-5'><strong>Security of Personal Information</strong></BoldDiv>
      <ContentDiv>We implement reasonable security practices and procedures, in terms of the requirements of the
        applicable laws, including but not limited to the Information Technology Act, 2000 and the rules
        thereunder. We have a comprehensive documented information security programme and information
        security policies that contain managerial, technical, operational and physical security control measures
        that are commensurate with respect to the personal information being collected and the nature of our
        business.</ContentDiv>
      <ContentDiv>Further, we protect the security of your personal information across the whole website by using servers
        that have Secure Sockets Layer (SSL) certificate installed, which encrypts information you input and
        prevents unauthorized access of such information to or from a private network. Additionally, we also
        maintain the security of your information according to the International Standard IS/ISO/IEC 27001 on
        "Information Technology Security Techniques Information Security Management System-Requirements".</ContentDiv>

      <BoldDiv className='mt-5'><strong>Third Party Websites</strong></BoldDiv>
      <ContentDiv>The website may contain links to external web sites not maintained by us, including websites of other
        insurance companies / insurers, whose products may be listed on our website. In using such links, you
        should be aware that we cannot be held responsible for the collection and usage of personal information
        on and data protection practices of such websites. Please consult the privacy policies of the relevant
        websites should you have questions regarding their use.</ContentDiv>

      <BoldDiv className='mt-5'><strong>Content</strong></BoldDiv>
      <ContentDiv>You acknowledge that by using our products and services, you are granted a limited right to access the
        content, information and materials that are available on our website and you do not own or have any rights
        to such content, information and/or materials. Therefore, any such content, information or materials as is
        proprietary to us, cannot be used by you in any manner whatsoever, except to the extent of accessing and
        viewing on our website, without our express written consent.</ContentDiv>
      <ContentDiv>For the content or information that you may submit to us, you represent that you own all rights, whether in
        the nature of copyrights or other intellectual property rights in such content or information, and that you are
        authorized to publish the same and you hereby grant a us a worldwide, non-exclusive and non-revocable
        license to share, publish, host or otherwise use such content, or allow it to be used in any manner
        whatsoever, without any further permission from you.</ContentDiv>
      <ContentDiv>You agree that you shall not use our website or any of our products and services to upload or
        communicate any information or content that is in any manner derogatory, or is otherwise threatening,
        abusive, vulgar, objectionable or illegal in any manner. You agree that you shall not distribute or post
        spam, unsolicited or bulk electronic communications. You further agree that you shall not distribute
        viruses or other technological programs that may harm our systems or attempt to circumvent them in any
        ways. You agree that you shall not use the website in any manner which may, intentionally or
        unintentionally, violate any applicable laws.</ContentDiv>

      <BoldDiv className='mt-5'><strong>Disclaimer</strong></BoldDiv>
      <ContentDiv>To the fullest extent permissible pursuant to applicable law, all materials and resources on our website are
        provided to you on the basis as they exist and we shall not be held responsible in case of any failure to
        store or deliver content, information or other materials across networks. We disclaim all warranties,
        express or implied, including, but not limited to, any implied warranties of merchantability and fitness for a
        particular purpose or non-infringement. We do not represent or warrant that the functions contained in the
        website will be uninterrupted or error-free, that the defects will be corrected, or that the website or the
        server that makes the website available is free of viruses or other harmful components.</ContentDiv>
      <ContentDiv>You agree that you shall not hold us liable for any special or consequential damages that result from the
        use of, or the inability to use, the materials and resources on the website or the performance of the
        products listed thereon. You agree to indemnify us, and hold harmless from and against any and all
        losses, liabilities, expenses, damages, and costs, including any litigation fees, arising or resulting from
        your use of this website or any violation of this Policy.</ContentDiv>

      <BoldDiv className='mt-5'><strong>Grievances</strong></BoldDiv>
      <ContentDiv>
        If you have any concerns regarding your privacy or your personal information or would like to address your
        grievances in connection with this Policy, please contact us at, with a detailed description of the issue, visit
        the below Website for more info :<br />
        <a href={StoreData[BROKER_NAME].contactURL}>{StoreData[BROKER_NAME].contactURL}</a>

      </ContentDiv>

      <BoldDiv className='mt-5'><strong>Applicable  law</strong></BoldDiv>
      <ContentDiv>You understand that we provide our products and services on the website that are specific to India and by
        your accessing our website from any other country, will not make us subject to the laws or jurisdiction of
        such country and that we will always remain subject to laws of India for any dispute or claim. The courts at
        New Delhi will have exclusive jurisdiction in relation to any disputes or claims arising from this Policy.</ContentDiv>

      <BoldDiv className='mt-5'><strong>Termination</strong></BoldDiv>
      <ContentDiv>You agree that we may suspend or terminate your use of the materials and resources at our website at
        any time, for any reason, and without any prior notice. Your use of this website remains at our sole
        discretion.</ContentDiv>

      <br />
      <br />
      <br />
    </div>
  </>)
}
