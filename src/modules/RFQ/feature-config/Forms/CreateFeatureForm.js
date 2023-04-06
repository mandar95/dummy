import React from "react";
import { Col, OverlayTrigger, Row, Tooltip } from 'react-bootstrap'
import {Controller} from "react-hook-form";
import { Button, Error, Input } from '../../../../components'
import { TextInput } from '../../plan-configuration/style';
import { Title } from '../../select-plan/style';
import {OptionInput,Head} from "../CreateFeature";
import { CardContentConatiner } from '../../../Insurance/style';
import { CustomControl } from 'modules/user-management/AssignRole/option/style';
const CreateFeatureForm = ({handleSubmit, onSubmit, errors, control,content,featureTypes,setValue,
    register,featureIcons,product_feature_type_id,feature,maternity_dependant,is_maternity,id}) => {
    return ( 
        <form onSubmit={handleSubmit(onSubmit)}>
        <Row>
          <Col xl={12} lg={12} md={12} sm={12}>
            <Controller
              as={<Input
                label="Feature Name"
                maxLength={80}
                placeholder="Enter Feature Name"
                required={false}
                isRequired={true} />}
              name="name"
              error={errors && errors.name}
              control={control}
            />
            {!!errors.name &&
              <Error>
                {errors.name.message}
              </Error>}
          </Col>
          <Col xl={12} lg={12} md={12} sm={12}>
            <Controller
              as={<Input
                label="Sequence Order"
                maxLength={3}
                placeholder="Enter Sequence Order"
                required={false}
                isRequired={false} />}
              name="order"
              error={errors && errors.order}
              control={control}
            />
            {!!errors.order &&
              <Error>
                {errors.order.message}
              </Error>}
          </Col>
          <Col xl={12} lg={12} md={12} sm={12} className='mt-4 mb-4'>
            <div style={
              {
                position: 'absolute',
                right: '15px',
                top: '-20px',
                background: '#e2e2e2',
                padding: '0px 5px',
                borderRadius: '3px'
              }
            }>
              {`${content.length} / 800`}
            </div>
            <Controller
              as={
                <TextInput
                  className="form-control"
                  placeholder="Enter Content Here..."
                  maxLength={800}
                />
              }
              name="content"
              control={control}
              error={errors && errors.content}
            />
            <label className="form-label">
              <span className="span-label">Default Content</span>
              {/* <sup> <Img alt="important" src='/assets/images/inputs/important.png' /> </sup> */}
            </label>
            {!!errors.content &&
              <Error top={'3px'}>
                {errors.content.message}
              </Error>}
          </Col>
          <Col xl={12} lg={12} md={12} sm={12}>
            <Title fontWeight="600" color="#606060" fontSize="1.4rem" className='text-center'>
              Select Feature Type
            </Title>
          </Col>
          {featureTypes.map(({ name, id }) =>

            <Col md={12} lg={6} xl={3} sm={12} key={name + id} className='p-3'>
              <div
                className="card"
                style={{
                  borderRadius: "18px",
                  boxShadow: "rgb(179 179 179 / 35%) 1px 1px 12px 0px",
                  cursor: "pointer",
                }}
                onClick={() => {
                  setValue('product_feature_type_id', String(id))
                }}
              >
                <div className="card-body card-flex-em">
                  <OptionInput className="d-flex">
                    <input
                      name={'product_feature_type_id'}
                      type={"radio"}
                      ref={register}
                      value={id}
                      defaultChecked={id === 1 && true}
                    />
                    <span></span>

                  </OptionInput>
                  <div
                    className="row rowButton2"
                    style={{
                      marginRight: "-15px !important",
                      marginLeft: "-15px !important",
                    }}
                  >
                    <CardContentConatiner>
                      <div className="col-md-10 text-center mb-2 mx-auto">
                        <img
                          src={featureIcons[id - 1]}
                          className="mx-auto"
                          width="150"
                          height="auto"
                          alt="img"
                          style={{ borderRadius: '70px' }}
                        />
                      </div>

                      <div className="col-md-12 text-center">
                        <Head>{name}
                          <OverlayTrigger
                            key={"home-india"}
                            placement={"top"}
                            overlay={<Tooltip id={"tooltip-home-india"}>{'content'}</Tooltip>} >
                            <svg
                              onClick={(e) => { e.stopPropagation() }}
                              className="icon icon-info"
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 35 35"
                              fill="#6334e3" >
                              <path d="M14 9.5c0-0.825 0.675-1.5 1.5-1.5h1c0.825 0 1.5 0.675 1.5 1.5v1c0 0.825-0.675 1.5-1.5 1.5h-1c-0.825 0-1.5-0.675-1.5-1.5v-1z"></path>
                              <path d="M20 24h-8v-2h2v-6h-2v-2h6v8h2z"></path>
                              <path d="M16 0c-8.837 0-16 7.163-16 16s7.163 16 16 16 16-7.163 16-16-7.163-16-16-16zM16 29c-7.18 0-13-5.82-13-13s5.82-13 13-13 13 5.82 13 13-5.82 13-13 13z"></path>
                            </svg>
                          </OverlayTrigger>
                        </Head>
                      </div>
                    </CardContentConatiner>
                  </div>
                </div>
              </div>
            </Col>
          )}
          <Col xl={12} lg={12} md={12} sm={12}>
            <Title fontWeight="600" color="#606060" fontSize="1.4rem" className='text-center'>
              Other Options
            </Title>
          </Col>
          {![1, 5].includes(Number(product_feature_type_id)) && <Col xl={4} lg={6} md={12} sm={12}>
            <Head className='text-center'>Allow Mutiple Feature ?</Head>
            <div className="d-flex justify-content-around flex-wrap mt-2" style={{ margin: '0px 53px 40px -53px' }}>
              <CustomControl className="d-flex mt-4 mr-0">
                <p style={{ fontWeight: "600", paddingLeft: "27px", marginBottom: "0px", width: 'inherit' }}>{"No"}</p>
                <input ref={register} name={'include_multiple_si'} type={'radio'} value={0} defaultChecked={(feature.include_multiple_si === '0' || !feature.include_multiple_si) ? true : false} />
                <span></span>
              </CustomControl>
              <CustomControl className="d-flex mt-4 ml-0">
                <p style={{ fontWeight: "600", paddingLeft: "27px", marginBottom: "0px", width: 'inherit' }}>{"Yes with SI"}</p>
                <input ref={register} name={'include_multiple_si'} type={'radio'} value={1} defaultChecked={feature.include_multiple_si === '1' ? true : false} />
                <span></span>
              </CustomControl>
              <CustomControl className="d-flex mt-4 ml-0">
                <p style={{ fontWeight: "600", paddingLeft: "27px", marginBottom: "0px", width: 'inherit' }}>{"Yes without SI"}</p>
                <input ref={register} name={'include_multiple_si'} type={'radio'} value={2} defaultChecked={feature.include_multiple_si === '2' ? true : false} />
                <span></span>
              </CustomControl>
            </div>
          </Col>}
          {Number(maternity_dependant) === 0 && <Col xl={4} lg={6} md={12} sm={12}>
            <Head className='text-center'>Is Maternity ?</Head>
            <div className="d-flex justify-content-around flex-wrap mt-2" style={{ margin: '0px 53px 40px -53px' }}>
              <CustomControl className="d-flex mt-4 mr-0">
                <p style={{ fontWeight: "600", paddingLeft: "27px", marginBottom: "0px", width: 'inherit' }}>{"No"}</p>
                <input ref={register} name={'is_maternity'} type={'radio'} value={0} defaultChecked={!feature.is_maternity ? true : false} />
                <span></span>
              </CustomControl>
              <CustomControl className="d-flex mt-4 ml-0">
                <p style={{ fontWeight: "600", paddingLeft: "27px", marginBottom: "0px", width: 'inherit' }}>{"Yes"}</p>
                <input ref={register} name={'is_maternity'} type={'radio'} value={1} defaultChecked={feature.is_maternity ? true : false} />
                <span></span>
              </CustomControl>
            </div>
          </Col>}
          {Number(is_maternity) === 0 && <Col xl={4} lg={6} md={12} sm={12}>
            <Head className='text-center'>Is Dependant on Maternity ?</Head>
            <div className="d-flex justify-content-around flex-wrap mt-2" style={{ margin: '0px 53px 40px -53px' }}>
              <CustomControl className="d-flex mt-4 mr-0">
                <p style={{ fontWeight: "600", paddingLeft: "27px", marginBottom: "0px", width: 'inherit' }}>{"No"}</p>
                <input ref={register} name={'maternity_dependant'} type={'radio'} value={0} defaultChecked={!feature.maternity_dependant ? true : false} />
                <span></span>
              </CustomControl>
              <CustomControl className="d-flex mt-4 ml-0">
                <p style={{ fontWeight: "600", paddingLeft: "27px", marginBottom: "0px", width: 'inherit' }}>{"Yes"}</p>
                <input ref={register} name={'maternity_dependant'} type={'radio'} value={1} defaultChecked={feature.maternity_dependant ? true : false} />
                <span></span>
              </CustomControl>
            </div>
          </Col>}
          <Col xl={12} lg={12} md={12} sm={12} className='text-right'>
            <Button type="submit">{id ? 'Update' : 'Save'}</Button>
          </Col>
        </Row>
      </form>
     );
}
 
export default CreateFeatureForm;
