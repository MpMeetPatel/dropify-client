module.exports = {
  purge: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    minWidth: {
      0: "0",
      "1/4": "25%",
      "1/2": "50%",
      "3/4": "75%",
      "1/10": "10%",
      "2/10": "20%",
      "3/10": "30%",
      "4/10": "40%",
      "5/10": "50%",
      "6/10": "60%",
      "7/10": "70%",
      "8/10": "80%",
      "9/10": "90%",
      full: "100%",
    },
    extend: {},
  },
  variants: {
    extend: {
      opacity: ["disabled"],
    },
  },
  plugins: [],
};
