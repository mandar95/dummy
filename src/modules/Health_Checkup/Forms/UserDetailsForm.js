import React from "react";
import Tab from "../Tab.js";
import { Controller } from "react-hook-form";
import { Input, Error, Select as Selecta, Button } from "components";
import { numOnly, noSpecial } from "utils";
import _ from "lodash";
import moment from "moment";
const UserDetailsForm = ({ classesone, releation, tab, setTab, memberData,
    members, handleSubmit, onSubmit, errors, control, statecity }) => {
    return (
        <div className={`my-1`}>
            <div className={classesone.scrollmenu}>
                {releation.map((item, i) => {
                    return (
                        <Tab
                            key={"inner" + i}
                            isActive={Boolean(tab?.label === item.label)}
                            onClick={() =>
                                setTab((tab) => {
                                    return {
                                        label: item.label,
                                        id: item.id,
                                        i: i,
                                    };
                                })
                            }
                            label={item.label}
                        />
                    );
                })}
            </div>
            <hr className="bg-danger" />
            {releation.map((item, i) => {
                let _memberData1 = memberData.filter(
                    (el) => el.employee_member_mapping_id === item.id
                )[0];
                let _memeberData2 = members.filter(
                    (jitem) => jitem.member_id === item.id
                )[0];

                return (
                    <React.Fragment key={"outter" + i}>
                        {tab?.label === item.label && (
                            <form className="mt-2" onSubmit={handleSubmit(onSubmit)}>
                                <div className="row">
                                    <Controller
                                        as={<Input hidden label="" name="" placeholder="" />}
                                        name={`members[${i}].employee_member_mapping_id`}
                                        error={errors && errors.memberName}
                                        control={control}
                                        defaultValue={_memeberData2?.member_id}
                                    />
                                    <div className="col-12 col-lg-4">
                                        <Controller
                                            as={
                                                <Input
                                                    style={{ background: "white" }}
                                                    label="Member Name"
                                                    placeholder="Member Name"
                                                    readonly={true}
                                                    disabled
                                                />
                                            }
                                            isRequired
                                            name={`members[${i}].name`}
                                            error={
                                                errors &&
                                                errors.members &&
                                                errors.members[i] &&
                                                errors.members[i].name
                                            }
                                            control={control}
                                            defaultValue={_memeberData2?.name}
                                        />
                                        {!!errors.members &&
                                            errors.members[i] &&
                                            errors.members[i].name && (
                                                <Error top="0">
                                                    {errors.members[i].name.message}
                                                </Error>
                                            )}
                                    </div>
                                    <div className="col-12 col-lg-4">
                                        <Controller
                                            as={
                                                <Input
                                                    label="Mobile Number"
                                                    type="tel"
                                                    maxLength={10}
                                                    onKeyDown={numOnly}
                                                    onKeyPress={noSpecial}
                                                    placeholder="Enter Mobile No"
                                                />
                                            }
                                            isRequired={_.isEqual(tab.i, 0)}
                                            name={`members[${i}].contact`}
                                            error={
                                                errors &&
                                                errors.members &&
                                                errors.members[i] &&
                                                errors.members[i].contact
                                            }
                                            control={control}
                                            defaultValue={
                                                _memberData1
                                                    ? Boolean(_memberData1?.contact)
                                                        ? _memberData1?.contact
                                                        : null
                                                    : Boolean(_memeberData2?.mobile)
                                                        ? _memeberData2?.mobile
                                                        : null
                                            }
                                        />
                                        {!!errors.members &&
                                            errors.members[i] &&
                                            errors.members[i].contact && (
                                                <Error top="0">
                                                    {errors.members[i].contact.message}
                                                </Error>
                                            )}
                                    </div>
                                    <div className="col-12 col-lg-4">
                                        <Controller
                                            as={
                                                <Input
                                                    label="Email Address"
                                                    placeholder="Enter Email"
                                                />
                                            }
                                            isRequired={_.isEqual(tab.i, 0)}
                                            name={`members[${i}].email`}
                                            error={
                                                errors &&
                                                errors.members &&
                                                errors.members[i] &&
                                                errors.members[i].email
                                            }
                                            control={control}
                                            defaultValue={
                                                _memberData1
                                                    ? _memberData1?.email
                                                    : _memeberData2?.email
                                            }
                                        />
                                        {!!errors.members &&
                                            errors.members[i] &&
                                            errors.members[i].email && (
                                                <Error top="0">
                                                    {errors.members[i].email.message}
                                                </Error>
                                            )}
                                    </div>
                                    <div className="col-12 col-lg-4">
                                        <Controller
                                            as={
                                                <Input
                                                    label="Health Check-up Date & Time"
                                                    type="datetime-local"
                                                    placeholder="Health Check-up Date & Time"
                                                />
                                            }
                                            isRequired
                                            name={`members[${i}].appointment_request_date_time`}
                                            error={
                                                errors &&
                                                errors.members &&
                                                errors.members[i] &&
                                                errors.members[i].appointment_request_date_time
                                            }
                                            control={control}
                                            defaultValue={moment(
                                                _memberData1?.appointment_request_date_time
                                            ).format("YYYY-MM-DDTHH:mm")}
                                        />
                                        {!!errors.members &&
                                            errors.members[i] &&
                                            errors.members[i].appointment_request_date_time && (
                                                <Error top="0">
                                                    {
                                                        errors.members[i]
                                                            .appointment_request_date_time.message
                                                    }
                                                </Error>
                                            )}
                                    </div>
                                    <div className="col-12 col-lg-4 align-self-center">
                                        <Controller
                                            as={
                                                <Input
                                                    label="Alternate Health Check-up Date & Time"
                                                    type="datetime-local"
                                                    maxLength={10}
                                                    onKeyDown={numOnly}
                                                    placeholder="Alternate Health Check-up Date & Time"
                                                />
                                            }
                                            name={`members[${i}].alternate_appointment_request_date_time`}
                                            error={
                                                errors &&
                                                errors.members &&
                                                errors.members[i] &&
                                                errors.members[i]
                                                    .alternate_appointment_request_date_time
                                            }
                                            control={control}
                                            defaultValue={moment(
                                                _memberData1?.alternate_appointment_request_date_time
                                            ).format("YYYY-MM-DDTHH:mm")}
                                        />
                                        {!!errors.members &&
                                            errors.members[i] &&
                                            errors.members[i]
                                                .alternate_appointment_request_date_time && (
                                                <Error top="0">
                                                    {
                                                        errors.members[i]
                                                            .alternate_appointment_request_date_time
                                                            .message
                                                    }
                                                </Error>
                                            )}
                                    </div>
                                    <div className="col-12 col-lg-4">
                                        <Controller
                                            as={
                                                <Input
                                                    label="Address 1"
                                                    placeholder="Address 1"
                                                />
                                            }
                                            isRequired
                                            name={`members[${i}].address_line_1`}
                                            error={
                                                errors &&
                                                errors.members &&
                                                errors.members[i] &&
                                                errors.members[i].address_line_1
                                            }
                                            control={control}
                                            defaultValue={_memberData1?.address_line_1}
                                        />
                                        {!!errors.members &&
                                            errors.members[i] &&
                                            errors.members[i].address_line_1 && (
                                                <Error top="0">
                                                    {errors.members[i].address_line_1.message}
                                                </Error>
                                            )}
                                    </div>
                                    <div className="col-12 col-lg-4">
                                        <Controller
                                            as={
                                                <Input
                                                    label="Address 2"
                                                    name="memberAddress"
                                                    placeholder="Address 2"
                                                />
                                            }
                                            name={`members[${i}].address_line_2`}
                                            error={
                                                errors &&
                                                errors.members &&
                                                errors.members[i] &&
                                                errors.members[i].address_line_2
                                            }
                                            control={control}
                                            defaultValue={_memberData1?.address_line_2}
                                        />
                                        {!!errors.members &&
                                            errors.members[i] &&
                                            errors.members[i].address_line_2 && (
                                                <Error top="0">
                                                    {errors.members[i].address_line_2.message}
                                                </Error>
                                            )}
                                    </div>
                                    <div className="col-12 col-lg-4">
                                        <Controller
                                            as={
                                                <Input
                                                    label="Pincode"
                                                    name="memberPincode"
                                                    placeholder="Pincode"
                                                    type="tel"
                                                    maxLength={6}
                                                    onKeyDown={numOnly}
                                                    onKeyPress={noSpecial}
                                                />
                                            }
                                            isRequired
                                            name={`members[${i}].pincode`}
                                            error={
                                                errors &&
                                                errors.members &&
                                                errors.members[i] &&
                                                errors.members[i].pincode
                                            }
                                            control={control}
                                            defaultValue={_memberData1?.pincode}
                                        />
                                        {!!errors.members &&
                                            errors.members[i] &&
                                            errors.members[i].pincode && (
                                                <Error top="0">
                                                    {errors.members[i].pincode.message}
                                                </Error>
                                            )}
                                    </div>
                                    <div className="col-12 col-lg-4">
                                        <Controller
                                            as={
                                                <Selecta
                                                    label="State"
                                                    placeholder="state"
                                                    isRequired={true}
                                                    options={[
                                                        {
                                                            id:
                                                                statecity.length &&
                                                                statecity[0]?.state_id,
                                                            name:
                                                                statecity.length &&
                                                                statecity[0]?.state_name,
                                                            value:
                                                                statecity.length &&
                                                                statecity[0]?.state_id,
                                                        },
                                                    ]}
                                                    id="state_id"
                                                />
                                            }
                                            name={`members[${i}].state_id`}
                                            control={control}
                                            defaultValue={_memberData1?.state_id}
                                            error={
                                                errors &&
                                                errors.members &&
                                                errors.members[i] &&
                                                errors.members[i].state_id
                                            }
                                        />
                                        {!!errors.members &&
                                            errors.members[i] &&
                                            errors.members[i].state_id && (
                                                <Error top="0">
                                                    {errors.members[i].state_id.message}
                                                </Error>
                                            )}
                                    </div>
                                    <div className="col-12 col-lg-4">
                                        <Controller
                                            as={
                                                <Selecta
                                                    label="City"
                                                    placeholder="City"
                                                    isRequired={true}
                                                    options={[
                                                        {
                                                            id:
                                                                statecity.length && statecity[0]?.city_id,
                                                            name:
                                                                statecity.length &&
                                                                statecity[0]?.city_name,
                                                            value:
                                                                statecity.length && statecity[0]?.city_id,
                                                        },
                                                    ]}
                                                    id="city_id"
                                                    error={
                                                        errors &&
                                                        errors.members &&
                                                        errors.members[i] &&
                                                        errors.members[i].city_id
                                                    }
                                                />
                                            }
                                            name={`members[${i}].city_id`}
                                            control={control}
                                            defaultValue={_memberData1?.city_id}
                                        />
                                        {!!errors.members &&
                                            errors.members[i] &&
                                            errors.members[i].city_id && (
                                                <Error top="0">
                                                    {errors.members[i].city_id.message}
                                                </Error>
                                            )}
                                    </div>
                                    <div className="col-12 col-lg-4"></div>
                                    <div className="col-12 col-lg-4 align-self-center">
                                        <div className="d-flex w-100 justify-content-end align-items-center">
                                            <Button
                                                className={`ml-4 ${classesone.bigButton} ${classesone.letterSpacing}`}
                                            >
                                                {releation.length === i + 1
                                                    ? `Submit`
                                                    : `Save & Next`}
                                                <i className="ml-5 text-right fas fa-arrow-right"></i>
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        )}
                    </React.Fragment>
                );
            })}
        </div>
    );
}

export default UserDetailsForm;
