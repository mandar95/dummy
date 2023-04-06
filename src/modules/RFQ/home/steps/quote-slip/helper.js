export const structure = (isOperation) => [

    {
        Header: "Features",
        accessor: "feature_name",
    },
    {
        Header: "Existing Terms",
        accessor: "existing_terms",
    },
    {
        Header: "Proposed Option",
        accessor: "proposed_option",
    },
    // {
    //     Header: "Operations",
    //     accessor: "operations",
    // },
    ...(isOperation ? [{
        Header: "Operations",
        accessor: "operations",
    }] : []),

];