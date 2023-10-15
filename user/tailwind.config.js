/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,js,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Arial", "sans-serif"],
      },
      screens: {
        "lg-up": "1000px",
      },
    },
    container: {
      center: true, // Để căn giữa container
      // padding: "1rem", // Thêm padding cho container
      screens: {
        sm: "100%", // Tùy chỉnh cho breakpoint sm
        md: "100%", // Tùy chỉnh cho breakpoint md
        lg: "1024px", // Tùy chỉnh cho breakpoint lg
        xl: "1000px", // Tùy chỉnh cho breakpoint xl để có lề 100px mỗi bên
        "2xl": "1336px", // Tùy chỉnh cho breakpoint 2xl nếu giả sử bạn muốn chiều rộng là 1536px với lề 100px mỗi bên
      },
    },
  },
  variants: {
    extend: {
      position: ["lg-up"],
    },
  },
  plugins: [],
};
