
import { _renderImage } from "components";
export const TableData = (SIType) => [
    {
        Header: "Feature Name",
        accessor: "title",
    },
    {
        Header: "Content",
        accessor: "content",
    },
    ...(SIType === "salary" ? [{
        Header: "No Of Time Salary",
        accessor: "no_of_times_of_salary",
    }] : [{
        Header: "Sum Insured",
        accessor: "suminsured",
    }]),
    {
        Header: "Image",
        accessor: "image",
        Cell: _renderImage,
        disableFilters: true,
        disableSortBy: true,
    },
    {
        Header: "Operations",
        accessor: "operations",
    },
];
