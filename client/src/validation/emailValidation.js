export const validateEmail = (value) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const validDomains = ["@innovatotec.com", "@gardenia.com.ph", "@gmail.com"];

  if (value.trim() === "") {
    return "Please enter an email address";
  } else if (!emailRegex.test(value)) {
    return "Invalid email format";
  } else if (!validDomains.some((domain) => value.endsWith(domain))) {
    return "Invalid email domain!";
  } else {
    return "";
  }
};
