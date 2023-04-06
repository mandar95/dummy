import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import { differenceInYears, subYears } from 'date-fns';
import * as yup from 'yup';
import swal from "sweetalert";

import classesone from "../index.module.css";
import { Input, Typography, Error, Select } from 'components'

import { formatDate } from '../enrollment.help';
import { useForm, Controller } from "react-hook-form";
import { editNominee, nomineeRemove } from './enrolment.action';


const validationSchema = (dob) => yup.object().shape({
    nominee_relation_id: yup.string().required("Please select employee relation"),
    nominee_fname: yup.string().test('alphabets', 'Name must contain only alphabets', (value) => {
        return /^([A-Za-z\s])+$/.test(value?.trim());
    }).required('Nominee First Name required'),
    nominee_lname: yup.string().matches(/^([A-Za-z\s])+$/, { message: 'Name must contain only alphabets', excludeEmptyString: true })
        .notRequired().nullable(),
    nominee_dob: yup.string().required('Nominee DOB required'),
    ...((differenceInYears(new Date(), new Date(dob)) <= 18) && {
        guardian_relation_id: yup.string().required("Please select nominee relation").nullable(),
        guardian_fname: yup.string().test('alphabets', 'Name must contain only alphabets', (value) => {
            return /^([A-Za-z\s])+$/.test(value?.trim());
        }).required('Guardian First Name required').nullable(),
        guardian_lname: yup.string().matches(/^([A-Za-z\s])+$/, { message: 'Name must contain only alphabets', excludeEmptyString: true })
            .notRequired().nullable(),
        guardian_dob: yup.string().required('Guardian DOB required'),
    }),
    //share_per: yup.number('Only number').typeError('Share % required').min(0).required('Share % required')
    share_per: yup.number().typeError('must be a number').min(1).max(100, "max limit is 100").required(),
    // age: yup.number().required(),
});

