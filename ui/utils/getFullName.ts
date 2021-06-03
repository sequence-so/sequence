export const getFullName = (
  firstName: string | undefined,
  lastName: string | undefined
) => {
  if (!firstName && !lastName) {
    return "No name";
  }
  if (!lastName) {
    return firstName;
  }
  return firstName + " " + lastName;
};
