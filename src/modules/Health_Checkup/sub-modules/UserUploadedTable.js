import React from "react";
import {IconlessCard,NoDataFound} from "components";
import { DataTable } from "modules/user-management";
import _ from "lodash";
const UserUplodedTable = ({errorSheetData, ErrorSheetTable}) => {
    return ( 
        <IconlessCard title={"Upload Health CheckUp Table"}>
          {!_.isEmpty(errorSheetData) ? (
            <DataTable
              columns={ErrorSheetTable}
              data={errorSheetData}
              noStatus={true}
              pageState={{ pageIndex: 0, pageSize: 5 }}
              pageSizeOptions={[5, 10]}
              autoResetPage={false}
              rowStyle
            />
          ) : (
            <>{<NoDataFound text="No Data Found" />}</>
          )}
        </IconlessCard>
     );
}
 
export default UserUplodedTable;
