import React, { useEffect, useState } from 'react';
import { CardBlue, NoDataFound } from '../../../components';
import { DataTable } from '../../user-management';
import { Button } from 'react-bootstrap';
import ViewModal from './ViewModal';
import { loadTemplates, loadSMSTemplates, deleteCommunication } from '../communication-config.slice';
import { useDispatch, useSelector } from 'react-redux';

import { TabWrapper, Tab } from 'components';
// const Data = [{
//   template: 'Testing',
//   type: 'Email',
//   view: '<div><h1>Hello</h1><p>Salman</p><ul><li>Yes</li><li>No</li></ul></div>'
// }]

export default function CommunicationDetail() {
  const [tab, setTab] = useState("Email");
  const [viewModal, setViewModal] = useState(false);
  const [templateType, setTemplateType] = useState(null);
  const dispatch = useDispatch();


  const { templates, smstemplates } = useSelector(state => state.commConfig);
  const { userType: userTypeName } = useSelector(state => state.login);

  useEffect(() => {
    if (userTypeName)
      dispatch(loadTemplates(userTypeName));
    dispatch(loadSMSTemplates(userTypeName));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userTypeName])


  const viewTemplate = (rowData) => {
    setViewModal(rowData)
  }

  let _commonObject = {
    viewTemplate,
    viewModal,
    setViewModal,
    setTemplateType,
    templateType

  }

  return (
    <>
      <TabWrapper width='max-content' className='mx-auto'>
        <Tab secondary isActive={Boolean(tab === "Email")} onClick={() => setTab("Email")}>Email</Tab>
        <Tab secondary isActive={Boolean(tab === "Sms")} onClick={() => setTab("Sms")}>SMS</Tab>
      </TabWrapper>

      {(tab === "Email") &&
        TemplateView(templates, _commonObject, tab, userTypeName, dispatch)
      }
      {(tab === "Sms") &&
        TemplateView(smstemplates, _commonObject, tab, userTypeName, dispatch)
      }
    </>
  )
}

const CellViewTemplate = (cell, viewTemplate, setTemplateType) => {
  const { globalTheme } = useSelector(state => state.theme)
  let _templateType = cell.row?.original?.template_type
  return (<Button size="sm" className="shadow rounded-lg align-items-center" variant='light' onClick={() => {
    //viewTemplate(_templateType === 1 ? cell.value : cell.row?.original?.id)
    viewTemplate(cell.row?.original)
    setTemplateType(_templateType)

  }}>
    View &nbsp;<i style={{ fontSize: globalTheme.fontSize ? `calc(0.7rem + ${globalTheme.fontSize - 92}%)` : '0.7rem' }} className={'ti-angle-up text-primary'} />
  </Button>)
}

const CellTemplateType = (cell) => {
  return (
    <Button disabled size="sm" className="m-1 rounded-lg" variant={cell?.value === 1 ? "warning" : "info"}>
      {cell?.value === 1 ? "Dynamic" : "Static"}
    </Button>
  );
}

const TableData = (viewTemplate, setTemplateType) => [
  {
    Header: "Template Name",
    accessor: "template_name",
  },
  {
    Header: "Template Type",
    accessor: "template_type",
    Cell: (cell) => CellTemplateType(cell)
  },
  {
    Header: "View Content",
    accessor: "template_value",
    Cell: (cell) => CellViewTemplate(cell, viewTemplate, setTemplateType)
  },
  {
    Header: "Operations",
    accessor: "operations",
  },
]



const TemplateView = (templates, _commonObject, tab, userTypeName, dispatch) => {
  const removeCommunication = (id, data) => {
    dispatch(deleteCommunication(data.template_id, tab, userTypeName))
  }

  return (
    <CardBlue title='Communication Detail'>
      {templates.length ? (
        <DataTable
          columns={TableData(_commonObject.viewTemplate, _commonObject.setTemplateType) || []}
          data={templates || []}
          noStatus={true}
          pageState={{ pageIndex: 0, pageSize: 5 }}
          pageSizeOptions={[5, 10, 20, 50]}
          rowStyle
          deleteFlag={'custom_delete_action'}
          removeAction={removeCommunication}
        />
      ) :
        <NoDataFound />}

      {!!_commonObject.viewModal && <ViewModal
        show={!!_commonObject.viewModal}
        onHide={() => _commonObject.setViewModal(false)}
        HtmlArray={_commonObject.viewModal}
        templateType={_commonObject.templateType}
        tab={tab}
        userTypeName={userTypeName}
      />}
    </CardBlue>
  )
}
