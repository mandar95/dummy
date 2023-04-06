import { serializeError } from "utils";
import swal from "sweetalert";
import service from "./nominee.service";
  export async function GetNomineeConfig(p,setNomineeConfig) {
    try {
      const { data } = await service.getNomineeConfig(p);
      if (data?.status) {
        setNomineeConfig(data?.data[0]);
      } else {
        swal("Warning", serializeError(data.errors), "warning");
      }
    } catch (err) {
      swal("Alert", err.message, "warning");
      console.error(err.message);
    }
  }
  export async function GetRelation(setRelations) {
    try {
      const { data } = await service.getRelations();
      if (data.status) {
        setRelations(data.data);
      } else {
        swal("Alert", serializeError(data.errors), "warning");
      }
    } catch (err) {
      console.error(err.message);
    }
  }
  export async function Post(p,configurableType,setNomineeConfig) {
    try {
      const { data } = await service.postNomineeConfig(p);
      if (data.status) {
        swal('Success', data.message, "success")
        GetNomineeConfig(configurableType,setNomineeConfig);
      } else {
        swal("Alert", serializeError(data.errors), "warning");
      }
    } catch (err) {
      console.error(err.message);
    }
  }
