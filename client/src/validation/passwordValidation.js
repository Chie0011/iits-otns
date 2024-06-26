export const validatePassword = (value) => {
  // Regular expressions for validating password strength
  const hasUpperCase = /[A-Z]/.test(value);
  const hasLowerCase = /[a-z]/.test(value);
  const hasNumbers = /[0-9]/.test(value);
  const hasSymbols = /[^\w\s]/.test(value);

  if (value.trim() === "") {
    return "Please enter a password";
  } else if (value.length < 7) {
    return "Minimum of 6 characters";
  } else if (!hasUpperCase || !hasLowerCase || !hasNumbers || !hasSymbols) {
    return "Password must include a mix of upper and lower case letters, numbers, and symbols";
  } else {
    return "";
  }
};
