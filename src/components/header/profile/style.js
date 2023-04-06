import styled from "styled-components";
import { Dropdown, Button } from "react-bootstrap";
export const Wrapper = styled.div`
    margin-right: -27px;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    align-items: center;
    flex-wrap: no-wrap;
    background: ${({ theme }) => theme.dark ? '#2e2e2e' : '#fff'};
    padding: 1px 25px 1px 0;
    position: relative;
    @media (max-width: 404px) {
        margin-right: 5px;
        padding: 0;
    }
`;

export const DropDownWrapper = styled(Dropdown)`
    border: 1px dashed ${({ theme }) => theme.dark ? '#ffffff' : '#000000'};
    padding: 2px;
    border-radius: 100px;
    display: flex;
    z-index: 1021;
    align-items: center;
    .roletype{
        font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(12px + ${fontSize - 92}%)` : '12px'};
        color: rgb(192, 146, 6);
        white-space: nowrap;
      }
    @media (max-width: 560px) {
      .roletype{
        display: none;
      }
    }
    
`;

export const UserImage = styled(Button)`
    background: url('/assets/images/user-alt-512.png') no-repeat;
    height: 30px;
    background-color: #fff !important;
    width: 30px;
    color: ${({ theme }) => theme.dark ? '#ffffff' : '#000000'};
    display: inline-block;
    background-size: cover;
    margin: 4px;
    border: 0;
    :hover {
        background-color: ${({ theme }) => theme.dark ? '#2e2e2e' : '#fff'};
        border: 0;
    };
    :active {
        background-color: ${({ theme }) => theme.dark ? '#2e2e2e' : '#fff'} !important;
    }
    :focus {
        background-color: ${({ theme }) => theme.dark ? '#2e2e2e' : '#fff'} !important;
        box-shadow: none !important ;
    }
`;

export const Toggler = styled(Dropdown.Toggle)`
    background: ${({ theme }) => (theme.PrimaryColors?.color1 || '#6334e3')} !important;
    color: #fff;
    border: 0;
    padding: 2px 8px;
    border-radius: 100%;
    margin-left: 10px;
    &&:after {
        display: none;
    };
    :hover {
        background-color: ${({ theme }) => (theme.PrimaryColors?.color1 || '#6334e3')} !important;
        border: 0;
    };
    :active {
        background-color: ${({ theme }) => (theme.PrimaryColors?.color1 || '#6334e3')} !important;
    };
    :focus {
        background-color: ${({ theme }) => (theme.PrimaryColors?.color1 || '#6334e3')} !important;
        box-shadow: none !important;
    }
    > i {
        font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(21px + ${fontSize - 92}%)` : '21px'};
        vertical-align: middle;
        position: relative;
        background: ${({ theme }) => (theme.PrimaryColors?.color1 || '#6334e3')} !important;
        color: #fff;
    }
`;

export const Menu = styled(Dropdown.Menu)`
    top: 16% !important;
    visibility: visible;
    opacity: 1;
    box-shadow: 0 0 45px 0 rgba(131, 23, 254, 0.06);
`;

export const MenuItem = styled(Dropdown.Item)`
    font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(14px + ${fontSize - 92}%)` : '14px'};
    color: #8a8a8a;
    letter-spacing: 0;
    padding: 4px 120px;
    padding-left: 25px;
`;

export const ItemText = styled(Dropdown.ItemText)`
    font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(14px + ${fontSize - 92}%)` : '14px'};
    color: black;
    letter-spacing: 0;
    padding-left: 25px;
    span{
     /* color: ${({ theme }) => (theme.Tab?.color || '#8a8a8a')}; */
     color: black;
    }
`;

