import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import { ReplyModal } from 'modules/Help/broker-help/QueriesComplaint/ReplyQuery';

export const _renderStatusAction = (cell) => {
  const color = !cell?.value ? '#6c757d' : cell.row?.original?.tat?.color_code || '#28a745';
  return (
    <Button disabled size="sm" className="shadow m-1 rounded-lg" style={{ backgroundColor: color, borderColor: color }}>
      {!cell?.value ? 'Closed' : cell.row?.original?.tat?.status || 'Open'}
    </Button>
  );
}

// Reply Component
export const RenderReply = (cell, { isReply, employeeId }) => {
  const [replyModal, setReplyModal] = useState(false);

  return (<>
    {(cell.row.original.status) ?
      (<Button size="sm" className="shadow m-1 rounded-lg"
        variant={(cell.row.original.current_user && isReply) ? "secondary" : "primary"}
        onClick={() => { setReplyModal(cell.row.original) }}
        disabled={(cell.row.original.current_user && isReply) && true}
      >
        Reply
      </Button>)
      : (<Button size="sm" className="shadow m-1 rounded-lg" variant={"secondary"} disabled>
        Resolved
      </Button>)}
    {/* Broker FAQ Reply Modal */}
    {!!replyModal &&
      <ReplyModal
        id={replyModal.id}
        employerId={employeeId}
        replyText={replyModal.reply || ""}
        show={!!replyModal}
        currentUser={replyModal.current_user}
        onHide={() => setReplyModal(false)}
      />
    }
  </>)
};
