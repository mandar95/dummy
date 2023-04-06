// Default Theme

const DefaultTheme =
{
  "Card": { "color": "#3877D6" },
  "CardBlue": { "color": "#3877D6" },
  "CardLine": { "color": "#353535" },
  "Tab": { "color": "#3877D6" },
  "Button": {
    "default": {
      "background": "#3fd49f", "border_color": "#1ad2a4", "text_color": "#ffffff"
    }, "danger": {
      "background": "#ff8983", "border_color": "#ff8683", "text_color": "#ffffff"
    }, "warning": {
      "background": "#eebb4d", "border_color": "#eebb4d", "text_color": "#ffffff"
    }, "outline": {
      "background": "#ffffff", "border_color": "#3877D6", "text_color": "#3877D6"
    }, "square_outline": {
      "background": "#ffffff", "border_color": "#3877D6", "text_color": "#3877D6"
    }, "outline_secondary": {
      "background": "#efefef", "border_color": "#606060", "text_color": "#606060"
    }, "submit_disabled": {
      "background": "#efefef", "border_color": "#606060", "text_color": "#606060"
    }, "outline_solid": {
      "background1": "#0084f4", "background2": "#00c48c", "border_color": "#D0D0D0", "text_color": "#ffffff"
    }
  },
  "PrimaryColors": { "color1": "#3877D6", "color2": "#000000", "color3": "#194588", "color4": "#3877D6", "tableColor": "#3877D6" },
  "Chip": { "background": "#E4ECF9", "color": "#000000" }
}

export const Default = {
  id: 1, ...DefaultTheme
}

export const ThemesColumn = () => [
  {
    Header: "Sr. No",
    accessor: "index"
  },
  {
    Header: "Name",
    accessor: "name"
  },
  {
    Header: "Operations",
    accessor: "operations"
  }
]
