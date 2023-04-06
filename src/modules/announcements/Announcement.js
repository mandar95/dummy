//props : -size(size is width),color,backgroundColor,alignment(justify-content)
// media(description)

import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import swal from "sweetalert";
import {
  RowDiv,
  ImgTag,
  DivTag,
  ColDiv,
  // ColImgDiv,
  NotificationImg,
} from "./style";
import CarouselComponent from "./carousel";
import { downloadFile } from "../../utils";
import { useSelector } from "react-redux";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
    color: "white",
    "& > *": {
      margin: theme.spacing(1),
      width: theme.spacing(16),
      height: theme.spacing(16),
    },
  },
}));
export default function SimplePaper(props) {
  const data = props?.AnnouncementData;
  const { globalTheme } = useSelector(state => state.theme)
  const classes = useStyles();
  //states
  const [getType, setType] = useState(null);
  const [typeAlert, setTypeAlert] = useState(null);

  //set types -------------------------
  useEffect(() => {
    //Type check--------------------------
    if (data?.type_name === "Banner") {
      setType("banner");
    } else if (data?.type_name === "Carousel") {
      setType("carousel");
    } else {
      setType(null);
    }
    //------------------------------------
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props?.AnnouncementData]);
  //-----------------------------------

  //subtype check ---
  useEffect(() => {
    //subType check--------------------------
    if (getType === "banner") {
      if (data?.sub_type_id === 6) {
        setTypeAlert("warning");
      } else if (data?.sub_type_id === 7) {
        setTypeAlert(null); //default check removed.
      } else {
        setTypeAlert("success");
      }
    }
    //------------------------------------
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getType, props?.AnnouncementData]);

  //-------------------

  return (
    <>
      {/*Banner-----------------------------------------------------------------------*/}
      {getType === "banner" && (
        <DivTag
          className={classes.root}
          alignment={
            data?.alignment === "Left"
              ? "flex-start"
              : (data?.alignment === "Center" ? "center" : "flex-end") ||
              "flex-start"
          }
        >
          {/*use this for alignment*/}
          {/*for size change width %*/}
          <Paper
            elevation={5}
            style={{
              backgroundColor: data?.bg_color || "#0099ff",
              width:
                data?.size === "sm"
                  ? "70%"
                  : (data?.size === "md" ? "90%" : "100%") || "100%",
              color: data?.color || "white",
              display: "flex",
              justifyContent: "center", // center inner divs
              alignItems: 'center',
              flexDirection: 'column',
              height: '100%'
            }}
          >
            <label
              htmlFor=""
              style={{
                paddingLeft: "3px",
                fontSize: globalTheme.fontSize ? `calc(10px + ${globalTheme.fontSize - 92}%)` : '10px',
                display: data?.term_condition ? "inherit" : "none",
              }}
              title={
                data?.term_condition ? data?.term_condition : "Not Available"
              }
              onClick={() => swal(data?.term_condition, "", "info")}
            >
              {"Terms & Conditions *"}
            </label>
            <RowDiv className="w-100">
              <ColDiv
                className="my-auto text-center"
                md={9}
                lg={9}
                xl={9}
                sm={12}
                color={data?.color || "white"}
              >
                {data?.title ? (
                  <h5 style={{ fontWeight: "600" }}>{data?.title}</h5>
                ) : (
                  <noscript />
                )}
                <div className="d-flex justify-content-center align-items-center">
                  <span style={{ cursor: data?.link ? 'pointer' : 'default' }} onClick={() => data?.link && downloadFile(data?.link, false, true)} className={(typeAlert || data?.media) ? "mr-3" : ''}>{data?.content || ''}</span>
                  {(typeAlert && !data?.media) ? (
                    <ImgTag src={typeAlert === "warning" ? "/assets/images/errorpic.png" : "/assets/images/success.png"}
                      alt="" onClick={() => data?.link && downloadFile(data?.link, false, true)} />
                  ) : (!data?.media ? '' : (data?.link ? (
                    <a
                      style={{ display: "inline-block" }}
                      href={data?.link ? data?.link : "/home"}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <NotificationImg
                        src={data?.media || "/assets/images/previewimg.png"}
                        alt=""
                      />
                    </a>
                  ) : (
                    <NotificationImg
                      src={data?.media || "/assets/images/previewimg.png"}
                      alt=""
                    />
                  )))}
                </div>
              </ColDiv>
              {/* {!!(typeAlert || data?.media) && <ColImgDiv className='justify-content-center' md={2} lg={2} xl={2} sm={12}>
                {(typeAlert && !data?.media) ? (
                  <ImgTag src={typeAlert === "warning" ? "/assets/images/errorpic.png" : "/assets/images/success.png"}
                    alt="" onClick={() => data?.link && downloadFile(data?.link, false, true)} />
                ) : (!data?.media ? '' : (data?.link ? (
                  <a
                    style={{ display: "table-cell" }}
                    href={data?.link ? data?.link : "/home"}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <NotificationImg
                      src={data?.media || "/assets/images/previewimg.png"}
                      alt=""
                    />
                  </a>
                ) : (
                  <NotificationImg
                    src={data?.media || "/assets/images/previewimg.png"}
                    alt=""
                  />
                )))}
              </ColImgDiv>} */}
            </RowDiv>
          </Paper>
        </DivTag>
      )}
      {/*Banner--------x--------------x---------------------x--------------------x---*/}

      {/*carousel------------------------------------------------------------------ --*/}
      {/*alignment control*/}
      {getType === "carousel" && (
        <div
          style={{
            display: "flex",
            justifyContent:
              data?.alignment === "Left"
                ? "flex-start"
                : (data?.alignment === "Center" ? "center" : "flex-end") ||
                "flex-start",
            width: "100%",
          }}
        >
          {/*size control*/}
          <div
            style={{
              width:
                data?.size === "sm"
                  ? "70%"
                  : (data?.size === "md" ? "90%" : "100%") || "100%",
            }}
          >
            {/*font color control*/}
            <CarouselComponent
              style={{
                transitionTimingFunction: "ease-in",
                transitionDelay: "1s",
              }}
              size={"100%"}
              //color="white"
              color={data?.color}
              file={data?.media}
              content={data?.content}
              tc={data?.term_condition}
              link={data?.link}
              title={data?.title}
            />
          </div>
        </div>
      )}
      {/*carousel--------x--------------x---------------------x--------------------x---*/}
    </>
  );
}
