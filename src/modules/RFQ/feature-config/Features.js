import React, { useState, useEffect } from 'react'
import swal from 'sweetalert';

import { TabWrapper, Tab, Loader } from '../../../components'

import CreateFeature from './CreateFeature';
import FeatureList from './FeatureList';

import { useDispatch, useSelector } from 'react-redux';
import {
  loadFeatures, loadFeatureType,
  loadFeature, clear
} from '../rfq.slice';
import { useHistory, useParams } from 'react-router';
import { Decrypt } from '../../../utils';


export default function Features({ myModule }) {

  const dispatch = useDispatch();
  const history = useHistory()
  let { id, userType } = useParams();
  id = Decrypt(id);
  const [tab, setTab] = useState(id ? 'create' : 'list');

  const { features, featureTypes, feature,
    loading, error, success } = useSelector(state => state.rfq)

  useEffect(() => {
    dispatch(loadFeatureType())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!id) {
      dispatch(loadFeatures())
      setTab('list')
    } else {
      dispatch(loadFeature(id))
      setTab('create')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  useEffect(() => {
    if (!loading && error) {
      swal("Alert", error, "warning");
    };
    if (!loading && success) {
      swal('Success', success, "success").then(() => {
        id ? history.push(`/${userType}/product-feature`) : setTab('list')
        dispatch(loadFeatures())
      });
    };

    return () => { dispatch(clear()) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [success, error]);



  return !loading ? (
    <>
      {(!id && myModule?.canwrite) && <TabWrapper width='270px'>
        <Tab isActive={Boolean(tab === 'list')} onClick={() => setTab('list')}>Feature List</Tab>
        <Tab isActive={Boolean(tab === 'create')} onClick={() => setTab('create')}>Create Feature</Tab>
      </TabWrapper>}

      {(tab === 'create') && <CreateFeature id={id} featureTypes={featureTypes}
        feature={feature} setTab={setTab} />}
      {(tab === 'list') && <FeatureList myModule={myModule} features={features} />}
    </>
  ) : <Loader />
}
