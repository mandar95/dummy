import React, { useEffect, useState } from "react";
import swal from "sweetalert";
import { downloadFile } from ".";

export function BroadCastTab({ flagReset = false, shouldTrigger, isMain }) {
  const [status, setStatus] = useState("");
  // const [time, setTime] = useState(0);
  const channel = new BroadcastChannel("timer_sync");

  // const startTimer = useCallback(delay => {
  //   setTimeout(() => {
  //     setInterval(() => {
  //       setTime(time => time + 1);
  //     }, 1000);
  //   }, delay);
  // }, []);

  const syncItUp = () => {
    // const timeNow = new Date().getTime();
    channel.postMessage(shouldTrigger);
    // console.warn('destroy same tab');
    setStatus(false);
    // startTimer(2000);
  };

  useEffect(() => {
    if (flagReset && shouldTrigger) {
      syncItUp()
      // setTimeout(() => {syncItUp()}, 2000);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flagReset, shouldTrigger])

  // console.warn({ status, shouldTrigger, isMain, result: status && !shouldTrigger && isMain === false })
  useEffect(() => {
    if (status && !shouldTrigger && isMain === false) {
      // console.warn({ status, shouldTrigger, isMain, result: status && !shouldTrigger && isMain === false })
      const checkTab = localStorage.getItem("checkTab");
      const isMultiWindow = checkTab ? JSON.parse(checkTab) : [];
      if (isMultiWindow.length > 1) {
        console.warn('%c Broadcast New Tab! ', 'background: #222; color: #bada55');
        swal('Session Closed', 'Another session is opened in another Tabs or session expired', 'info').then(() => {
          downloadFile('/');
        })
      }
    }
  }, [status, shouldTrigger, isMain])

  useEffect(() => {
    channel.onmessage = ev => {
      // console.warn(ev.data, 'Receivied');
      (!shouldTrigger && isMain === false && ev.data) && setStatus(true);
      // startTimer(2000);
    };

    return () => {
      // setTimeout(() => {
      channel.close();
      // }, 2500);
    };
  }, [channel, shouldTrigger, isMain]);

  return <></>

};
