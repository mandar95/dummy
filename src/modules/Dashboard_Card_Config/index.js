import React, { useEffect, useReducer } from "react";
import {
  NoDataFound,
  IconlessCard,
  Loader
} from "components";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import {
  clearData, getAllModulesTypes,
} from "../announcements/announcement.slice";
import swal from "sweetalert";
import {
  createDashboardCardConfig,
  getAllDashboardCards,
  deleteCard/* , getModulesDropDown */
} from "./actions";
import { reducer, initialState, structure, schemaCardConfig } from "./helper";
import { DataTable } from "modules/user-management/index";
import EditModal from "./EditModal";
import ViewCardModal from "./ViewCardModal";
import CardConfigForm from "./Form/CardConfigForm";

const DefaulModule = [1, 2, 3, 4];

const DashboardCardConfig = ({ myModule }) => {
  const [state, reducerDispatch] = useReducer(reducer, initialState);
  const dispatch = useDispatch();
  const { userType: userTypeName, currentUser } = useSelector(
    (state) => state.login
  );
  const { Modules } = useSelector(state => state.announcement);
  const { control, errors, handleSubmit, reset, watch, register } =
    useForm({
      validationSchema: schemaCardConfig,
      mode: "onBlur",
    });

  const customField = watch("custom_field");

  const onEdit = (id, data) => {
    reducerDispatch({
      type: "Set_Update_Card_Modal",
      payload: {
        show: true,
        data: data,
      },
    });
  };

  const deleteCardWithId = (id, data) => {
    deleteCard(id, reducerDispatch, currentUser.broker_id);
  };

  useEffect(() => {
    if (userTypeName && currentUser.broker_id) {
      dispatch(getAllModulesTypes(userTypeName));
      // getModulesDropDown(reducerDispatch);
      getAllDashboardCards(currentUser.broker_id, reducerDispatch);
    }
    return () => {
      dispatch(clearData());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userTypeName, currentUser.broker_id]);

  const onSubmit = (data) => {
    if (!data.icon.length) {
      swal({
        title: "Please Select Image",
        icon: "warning",
      });
      return;
    }
    let theme_json = JSON.stringify({
      cardBackground: data.cardBackground,
      cardColor: data.cardColor,
      textColor: data.textColor,
    });
    const formdata = new FormData();
    formdata.append(`icon[image]`, data.icon[0]);
    formdata.append(`icon[name]`, data.icon[0].name);
    formdata.append(`redirect_url`, Boolean(data.custom_field) ? data.redirect_url_external : data.redirect_url);
    formdata.append(`theme_json`, theme_json);
    formdata.append(`sub_heading`, data.sub_heading);
    formdata.append(`heading`, data.heading);
    // formdata.append(`description`, data.description);
    createDashboardCardConfig(formdata, currentUser.broker_id, reducerDispatch, reset);
  };
  return (
    <>
      {state.loading && <Loader />}
      {!!myModule?.canwrite && <IconlessCard title={"Employee Home Configurator"}>
        <CardConfigForm
          handleSubmit={handleSubmit}
          onSubmit={onSubmit}
          register={register}
          errors={errors}
          control={control}
          customField={customField}
          Modules={Modules}
        />
      </IconlessCard>}
      <IconlessCard title={"Cards Details"}>
        {state?.getAllCardsDetail.length ? (
          <DataTable
            className="border rounded"
            columns={structure(reducerDispatch, !!(myModule?.candelete || myModule?.canwrite))}
            data={state?.getAllCardsDetail?.map((elem) => ({
              ...elem,
              to_allow_delete_actions: !DefaulModule.some(card_id => card_id === elem.card_id)
            })) || []}
            selectiveDelete
            noStatus={"true"}
            pageState={{ pageIndex: 0, pageSize: 5 }}
            pageSizeOptions={[5, 10, 20, 25, 50, 100]}
            rowStyle={true}
            autoResetPage={false}
            deleteFlag={!!myModule?.candelete && "custom_delete_action"}
            removeAction={deleteCardWithId}
            EditFlag={!!myModule?.canwrite}
            EditFunc={onEdit}
          />
        ) : (
          <NoDataFound />
        )}
      </IconlessCard>
      {Boolean(state?.updateCardModalData?.show) && (
        <EditModal
          show={state?.updateCardModalData?.show}
          onHide={() =>
            reducerDispatch({
              type: "Set_Update_Card_Modal",
              payload: {
                show: false,
              },
            })
          }
          state={state}
          reducerDispatch={reducerDispatch}
          Modules={Modules}
          currentUser={currentUser}
        />
      )}
      {Boolean(state?.viewCardModalData?.show) && (
        <ViewCardModal
          show={state?.viewCardModalData?.show}
          onHide={() =>
            reducerDispatch({
              type: "Set_View_Card_Modal",
              payload: {
                show: false,
              },
            })
          }
          state={state}
          reducerDispatch={reducerDispatch}
        />
      )}
    </>
  );
};

export default DashboardCardConfig;
