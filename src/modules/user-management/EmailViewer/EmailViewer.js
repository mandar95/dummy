import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import { FetchTemplate } from '../../UnifiedCommunicationSystem/UCC.action';

export function EmailViewer() {
  const [state, setState] = useState("");

  const location = useLocation();
  const query = new URLSearchParams(location.search);
  let paramObj = {};
  for (var value of query.keys()) {
    paramObj[value] = query.get(value);
  }

  useEffect(() => {
    FetchTemplate(paramObj, setState, '/admin/view-email-in-browser');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <iframe
      style={{ minHeight: "100vh" }}
      className="w-100 h-100"
      srcDoc={state}
      title="description"
    ></iframe>
  )
}
