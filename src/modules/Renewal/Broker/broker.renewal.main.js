import React, { useState, useEffect } from 'react';
import RenewalAlert from './Broker.renewal.alert';
import BrokerRenewalTable from './Broker.renewal.table'
import { getRenewalDetails } from './broker.renewal.service';
import { Loader } from 'components';
import { DateFormate } from '../../../utils';

export const BrokerRenewal = ({ admin, canWrite }) => {
    const [status, setStatus] = useState({
        isLoading: true,
        isSuccessful: false,
        isError: false
    })
    const [details, setDetails] = useState([]);
    useEffect(() => {
        if (!admin) {
            setStatus({ ...status, isLoading: true, isSuccessful: false, isError: false })
            getRenewalDetails().then(res => {
                if (res.data.status) {
                    setDetails(res.data.data.map((elem) => ({
                        ...elem,
                        start_date: DateFormate(elem.start_date),
                        end_date: DateFormate(elem.end_date)
                    })));
                    setStatus({ ...status, isLoading: false, isSuccessful: true, isError: false })
                } else {
                    setStatus({ ...status, isLoading: false, isSuccessful: false, isError: true })
                }
            }).catch(err => {
                setStatus({ ...status, isLoading: false, isSuccessful: false, isError: true })
            });
        }
        //eslint-disable-next-line
    }, [])

    const getAdminData = (e) => {
        if (e.target.value) {
            getRenewalDetails(e.target.value).then(res => {
                if (res.data.status) {
                    setDetails(res.data.data.map((elem) => ({
                        ...elem,
                        start_date: DateFormate(elem.start_date),
                        end_date: DateFormate(elem.end_date)
                    })));
                    setStatus({ ...status, isLoading: false, isSuccessful: true, isError: false })
                }
            }).catch(err => {
                setStatus({ ...status, isLoading: false, isSuccessful: false, isError: true })
            });
        }
        return (e)
    }


    if (status.isLoading && !admin) {
        return (
            <Loader />
        )
    }
    else if (status.isSuccessful || admin) {
        return (
            <BrokerRenewalTable getAdminData={getAdminData} canWrite={canWrite} admin={admin} details={details} />
        )
    }
    else if (status.isError) {
        return (
            <RenewalAlert />
        )
    }

}
