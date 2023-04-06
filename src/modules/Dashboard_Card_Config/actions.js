import swal from "sweetalert";
import service from "./service";
import { serializeError } from "utils";
export const createDashboardCardConfig = async (
  payload,
  broker_id,
  reducerDispatch,
  reset
) => {
  try {
    reducerDispatch({
      type: "Loading",
      payload: true,
    });
    const { data, message, errors } = await service.createDashboardCardConfig(
      payload
    );
    if (data.status) {
      swal("Success", data.message, "success");
      getAllDashboardCards(broker_id, reducerDispatch);
      reset({
        heading: "",
        sub_heading: "",
        theme_json: "",
        redirect_url: "",
        description: "",
        custom_field: 0,
        cardBackground: "#000000",
        cardColor: "#000000",
        textColor: "#000000",
        selected_module: "",
      });
    } else {
      reducerDispatch({
        type: "Loading",
        payload: false,
      });
      swal("Alert", serializeError(data.errors), "warning");
      console.error("Error", message || errors);
    }
  } catch (err) {
    reducerDispatch({
      type: "Loading",
      payload: false,
    });
    console.error("Error", err);
  }
};

export const createDashboardCardMapping = async (payload, reducerDispatch) => {
  try {
    reducerDispatch({
      type: "Loading",
      payload: true,
    });
    const { data, message, errors } = await service.createDashboardCardMapping(
      payload
    );
    if (data.status) {
      swal("Success", data.message, "success");
      reducerDispatch({
        type: "Loading",
        payload: false,
      });
    } else {
      swal("Alert", serializeError(data.errors), "warning");
      reducerDispatch({
        type: "Loading",
        payload: false,
      });
      console.error("Error", message || errors);
    }
  } catch (err) {
    reducerDispatch({
      type: "Loading",
      payload: false,
    });
    console.error("Error", err);
  }
};

export const updateDashboardCardConfig = async (
  payload,
  broker_id,
  reducerDispatch,
  id
) => {
  try {
    reducerDispatch({
      type: "Loading",
      payload: true,
    });
    const { data, message, errors } = await service.updateDashboardCardConfig(
      id,
      payload
    );
    if (data.status) {
      swal("Success", data.message, "success");
      reducerDispatch({
        type: "Set_Update_Card_Modal",
        payload: {
          show: false,
        },
      });
      getAllDashboardCards(broker_id, reducerDispatch);
    } else {
      reducerDispatch({
        type: "Loading",
        payload: false,
      });
      swal("Alert", serializeError(data.errors), "warning");
      console.error("Error", message || errors);
    }
  } catch (err) {
    reducerDispatch({
      type: "Loading",
      payload: false,
    });
    console.error("Error", err);
  }
};

export const deleteCard = async (id, reducerDispatch, broker_id) => {
  try {
    reducerDispatch({
      type: "Loading",
      payload: true,
    });
    const { data, message, errors } = await service.deleteCard(id);
    if (data.status) {
      swal("Success", data.message, "success");
      getAllDashboardCards(broker_id, reducerDispatch);
    } else {
      reducerDispatch({
        type: "Loading",
        payload: false,
      });
      swal("Alert", serializeError(data.errors), "warning");
      console.error("Error", message || errors);
    }
  } catch (err) {
    reducerDispatch({
      type: "Loading",
      payload: false,
    });
    console.error("Error", err);
  }
};

export const getAllDashboardCards = async (payload, reducerDispatch) => {
  try {
    const { data, message, errors } = await service.getAllDashboardCards(
      payload
    );
    if (data.status) {
      reducerDispatch({
        type: "Loading",
        payload: false,
      });
      reducerDispatch({
        type: "Set_All_Card_Details",
        payload: data.data.map((data) => {
          return { ...data, id: data.card_id };
        }),
      });
    } else {
      reducerDispatch({
        type: "Loading",
        payload: false,
      });
      swal("Alert", serializeError(data.errors), "warning");
      console.error("Error", message || errors);
    }
  } catch (err) {
    reducerDispatch({
      type: "Loading",
      payload: false,
    });
    console.error("Error", err);
  }
};

export const getDashboardCardMapping = async (
  payload,
  reducerDispatch,
  state,
  key = "notEmployee"
) => {
  try {
    reducerDispatch({
      type: "Loading",
      payload: true,
    });
    const { data, message, errors } = await service.getDashboardCardMapping({
      data: payload,
    });
    if (data.status) {
      reducerDispatch({
        type: "Loading",
        payload: false,
      });
      if (key === "notEmployee") {
        let a = data.data.map((data) => data.card_id);
        let j = state.getAllCardsDetail.filter(
          (item, i) => !a.includes(item.card_id)
        ).map(item => ({
          ...item,
          card_details: {
            heading: item.heading
          }
        }));
        reducerDispatch({
          type: "Set_Dashboard_Card_Mapping",
          payload: [
            ...data.data.sort(
              (a, b) => parseFloat(a?.sequence) - parseFloat(b?.sequence)
            ).sort(function (a, b) {
              // true values first
              return (a?.show_card === b?.show_card) ? 0 : a?.show_card ? -1 : 1;
              // false values first
              // return (x === y)? 0 : x? 1 : -1;
            }),
            ...j
          ],
        });
      } else {
        reducerDispatch({
          type: "Set_Dashboard_Card_Mapping",
          payload: data.data?.filter(({ show_card }) => show_card).sort(
            (a, b) => parseFloat(a.sequence) - parseFloat(b.sequence)
          ) || [],
        });
      }
    } else {
      reducerDispatch({
        type: "Loading",
        payload: false,
      });
      swal("Alert", serializeError(data.errors), "warning");
      console.error("Error", message || errors);
    }
  } catch (err) {
    reducerDispatch({
      type: "Loading",
      payload: false,
    });
    console.error("Error", err);
  }
};
