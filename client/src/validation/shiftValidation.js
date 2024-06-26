export const validateShift = (value) => {
  if (value.trim() === "") {
    return "Please enter your start time";
  } else if (/^\d{1,2}:\d{2}\sAM$/i.test(value)) {
    return ""; // Accepts AM format
  } else {
    return "Please enter a valid time format in AM (e.g., 10:00 AM)";
  }
};