const DrawerFormNominee = ({
    Data, policy_id, relations,
    closeModal, relations2, name,
    isInsuredRelation, dispatch,
    baseEnrolmentStatus }) => {
    const [relation, setRelation] = useState([]);
    useEffect(() => {
        let a = relations2?.filter(value => _.isEqual(name, value?.name));
        let b = a?.map(value => value?.id);
        if (_.isEmpty(relations?.filter(value => b?.includes(value?.id)))) {
            setRelation(relation => [...relations, ...a]);
        } else {
            setRelation(relation => relations);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    const [dob, setDob] = useState('');
    const { control, errors, reset, handleSubmit } = useForm({
        validationSchema: validationSchema(dob)
    });

    const removeNominee = (id) => {
        swal({
            title: "Are you sure?",
            text: "Once deleted, you will not be able to recover!",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
            .then((willDelete) => {
                if (willDelete) {
                    nomineeRemove(dispatch, id)
                }
            });
    }


    useEffect(() => {
        reset({
            nominee_fname: Data.nominee_fname,
            nominee_lname: Data.nominee_lname,
            nominee_dob: Data.nominee_dob,
            nominee_relation: Data.nominee_relation,
            guardian_fname: Data.guardian_fname,
            guardian_lname: Data.guardian_lname,
            guardian_dob: Data.guardian_dob,
            guardian_relation_id: Data.guardian_relation_id,
            share_per: Data.share_per,
            nominee_relation_id: Data.nominee_relation_id
        })
        setDob(Data.nominee_dob)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [Data])

    const onSubmit = (data) => {

        editNominee(dispatch, {
            nominee_fname: data.nominee_fname,
            ...(data.nominee_lname && { nominee_lname: data.nominee_lname }),
            nominee_relation_id: data.nominee_relation_id || Data.nominee_relation_id,
            nominee_dob: data.nominee_dob,
            ...(data.guardian_fname) &&
            {
                guardian_fname: data.guardian_fname,
                ...(data.guardian_lname && { guardian_lname: data.guardian_lname }),
                guardian_dob: data.guardian_dob,
                guardian_relation_id: data.guardian_relation_id || Data.guardian_relation_id
            },
            share_per: data.share_per,
            update_id: Data.id,
            policy_id: policy_id,
            status: 1
        })
    }

    return (
        <div
            style={{ maxWidth: "450px" }}
            className="row w-100 justify-content-center mx-1"
        >
            <div className="col-12 my-2">
                <div className="row justify-content-around">
                    <div style={{ textAlign: 'center' }} className="col-12 col-sm-5">
                        <button className={`${classesone.grayBack}`}>
                            {name} Details
                        </button>
                    </div>
                </div>
            </div>
            <form
                className="row w-100 mx-1 justify-content-center"
                onSubmit={handleSubmit(onSubmit)}>
                <div className="row w-100 justify-content-between">
                    <div className="col-12 col-sm-6 w-100">
                        <Controller
                            as={<Select
                                style={{ background: "white" }}
                                label="Relation With Employee"
                                placeholder='Select Relation With Employee'
                                options={relation?.map(({ name, id }) => ({ name, id, value: id }))}
                                id="employee_relation"
                                isRequired={true}
                                required={false}
                                disabled={isInsuredRelation || !baseEnrolmentStatus}
                            />}
                            error={errors && errors.nominee_relation_id}
                            name="nominee_relation_id"
                            control={control}
                        />
                        {!!errors.nominee_relation_id && <Error>
                            {errors.nominee_relation_id.message}
                        </Error>}
                    </div>


                    <div className="col-12 col-sm-6 w-100">
                        <Controller
                            as={<Input
                                style={{ background: "white" }}
                                label="First Name" placeholder="Enter First Name" isRequired={true}
                                required={false}
                                maxLength={50}
                                disabled={isInsuredRelation || !baseEnrolmentStatus}
                            />}
                            // error={errors && errors.policy_no}
                            control={control}
                            error={errors && errors.nominee_fname}
                            name="nominee_fname" />
                        {!!errors.nominee_fname && <Error>
                            {errors.nominee_fname.message}
                        </Error>}
                    </div>

                    <div className="col-12 col-sm-6 w-100">
                        <Controller
                            as={<Input
                                style={{ background: "white" }}
                                disabled={isInsuredRelation || !baseEnrolmentStatus}
                                maxLength={50}
                                label="Last Name" placeholder="Enter Last Name" required={false} />}
                            // error={errors && errors.policy_no}
                            control={control}
                            error={errors && errors.nominee_lname}
                            name="nominee_lname" />
                        {!!errors.nominee_lname && <Error>
                            {errors.nominee_lname.message}
                        </Error>}
                    </div>

                    <div className="col-12 col-sm-6 w-100">
                        <Controller
                            as={<Input
                                style={{ background: "white" }}
                                disabled={isInsuredRelation || !baseEnrolmentStatus}
                                label="Date of Birth" type="date" required />}
                            error={errors && errors.nominee_dob}
                            name="nominee_dob"
                            max={formatDate(new Date())}
                            onChange={([e]) => { setDob(e.target.value); return e }}
                            control={control} />
                    </div>

                    <div className="col-12 col-sm-6 w-100">
                        <Controller
                            as={<Input
                                style={{ background: "white" }}
                                label="Share %" placeholder="Enter Share %" min={1} type="number" isRequired={true}
                                required={true} />}
                            // error={errors && errors.policy_no}
                            control={control}
                            disabled={!baseEnrolmentStatus}
                            error={errors && errors.share_per}
                            name="share_per" />
                        {!!errors.share_per && <Error>
                            {errors.share_per.message}
                        </Error>}
                    </div>

                </div>
                {(differenceInYears(new Date(), new Date(dob)) <= 18) &&
                    <>
                        <Typography>Guardian</Typography>
                        <div className="row w-100 mx-2 justify-content-between">

                            <div className="col-12 col-sm-6 w-100">
                                <Controller
                                    as={<Input
                                        style={{ background: "white" }}
                                        maxLength={50}
                                        label="First Name" placeholder="Enter First Name" isRequired={true}
                                        required={false} />}
                                    control={control}
                                    disabled={!baseEnrolmentStatus}
                                    error={errors && errors.guardian_fname}
                                    name="guardian_fname" />
                                {!!errors.guardian_fname && <Error>
                                    {errors.guardian_fname.message}
                                </Error>}
                            </div>

                            <div className="col-12 col-sm-6 w-100">
                                <Controller
                                    as={<Input
                                        style={{ background: "white" }}
                                        maxLength={50}
                                        label="Last Name" placeholder="Enter Last Name" required={false} />}
                                    control={control}
                                    disabled={!baseEnrolmentStatus}
                                    error={errors && errors.guardian_lname}
                                    name="guardian_lname" />
                                {!!errors.guardian_lname && <Error>
                                    {errors.guardian_lname.message}
                                </Error>}
                            </div>


                            <div className="col-12 col-sm-6 w-100">
                                <Controller
                                    as={<Input
                                        style={{ background: "white" }}
                                        label="Date of Birth" type="date" required />}
                                    error={errors && errors.guardian_dob}
                                    name="guardian_dob"
                                    max={formatDate(subYears(new Date(), 18))}
                                    control={control}
                                    disabled={!baseEnrolmentStatus} />
                            </div>

                            <div className="col-12 col-sm-6 w-100">
                                <Controller
                                    as={<Select
                                        label="Relation With Nominee"
                                        placeholder='Select Relation With Nominee'
                                        options={relations2.filter(({ id }) => [5, 6, 9].includes(id)).map(({ name, id }) => ({ name, id, value: id }))}
                                        id="employee_relation"
                                        isRequired={true}
                                        required={false}
                                    />}
                                    error={errors && errors.guardian_relation_id}
                                    name="guardian_relation_id"
                                    control={control}
                                    disabled={!baseEnrolmentStatus}
                                />
                                {!!errors.guardian_relation_id && <Error>
                                    {errors.guardian_relation_id.message}
                                </Error>}
                            </div>
                        </div>
                    </>
                }
                {baseEnrolmentStatus && <div className="row justify-content-between w-100 my-2">
                    <div className="col-6">
                        {Data?.relation_name !== "Self" && (
                            <div
                                className="mr-1 btn btn-danger w-100"
                                onClick={() => removeNominee(Data?.id)}
                            >
                                Delete Nominee
                            </div>
                        )}
                    </div>
                    <div className="col-6">
                        <button className='btn btn-success w-100' type={"submit"}>
                            Save & Update
                        </button>
                    </div>
                </div>}
            </form>
        </div>
    );
}

export default DrawerFormNominee;


