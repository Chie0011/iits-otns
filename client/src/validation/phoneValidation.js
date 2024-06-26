export const validatePhone = (value) => {
  if (value.trim() === "") {
    return "Please enter a phone number";
  } else if (!/^0\d{10,11}$/.test(value)) {
    return "Phone number must start with 0 and be followed by 10 or 11 digits";
  } else {
    return "";
  }
};
