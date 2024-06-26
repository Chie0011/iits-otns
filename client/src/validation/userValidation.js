export const validateUsername = (value) => {
  if (value.trim() === "") {
    return "Please enter a name";
  } else if (/^\d+$/.test(value)) {
    return "Username cannot be all numbers";
  } else if (value.length < 3 || value.length > 64) {
    return "Username must be between 3 and 64 characters";
  } else {
    return "";
  }
};
