import React, { useEffect, useReducer } from "react";
import { Error, SelectComponent, Button, IconlessCard, Loader } from "components";
import { useForm, Controller } from "react-hook-form";
import { schemaCardSequencing, reducer, initialState } from "../helper";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchEmployers,
  setPageData
} from "modules/networkHospital_broker/networkhospitalbroker.slice";
import _ from "lodash";
import {
  getDashboardCardMapping,
  getAllDashboardCards,
  createDashboardCardMapping,
} from "../actions";
import { TR } from "../../policies/Nominee-Config/style";
import { numOnly, noSpecial } from "utils";

const DashBoardCardSequencing = ({ myModule }) => {
  const [state, reducerDispatch] = useReducer(reducer, initialState);
  const { employers,
    firstPage,
    lastPage } = useSelector((state) => state.networkhospitalbroker);
  const { currentUser, userType: userTypeName } = useSelector((state) => state.login);
  const dispatch = useDispatch();

  const { control, errors, watch, handleSubmit } = useForm({
    validationSchema: schemaCardSequencing,
    mode: "onBlur",
  });

  const selectedEmployerId = watch("employer_id")?.value;

  useEffect(() => {
    return () => {
      dispatch(setPageData({
        firstPage: 1,
        lastPage: 1
      }))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  useEffect(() => {
    if (currentUser?.broker_id) {
      getAllDashboardCards(currentUser?.broker_id, reducerDispatch);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);
  useEffect(() => {
    if ((currentUser?.broker_id) && userTypeName !== "Employee") {
      if (lastPage >= firstPage) {
        var _TimeOut = setTimeout(_callback, 250);
      }
      function _callback() {
        dispatch(fetchEmployers({ broker_id: currentUser?.broker_id }, firstPage));
      }
      return () => {
        clearTimeout(_TimeOut)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [firstPage, currentUser]);
  useEffect(() => {
    reducerDispatch({
      type: "Set_Dashboard_Card_Mapping",
      payload: []
    });
    if (selectedEmployerId) {
      reducerDispatch({
        type: "Set_Employer_ID",
        payload: true,
      });
      getDashboardCardMapping(selectedEmployerId, reducerDispatch, state);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedEmployerId]);
  const onSubmit = ({ employer_id, mappings = [] }) => {
    let _data1 = mappings?.filter((data) => data?.show_card === true);
    let _data2 = mappings?.filter((data) => data?.show_card === false).map(data => ({
      card_id: data.card_id,
      show_card: 0
    }))
    createDashboardCardMapping({
      employer_id: employer_id?.value,
      mappings: [..._data1, ..._data2],
    }, reducerDispatch);
  };
  return (
    <>
      {state.loading && <Loader />}
      <IconlessCard title={"Employee Home Card Sequencing"}>
        <form className="row" onSubmit={handleSubmit(onSubmit)}>
          <div className="col-12">
            <Controller
              as={
                <SelectComponent
                  label="Employer"
                  placeholder='Select Employer'
                  options={employers?.map((item) => ({
                    id: item?.id,
                    label: item?.name,
                    value: item?.id,
                  }))}
                  id="employer_id"
                  required
                />
              }
              name="employer_id"
              control={control}
              error={errors && errors.employer_id?.id}
            />
            {!!errors?.employer_id?.id && (
              <Error>{errors?.employer_id?.id?.message}</Error>
            )}
          </div>
          {state.employerID && (
            <div className="col-12 w-100">
              <div className="d-flex justify-content-center w-100">
                <div className="table-responsive w-100 mt-4">
                  <table className="table table-striped text-center mt-3">
                    <thead className="text-center">
                      <TR>
                        {!!myModule?.canwrite && <th>Show</th>}
                        <th>Sequence</th>
                        <th>Heading</th>
                      </TR>
                    </thead>
                    <tbody className="text-center">
                      {!_.isEmpty(state.setDashboardCardMapping) && state.setDashboardCardMapping.map((data, i) => {
                        return (
                          <tr className="align-self-center" key={"asdasd1" + i}>
                            {!!myModule?.canwrite && <td className="text-center">
                              <Controller
                                as={
                                  <input
                                    type="checkbox"
                                    style={{
                                      width: "25px",
                                      height: "25px",
                                    }}
                                  />
                                }
                                defaultValue={Boolean(Number(data?.show_card))}
                                name={`mappings[${i}].show_card`}
                                control={control}
                              />
                            </td>}
                            <td className="text-center">
                              <Controller
                                as={
                                  <input
                                    type="hidden"
                                    style={{
                                      width: "30px",
                                      height: "30px",
                                    }}
                                  />
                                }
                                defaultValue={data?.card_id}
                                name={`mappings[${i}].card_id`}
                                control={control}
                              />
                              <Controller
                                as={
                                  <input
                                    disabled={!myModule?.canwrite}
                                    type="tel"
                                    maxLength={3}
                                    onKeyDown={numOnly}
                                    onKeyPress={noSpecial}
                                    style={{
                                      width: "30px",
                                      height: "30px",
                                    }}
                                    required={watch(`mappings[${i}].show_card`)}
                                  />
                                }
                                defaultValue={Number(data?.sequence) === 0 ? "" : data?.sequence}
                                name={`mappings[${i}].sequence`}
                                control={control}
                              />
                            </td>
                            <td className="text-center">{data?.card_details?.heading}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
          {!!myModule?.canwrite && <div className="col-12 text-right">
            <Button type="submit">Submit</Button>
          </div>}
        </form>
      </IconlessCard>
    </>
  );
};

export default DashBoardCardSequencing;
