tailwind.config = {
  theme: {
    extend: {
      screens: {
        1220: "1220px",
      },
      colors: {
        primary: {
          100: "#f2fae6",
          200: "#dff5c4",
          300: "#c9f0a3",
          400: "#93e362",
          500: "#5ad628",
          600: "#4cc221",
          700: "#39a116",
          800: "#29800e",
          900: "#1a6109",
        },
        secondary: {
          100: "#fcf7e6",
          200: "#faeac3",
          300: "#f5da9f",
          400: "#f0b75b",
          500: "#f38160",
          600: "#d17717",
          700: "#ad5c10",
          800: "#8c420a",
          900: "#692d05",
        },
        dark: "#403c39",
        light: "#626262",
        muted: "#949494",
        background: "#f8f6f3",
      },
      fontFamily: {
        sans: ['"Playpen Sans"', "sans-serif"],
        serif: ['"Modern Antiqua"', "serif"],
      },
    },
  },
};
