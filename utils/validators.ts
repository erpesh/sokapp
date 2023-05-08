export const isEmailValid = (email: string) => {
  // regular expression to validate email
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(email);
};
export const isPasswordValid = (password: string) => {
  // Define your password requirements here
  const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/;

  return passwordRegex.test(password);
};