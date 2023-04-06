import React from 'react';

export const onChangeHandler = (e, obj) => {
    let isTrue = (obj.watch(e.target.name));
    let ID = e.target.id
    let filterData = obj.finalDeclaration.filter((item) => item.id === parseInt(ID))
    if (filterData[0].is_mandatory) {
        if (isTrue) {
            obj.setMandatory((prev) => [...prev, filterData[0]])
        }
        else {
            let removeMandatory = obj.mandatory.filter((item) => item.id !== parseInt(ID))
            obj.setMandatory([...removeMandatory])
        }
    }
}

export const Declaration = {
    'rakuten': {
        declarationContent1: [
            '*Once an employee opts for Flexible Optional Medical Sum Insured, the employee will not be able to decrease the Sum Insured or Unsubscribe (opt out) during the policy period.',
            '*Once employee exits from the Organization, employee will not be eligible for Flexible Optional Medical Insurance premium refund.',
            '*Entire premium of Flexible Optional Medical Sum Insured will be recovered from employee’s salary in 11 monthly equal installments.',
            'Once Employee opts for Flexible Optional Medical Sum Insured, an employee would be able to claim through this only post exhausting Base Sum Insured.',
            'Flexible Sum Insured Terms and Conditions would be the same as Base Group Medical Employee Policy of Rakuten India.',
            'Premium paid towards Flexible Optional Medical Sum Insured cover cannot be used under 80D the section for Tax Exemption for Parent-In-Laws.',
            'Entire premium of Flexible Optional Medical Insurance will be borne by employees.',
            'Once employee exits from the Organization, employee will not be eligible for Flexible Optional Medical Insurance premium refund.',
        ],
        declarationContent2: [
            '*Entire premium of Flexible Optional Accidental Insurance Benefits will be borne by employees.',
            '*Entire premium of Flexible Optional Accidental Insurance Benefits will be recovered from employee’s salary in 11 monthly equal installments.',
            '*Once employee exits from the Organization, employee will not be eligible for Flexible Optional Accidental Insurance premium refund.',
            'Above Flexible Optional Accidental Insurance Coverage is over and above Base GPA Sum Assured (3 Times of CTC) given by Rakuten India.',
            // 'Above Premium is indicative as we have calculated on approximate CTC, actual Payable premium of Flexible Optional Accidental Insurance Benefits will be communicated to the employees via email, post enrolment drive closure and this premium will be over and above Flexible Optional Medical premium.'
        ],
        finalDeclaration: [
            { id: 1, is_mandatory: true, declaration: 'I agree and declare the information provided above is correct' },
            { id: 2, is_mandatory: true, declaration: 'I have read the complete Policy Terms and Condition and ready to pay applicable premium, if any, through payroll deductions in 11 monthly equal installments.' },
            { id: 3, is_mandatory: true, declaration: 'No premium refund will be provided to the employees exiting the Organization.' },
            { id: 4, is_mandatory: true, declaration: 'Employees Exiting in the mid-year of the policy, will have to pay back entire unpaid premium to Rakuten India, Otherwise employee’s full and final settlement will be withheld.' }
        ]
    },
    'robin software development': {
        declarationContent1: [
            '*Once an employee opts for Flexible Optional Medical Sum Insured, the employee will not be able to decrease the Sum Insured or Unsubscribe (opt out) during the policy period.',
            '*Once employee exits from the Organization, employee will not be eligible for Flexible Optional Medical Insurance premium refund.',
            '*Entire premium of Flexible Optional Medical Sum Insured will be recovered from employee’s salary in 3 monthly equal installments.',
            'Once Employee opts for Flexible Optional Medical Sum Insured, an employee would be able to claim through this only post exhausting Base Sum Insured.',
            'Flexible Sum Insured Terms and Conditions would be the same as Base Group Medical Employee Policy of Robin Software Development Centre India Pvt. Ltd.',
            'Premium paid towards Flexible Optional Medical Sum Insured cover cannot be used under 80D the section for Tax Exemption for Parent-In-Laws.',
            'Entire premium of Flexible Optional Medical Insurance will be borne by employees.',
            'Once employee exits from the Organization, employee will not be eligible for Flexible Optional Medical Insurance premium refund.',
        ],
        declarationContent2: [
            '*Entire premium of Flexible Optional Accidental Insurance Benefits will be borne by employees.',
            '*Entire premium of Flexible Optional Accidental Insurance Benefits will be recovered from employee’s salary in 3 monthly equal installments.',
            '*Once employee exits from the Organization, employee will not be eligible for Flexible Optional Accidental Insurance premium refund.',
            'Above Flexible Optional Accidental Insurance Coverage is over and above Base GPA Sum Assured (3 Times of CTC) given by Robin Software Development Centre India Pvt. Ltd.',
            // 'Above Premium is indicative as we have calculated on approximate CTC, actual Payable premium of Flexible Optional Accidental Insurance Benefits will be communicated to the employees via email, post enrolment drive closure and this premium will be over and above Flexible Optional Medical premium.'
        ],
        finalDeclaration: [
            { id: 1, is_mandatory: true, declaration: 'I agree and declare the information provided above is correct' },
            { id: 2, is_mandatory: true, declaration: 'I have read the complete Policy Terms and Condition and ready to pay applicable premium, if any, through payroll deductions in 3 monthly equal installments.' },
            { id: 3, is_mandatory: true, declaration: 'No premium refund will be provided to the employees exiting the Organization.' },
            { id: 4, is_mandatory: true, declaration: 'Employees Exiting in the mid-year of the policy, will have to pay back entire unpaid premium to Robin Software Development Centre India Pvt. Ltd, Otherwise employee’s full and final settlement will be withheld.' }
        ]
    },
    'persistent': {
        finalDeclaration: [
            {
                id: 2, is_mandatory: false, declaration: <>I have read the complete Policy
                    &nbsp;<a href="https://ind01.safelinks.protection.outlook.com/ap/b-59584e83/?url=https%3A%2F%2Fpersistentsystems.sharepoint.com%2Fsites%2FPi%2FHR%2FHRImportantDocs%2FModular%2520Flex%2520Plan%2520Terms%2520and%2520Conditions.pdf%23search%3DMediclaim&data=04%7C01%7C%7Cbec865aa2d28463a9cfc08da1d0f07ca%7Ce2d96f8394e148b3b93e32233a70c457%7C1%7C0%7C637854247654903803%7CUnknown%7CTWFpbGZsb3d8eyJWIjoiMC4wLjAwMDAiLCJQIjoiV2luMzIiLCJBTiI6Ik1haWwiLCJXVCI6Mn0%3D%7C3000&sdata=gCv90qndd82FnUDGBHLQySvGqfah9ufDBTp%2F%2F9cUY3E%3D&reserved=0" target="_blank" rel="noopener noreferrer">
                        Terms and Condition</a> and ready to pay applicable premium, if any, through payroll deductions in monthly installments as per prescribed guidelines.</>
            },
            { id: 1, is_mandatory: true, declaration: 'I agree and declare the information provided above is correct.' },
        ]
    },
    'pearson': {
        finalDeclaration: [
            {
                id: 2, is_mandatory: false, declaration: 'I have gone through the Entire portal and understand the premium deductions which would happen from My Pearson Salary. And also I understand that post submission of this enrollment no changes would be possible on the flexi policy or Add/ dele of dependents till the expiry of this Policy.'
            },
            { id: 1, is_mandatory: true, declaration: 'I agree and declare the information provided above is correct.' },
        ]
    },


}
