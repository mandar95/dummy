import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import _ from "lodash";
// import PropTypes from 'prop-types';

import { Modal } from 'react-bootstrap';
import { useForm } from "react-hook-form";

import { useDispatch, useSelector } from 'react-redux';
import {
  editAlignment, editPosition, editSize,
  editCountry, editDesignation, editAnnouncement,
  editAnnouncementSubType, editPremium,
  editSumInsured, editSubSumInsured, editRelation,
  editPolicy, editPolicySubType, editQuery, editGrade,
  editConstruct, editInsurer, editInsurerType, editPolicyContent,
  editQuerySubType, editTPA, editTPAServices, editDashboardIcon, editSampleFormat,
  editCampaign
} from './master.slice';
import { columnHeader, MasterUserTypeData } from './master.helper';
import EditModalForm from './Forms/EditModalForm';

export const EditMaster = (props) => {
  const [col, setCol] = useState([]);
  const [file, setFile] = useState(null);
  const [Data, setData] = useState("");
  const { show, onHide, data = {}, masterId, queries, announcement, tpa, policytype } = props
  const { control, handleSubmit } = useForm();
  const dispatch = useDispatch();
  const response = useSelector((state) => state.master);
  const MasterData =
    (!_.isEmpty(response?.allMasterResp?.data?.data) &&
      response?.allMasterResp?.data?.data) || [];
  const Master = [...MasterData, {
    id: 42,
    name: 'Campaign',
    value: 42
  }]?.find((master) => master.id === masterId)


  useEffect(() => {
    if (Master?.id) {
      let columnText = columnHeader(Master.id);
      columnText = JSON.parse(JSON.stringify(columnText));
      columnText.pop();
      columnText.shift();
      columnText = excludeOrIncludeCol(Master.id, columnText);
      setCol(columnText);
    }
    return () => {
      setData("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Master.id, data])

  const getFile = (file) => {
    setFile(file);
  };

  const onSubmit = (value) => {
    setTimeout(onHide, 800);
    const formData = new FormData();
    switch (Number(Master.id)) {
      case 1:
        return dispatch(editPosition(data.id, value));
      case 2:
        return dispatch(editSize(data.id, value));
      case 3:
        return dispatch(editAlignment(data.id, value));
      case 4:
        value.status = 1;
        return dispatch(editDesignation(data.id, value));
      case 6:
        formData.append("_method", "PATCH");
        formData.append("name", value.name);
        formData.append("status", "1");
        if (!!file) {
          formData.append("image", file[0])
        }
        return dispatch(editInsurerType(data.id, formData));
      case 7:
        value.status = 1;
        return dispatch(editAnnouncement(data.id, value));
      case 11:
        return dispatch(editCountry(data.id, value));
      case 13:
        value.status = 1;
        value.is_emp_included = data.is_emp_included;
        return dispatch(editConstruct(data.id, value));
      case 16:
        return dispatch(editGrade(data.id, value));
      case 17:
        formData.append("_method", "PATCH");
        formData.append("name", value.name);
        formData.append("status", "1");
        if (!!file) {
          formData.append("image", file[0])
        }
        return dispatch(editInsurer(data.id, formData));
      case 21:
        value.status = 1;
        return dispatch(editPolicy(data.id, value));
      case 22:
        return dispatch(editQuery(data.id, value));
      case 24:
        value.headers = {
          "Host": "integration.medibuddy.in",
          "Content-Type": "application/json",
          "Content-Length": "length",
          "cache-control": "no-cache"
        };
        value.status = 1;
        value.is_json = 1;
        return dispatch(editTPAServices(data.id, value));
      case 28:
        formData.append("_method", "PATCH");
        formData.append("content", value.content);
        formData.append("status", "1");
        if (!!file) {
          formData.append("image", file[0])
        }
        return dispatch(editPolicyContent(data.id, formData));
      case 29:
        value.status = 1;
        return dispatch(editPolicySubType(data.id, value));
      case 30:
        return dispatch(editQuerySubType(data.id, value));
      case 31:
        value.status = 1;
        return dispatch(editRelation(data.id, value));
      case 34:
        value.status = 1;
        return dispatch(editSumInsured(data.id, value));
      case 35:
        value.status = 1;
        return dispatch(editSubSumInsured(data.id, value));
      case 36:
        value.status = 1;
        return dispatch(editTPA(data.id, value));
      case 37:
        value.status = 1;
        return dispatch(editPremium(data.id, value))
      case 38:
        value.status = 1;
        return dispatch(editAnnouncementSubType(data.id, value));
      case 39:
        let masterType = typeof (value?.user_types_id) !== "undefined" ? value?.user_types_id : data?.user_types_id
        formData.append("name", value?.name);
        formData.append("master_user_types_id", masterType)
        formData.append("_method", "PATCH");
        // formData.append("status", "1");
        if (!!file) {
          formData.append("icon", file[0])
        }
        return dispatch(editDashboardIcon(data.id, formData));
      case 40:
        formData.append("sample_name", value?.sample_name);
        formData.append("sample_type_id", value?.sample_type_id);
        formData.append("_method", "PATCH");
        // formData.append("status", "1");
        if (!!file) {
          formData.append("sample_file", file[0])
        }
        return dispatch(editSampleFormat(data.id, formData));
      case 42:
        const response = {
          name: value?.name,
          codes: [
            value?.codes
          ]
        }
        return dispatch(editCampaign(data.id, response));
      default:
        return;
    }

  }

  const excludeOrIncludeCol = (masterId, col) => {
    switch (Number(masterId)) {
      case 6:
        col = col.map(v => {
          if (v.accessor === "image") {
            v.image = true;
          }
          return v;
        })
        return col;
      case 17:
        col = col.map(v => {
          if (v.accessor === "logo_path") {
            v.image = true;
          }
          return v;
        })
        return col;
      case 24:
        col = col.map(v => {
          if (v.accessor === "tpa_name") {
            v.dropdown = true;
            v.name = "tpa_id";
            v.optionKeyOne = "id";
            v.optionKeyTwo = "name";
            v.options = tpa;
            v.value = data?.tpa_id;
          }
          return v;
        })
        col.password = true;
        return col;
      case 28:
        col = col.map(v => {
          if (v.accessor === "image") {
            v.image = true;
          }
          return v;
        })
        return col;
      case 29:
        col = col.map(v => {
          if (v.accessor === "master_policy_name") {
            v.dropdown = true;
            v.name = "master_policy_id";
            v.optionKeyOne = "id";
            v.optionKeyTwo = "name";
            v.options = policytype;
            v.value = data?.master_policy_id;
          }
          return v;
        })
        return col;
      case 30:

        col = col.map(v => {
          if (v.accessor === "master_query") {
            v.dropdown = true;
            v.name = "query_id";
            v.optionKeyOne = "id";
            v.optionKeyTwo = "name";
            v.options = queries;
            v.value = data?.query_id;
          }
          return v;
        })
        return col;
      case 38:
        col = col.map(v => {
          if (v.accessor === "master_type_name") {
            v.dropdown = true;
            v.name = "master_type_id";
            v.optionKeyOne = "id";
            v.optionKeyTwo = "name";
            v.options = announcement;
            v.value = data?.master_type_id;
          }
          return v;
        })
        return col;
      case 39:
        col = col.map(v => {
          if (v.accessor === "icon") {
            v.image = true;
          }
          if (v.accessor === "user_type") {
            v.dropdown = true;
            v.name = "user_types_id";
            v.optionKeyOne = "id";
            v.optionKeyTwo = "name";
            v.options = MasterUserTypeData;
            v.value = data?.user_types_id;
          }
          return v;
        })
        return col;
      case 40:
        col = col.map(v => {
          if (v.accessor === "upload_path") {
            v.file = true;
            v.nofile = true;
            v.image = true
          }
          return v;
        })
        return col;
      case 42:

        // col = col.map(v => {
        //   if (v.accessor === "codes") {
        //     v.name = "codes";
        //     v.accessor= 'codes.0' 
        //     v.value = data?.codes?.[0] || '';
        //   }
        //   return v;
        // })
        return col;
      default:
        return col;
    }
  }

  return (
    <Modal
      show={show}
      onHide={onHide}
      size="xl"
      aria-labelledby="contained-modal-title-vcenter"
      dialogClassName="my-modal"
    >
      <Modal.Header>
        <Modal.Title id="contained-modal-title-vcenter">
          <Head>Edit {Master?.name} </Head>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="text-center mx-auto col-md-9 col-sm-12">
        <EditModalForm
          handleSubmit={handleSubmit} onSubmit={onSubmit} col={col} data={data} control={control} Data={Data}
          setData={setData} getFile={getFile} onHide={onHide}
        />
      </Modal.Body>
    </Modal >
  );
}


const Head = styled.span`
text-align: center;
font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(14px + ${fontSize - 92}%)` : '14px'};

letter-spacing: 1px;
color: ${({ theme }) => theme?.Tab?.color || '#6334E3'};
`
