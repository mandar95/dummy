import React, { /* useState */ } from "react";
// import { useEffect } from "react";
import classesone from "../../index.module.css";
import { useForm, Controller } from "react-hook-form";
import { useSelector } from "react-redux";

const RadioButtonLabel = ({ id }) => {
  const { globalTheme } = useSelector(state => state.theme)
  const { control, errors, /* handleSubmit, reset, watch, setValue, getValues */ } = useForm({
    mode: "onBlur",
  });
  // const [checked, setChange] = useState({
  //     [id]:false
  // });
  // useEffect(() => {
  // // eslint-disable-next-line react-hooks/exhaustive-deps
  // },[watch().radiobutton])
  return (
    <label
      key={id}
      htmlFor={`id${id}`}
      style={{ borderRadius: "20px", cursor: "pointer" }}
      className={`${classesone.backPink} ${classesone.relative} w-100 my-2 py-2`}
    >
      <div className={`${classesone.absolute}`}>
        {/* {checked[id] && <i
                  style={{ fontSize: fontSize ? `calc(20px + ${fontSize - 92}%)` : '20px' }}
                  className="text-danger fas fa-check-circle"
                ></i>} */}
        <Controller
          as={
            <input
              style={{ width: "20px", height: "20px" }}
              type="radio"
              name={`radiobutton`}
              id={`id${id}`}
            // onChange={(e) => setChange(checked => ({[id]: true}))}
            />
          }

          defaultValue={id}
          isRequired
          name={`radiobutton`}
          error={errors && errors.radiobutton}
          control={control}
        />

      </div>
      <div className="mx-1 row w-100 justify-content-between">
        <div className="col-6 text-center">
          <small style={{ fontWeight: "600", fontSize: globalTheme.fontSize ? `calc(14px + ${globalTheme.fontSize - 92}%)` : '14px' }}>
            Sum Insured
          </small>
          <h5 className={`${classesone.redColor}`}>
            ₹ 3,00,678 /-
          </h5>
        </div>
        <div className="col-6 text-center">
          <small style={{ fontWeight: "600", fontSize: globalTheme.fontSize ? `calc(14px + ${globalTheme.fontSize - 92}%)` : '14px' }}>
            Total Premium
          </small>
          <h5 className={`${classesone.redColor}`}>
            ₹ 5000 /-
          </h5>
        </div>
      </div>
    </label>
  );
}

export default RadioButtonLabel;
