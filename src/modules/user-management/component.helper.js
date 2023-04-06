import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { BranchModal } from './Branches/BranchModal';

// Reply Component
export const RenderBranches = (cell) => {
  const [replyModal, setReplyModal] = useState(false);
  const { globalTheme } = useSelector(state => state.theme)

  // const is_child = cell.data.some(({ child_companies = [] }) => child_companies.some(({ name }) => name === cell.row.original.name));
  // if (is_child) {
  //   return '-'
  // }

  return (<>
    {/* {cell.value.map(({ name }) =>
      <Button disabled size="sm" className="shadow m-1 rounded-lg" variant='light' style={{ opacity: '1' }}>
        {name}
      </Button>)} */}
    <Button size="sm" className="shadow rounded-lg align-items-center" variant='light' onClick={() => { setReplyModal(cell.value) }}>
      {cell?.value?.length ? 'View' : 'Add'}&nbsp;<i style={{ fontSize: globalTheme.fontSize ? `calc(0.7rem + ${globalTheme.fontSize - 92}%)` : '0.7rem' }} className={`${cell?.value?.length ? 'ti-angle-up' : 'ti-plus'} text-primary`} /><br/>
      {/* <sub> {is_child && '(is also sub entity)'}</sub> */}
    </Button>


    {/* Broker FAQ Reply Modal */}
    {!!replyModal &&
      <BranchModal
        employer_id={cell.row.original.id}
        show={!!replyModal}
        Data={replyModal}
        onHide={() => setReplyModal(false)}
      />
    }
  </>)
};
