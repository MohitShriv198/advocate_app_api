export const generateOTPDigit = (num: number) => {
  var a = Math.floor(100000 + Math.random() * 900000).toString();
  return a.substring(0, num);
};
