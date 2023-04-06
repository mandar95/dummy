import service from "./ServiceAccountManager.service";
import swal from "sweetalert";
import getstates from "../user-management/users.service";
import { serializeError } from "utils";

// Fetch Action

export async function Fetch(reducerDispatch) {
  try {
    const { data } = await service.getServiceManager();
    const { data: states } = await getstates.getStates();
    reducerDispatch({
      type: "ON_FETCH",
      payload: data,
    });
    reducerDispatch({
      type: "ON_STATE_FETCH",
      payload: states.data,
    });
  } catch (err) {
    console.error(err);
    reducerDispatch({
      type: "ON_HIDE",
    });
    swal("Alert", err.message, "warning");
  }
}

// Update updateStatusOfServiceManager Action

export async function Update(payload, reducerDispatch, Fetch) {
  const newpayload = {
    status: payload.status,
  };
  try {
    const { data } = await service.updateStatusOfServiceManager(
      payload,
      newpayload
    );
    if (data.status) {
      Fetch(reducerDispatch);
    } else {
      reducerDispatch({
        type: "ON_HIDE",
      });
      swal("Alert", data.message, "warning");
    }
  } catch (err) {
    console.error(err.message);
    reducerDispatch({
      type: "ON_HIDE",
    });
    swal("Alert", err.message, "warning");
  }
}

//  Creating User Post Action

export async function Post(payload, reducerDispatch) {
  try {
    const { data } = await service.createServiceManager(payload);
    if (data.status) {
      swal('Success', data.message, "success");
      Fetch(reducerDispatch);
    } else {
      //swal("Alert", data.message, "warning");
      swal("Alert", serializeError(data.errors), "warning")
      reducerDispatch({
        type: "ON_HIDE",
      });
    }
  } catch (err) {
    console.error(err.message);
    reducerDispatch({
      type: "ON_HIDE",
    });
    swal("Alert", err.message, "warning");
  }
}

// Update User Model Action

export async function UpdateModel(payload, onHide, reducerDispatch, Fetch, id) {
  try {
    const { data } = await service.updateServiceManager(id, payload);
    if (data.status) {
      onHide();
      Fetch(reducerDispatch);
      swal('Success', data.message, "success");
    } else {

      reducerDispatch({
        type: "ON_HIDE",
      });
      onHide();
      swal("Alert", data.message, "warning");
    }
  } catch (err) {
    console.error(err.message);
    reducerDispatch({
      type: "ON_HIDE",
    });
    onHide();
    //   reducerDispatch({ type: "ON_HIDE" });
    swal("Alert", err.message, "warning");
  }
}