export const NotificationIcon = styled.div`
position:relative;
margin-right:15px;
i {
  color: ${({ theme }) => (theme.PrimaryColors?.color1 || '#6334e3')}
}
cursor:pointer;
// display:none;
& span{
    position: absolute;
    top: -3px;
    right: -5px;
    font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(10px + ${fontSize - 92}%)` : '10px'};
    line-height: 15px;
    background: #ff4a4a;
    color: #fff;
    padding: 0 4px;
    border-radius: 3px;
    // -webkit-border-radius: 3px;
    // -moz-border-radius: 3px;
    // -ms-border-radius: 3px;
    // border-radius: 3px;
}
`
export const NotificationDiv = styled.div`
    height: 370px;
    width: 320px;
    background: #fff;
    position: absolute;
    /* left: 0px; */
    right: 0px;
    // border: 1px solid #e0e0e0;
    border-radius: 5px;
    z-index: 1021;
    // box-shadow: 0 0 45px 0 rgb(131 23 254 / 6%);
    box-shadow: 0 19px 38px rgb(0 0 0 / 30%), 0 15px 12px rgb(0 0 0 / 22%);

    & .header, .content{
        margin:0px;
    }
    & .header {
        justify-content: center;
        padding: 10px 0px;
        border-bottom:1px solid #eae9e9;
        background-color: ${({ theme }) => (theme.PrimaryColors?.color1 || '#6334e3')};
        color:#fff;
        border-top-left-radius: 5px;
        border-top-right-radius: 5px;
    }
    & .header h6{
        font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(12px + ${fontSize - 92}%)` : '12px'};
    text-transform: uppercase;
    margin:0px;
    letter-spacing: 1px;
    }
    & .content{
        overflow-y: auto;
        overflow-x: hidden;
    }
    /* width */
& .content::-webkit-scrollbar {
  width: 5px;
}

/* Track */
& .content::-webkit-scrollbar-track {
  background: #f1f1f1;
}

/* Handle */
& .content::-webkit-scrollbar-thumb {
  background:#7592ff;
}

/* Handle on hover */
& .content::-webkit-scrollbar-thumb:hover {
  background: #7592ff;
}
`

export const NotificationContentDiv = styled.div`
display: flex;
width: 100%;
padding: 10px 17px 10px 10px;
border-bottom: 1px solid #f5f4f4;

cursor:pointer;
background:${({ IsRead, theme }) => IsRead ? theme.PrimaryColors?.color1 + '1f' : "#fff"};

&:hover{
    // background: #e7ebff;
    box-shadow: -5px 0px 0px 0px #489cca;
    margin: 0px 0px 0px 5px;
    transition: 0.3s;
}
`
export const NotificationReadIcon = styled.i`
margin-right: 10px;
color: ${({ theme, IsRead }) => IsRead ? '#c7c7c7' : (theme.PrimaryColors?.color1 || '#8790ff')}; ;
`
export const NotificationContent = styled.span`
width: 189px;
white-space: nowrap;
text-overflow: ellipsis;
overflow: hidden;
color:${props => props.contentColor || 'black'};
overflow: hidden;
font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(12px + ${fontSize - 92}%)` : '12px'};
`
export const NotificationContentInner = styled.a`
text-decoration: none !important;
color:${props => props.contentColor || 'black'};
`
export const NotificationTypeIcon = styled.span`
color:#ff6c6c;
display:block;
position:relative;
margin-left:20px;
`

export const NotificationAlertContainer = styled.span`
position:relative;
height:215px;
width: 100%;
display:flex;
align-items:center;
justify-content:center;
`
export const NotificationAlertContent = styled.p`
position: absolute;
bottom: 30px;
letter-spacing: 1px;
color: ${({ theme }) => (theme.PrimaryColors?.color1 || '#515eff')};
`
export const NotificationOuterDiv = styled.div`
// width: 192px;
width:225px;
overflow: hidden;
text-overflow: ellipsis;
white-space: nowrap;
`
export const SeeAllNotification = styled.div`
display: flex;
justify-content: center;
margin-top: 8px;
color: ${({ theme }) => (theme.PrimaryColors?.color1 || '#515eff')};
font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(12px + ${fontSize - 92}%)` : '12px'};
letter-spacing: 0.1em;
cursor:pointer;
`
export const DateTime = styled.div`
color: ${({ theme }) => (theme.PrimaryColors?.color1 || '#515eff')};
font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(10px + ${fontSize - 92}%)` : '10px'};
letter-spacing: 1px;

`
export const ExternalLink = styled.i`
position: relative;
left: -10px;
top: -8px;
font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(8px + ${fontSize - 92}%)` : '8px'};
color: #b7b7b7;
`;
