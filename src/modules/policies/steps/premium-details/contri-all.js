import React from 'react'
import styled from 'styled-components';
import { CustomAccordion } from 'components/accordion';
import AccordionHeader from 'components/accordion/accordion-header';
import AccordionContent from 'components/accordion/accordion-content';
import { Row, Col } from 'react-bootstrap';
import { Heading } from '../family-details/styles';
import { Controller } from 'react-hook-form';
import { Input, Error } from 'components';

export const AccordionWrapper = styled.div`
    .card {
        border: none;
        box-shadow: 0 1rem 3rem rgba(0,0,0,.175);
        ${({ theme }) => theme.dark ? 'background: #363537' : ''}
    }

    .card-header,
    .card-body {
        padding: 10px;
    }

    .form-group-input {
        min-width: auto;
    }

    .row {
        padding: 0 4px;
    }

    .col {
        padding: 0;
    }

    .span-label {
				font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(10px + ${fontSize - 92}%)` : '10px'} !important;
        background: #fff;
        padding: 2px 4px;
        
        letter-spacing: 1px;
				font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(13px + ${fontSize - 92}%)` : '13px'};
        color: #606060;
    }


    .form-group {
        width: 100%;
        min-width: auto;
    }
    .form-group-input {
        margin-right: 12px;
        margin-left: 14px;
        margin-top: 10px;
    }
`;


const ContributionAll = ({ control, errors, opd }) => {
	return (
		<Row>
			<Col xl={4} lg={4} md={6} sm={12}>
				<AccordionWrapper>
					<CustomAccordion id="contribution-all" defaultOpen>
						<AccordionHeader>
							<Heading>Contribution</Heading>
						</AccordionHeader>
						<AccordionContent>
							<Row>
								<Col>
									<Controller
										as={
											<Input
												label="Employer%"
												placeholder="ex 40"
												type="number"
												noWrapper
												min={0}
												required
												error={errors && errors['employer_contribution' + opd]}
											/>
										}
										name={"employer_contribution" + opd}
										control={control}
										rules={{ required: true }}
									/>
									{!!errors['employer_contribution' + opd] && <Error>{errors['employer_contribution' + opd]?.message}</Error>}
								</Col>
								<Col>
									<Controller
										as={
											<Input
												label="Employee%"
												placeholder="ex 40"
												type="number"
												min={0}
												noWrapper
												required
												error={errors && errors['employee_contribution' + opd]}
											/>
										}
										name={"employee_contribution" + opd}
										control={control}
										rules={{ required: true }}
									/>
									{!!errors['employee_contribution' + opd] && <Error>{errors['employee_contribution' + opd]?.message}</Error>}
								</Col>
							</Row>
						</AccordionContent>
					</CustomAccordion>
				</AccordionWrapper>
			</Col>
		</Row>
	)
};

export default ContributionAll;
