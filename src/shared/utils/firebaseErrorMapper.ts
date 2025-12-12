import { FirebaseError } from "firebase/app";

export const getFirebaseAuthErrorMessage = (error: FirebaseError): string => {
  const code = error.code || error.message;

  switch (code) {
    case "auth/invalid-credential":
    case "INVALID_LOGIN_CREDENTIALS":
      return "Incorrect email or password. Please try again.";

    case "auth/user-not-found":
      return "No account found with that email.";

    case "auth/wrong-password":
      return "Wrong password entered.";

    case "auth/user-disabled":
      return "Your account has been disabled.";

    case "auth/too-many-requests":
      return "Too many attempts. Please try again later.";

    case "auth/invalid-email":
      return "This email address is not valid.";

    default:
      return "Something went wrong. Please try again.";
  }
};
