/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    fontFamily: {
      sans: ["Poppins", "sans-serif"],
    },
    screens: {
      "2xl": { max: "1535px" },
      xl: { max: "1279px" },
      lg: { max: "64em" },
      md: { max: "48em" },
      sm: { max: "40em" },
      xsm: { max: "32em" },
      "2xsm": { max: "24em" },
    },
    extend: {
      maxHeight: {
        128: "40rem",
      },
      height: {
        108: "30rem",
        dvh: "100dvh",
        "9/10": "90%",
      },
      width: {
        "clamp-form-input": "clamp(100%, 20vw, 20rem)",
        dvw: "100dvw",
      },
      fontSize: {
        clamp: "clamp(1rem, 4vw, 1.8rem)",
        "clamp-form-greenloop": "clamp(1rem, 40vw, 2.2rem)",
        "clamp-form-header": "clamp(1.3rem, 40vw, 1.4rem)",
        "clamp-profile": "clamp(0.8rem, 10vw, 1.4rem)",
        "clamp-to-desktop": "clamp(0.5rem, 4vw, 1rem)",
        "clamp-base": "clamp(0.9rem, 1vw, 1rem)",
        "clamp-xs": "clamp(0.8rem, 1vw, 0.9rem)",
        "clamp-button": "clamp(0.5rem, 40vw, 0.7rem)",
      },
      gridTemplateRows: {
        chat: "4rem minmax(1rem, 6fr) 6rem",
      },
    },
  },
  plugins: [],
};

// "Plastic Bottles": "#21A251",
//   "Scrap Metal": "#6B2F0E",
//   Glass: "#EA4D2A",
//   Textile: "#C3C639",
//   "E-waste": "#4B443E",
//   "Food waste": "#B939D9",
//   "Biodegradable Waste": "#D7B981",
