// export const hexdata = [
//     { hex1: "#ff5674", hex2: "#ff8a61" },
//     { hex1: "#19B5E6", hex2: "#41aeef" },
//     { hex1: "#00ff97", hex2: "#42d5a1" },
//     { hex1: "#FF9800", hex2: "#ffd204" },
//     { hex1: "#0000ff", hex2: "#6699ff" },
//     { hex1: "#00ff00", hex2: "#99ff66" },
//     { hex: "#6dd5ed", hex2: "#2193b0" },
//     { hex1: "#cc99ff", hex2: "#0099cc" },
//     { hex1: "#3333cc", hex2: "#9933ff" },
//     { hex1: "#ffedbc", hex2: "#ed4264" },
//     { hex1: "#FF9800", hex2: "#ffd204" },
//     { hex: "#6dd5ed", hex2: "#2193b0" },
//     { hex1: "#3333cc", hex2: "#9933ff" },
//     { hex1: "#ff9966", hex2: "#ff5e62" },
// ]

export const readAction = (element, isMore) => {
    let actionBtn = document.createElement("span");
    actionBtn.innerHTML = isMore ? "Read More" : "Read Less";
    actionBtn.className = isMore ? "more" : "less";
    actionBtn.style.background = "#656565";
    actionBtn.style.color = "#fff";
    actionBtn.style.borderRadius = "5px";
    actionBtn.style.padding = "0px 4px";
    actionBtn.style.fontSize = "12px";
    actionBtn.style.cursor = "pointer";
    actionBtn.style.width = "70px";
    actionBtn.style.marginTop = "10px";
    actionBtn.style.textAlign = "center";
    element.appendChild(actionBtn);
}
