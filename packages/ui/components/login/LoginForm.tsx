import SignupButton from "components/SignupButton";
import { Formik, ErrorMessage } from "formik";
import { useState } from "react";

import * as yup from "yup";

let schema = yup.object().shape({
  email: yup.string().email().required(),
  password: yup.string().required().min(8),
});

interface Props {
  type: "login" | "signup";
  perform: (email: string, password: string) => Promise<any>;
}

const LoginForm = (props: Props) => {
  const [networkError, setNetworkError] = useState("");

  return (
    <Formik
      validateOnBlur={false}
      validateOnChange={false}
      validationSchema={props.type === "signup" ? schema : null}
      initialValues={{
        email: "",
        password: "",
      }}
      onSubmit={(values, { setSubmitting, setFieldError }): void => {
        setNetworkError("");
        setSubmitting(true);
        props.perform(values.email, values.password).catch((error) => {
          setNetworkError("Invalid credentials provided");
          setSubmitting(false);
        });
      }}
    >
      {({
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        handleSubmit,
        isSubmitting,
        setSubmitting,
      }) => (
        <form className="container" onSubmit={handleSubmit}>
          <label htmlFor="email">Email</label>
          <input
            name="email"
            type="email"
            required
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.email}
            placeholder="Email"
          />
          <ErrorMessage name="email" component="div" />
          <label htmlFor="password">Password</label>
          <input
            name="password"
            type="password"
            required
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.password}
            placeholder="Password"
          />
          <ErrorMessage name="password" component="div" />
          <ErrorMessage name="submit" component="div" />
          {networkError && <p>Error: {networkError}</p>}
          <SignupButton
            type="submit"
            disabled={isSubmitting}
            text={props.type === "login" ? "Login" : "Sign up"}
          />
          <style jsx>{`
            .container {
              display: flex;
              flex-direction: column;
            }
            label {
              margin-bottom: 0.5em;
              font-size: 14px;
              margin-left: 4px;
              font-weight: 500;
            }
            input {
              color: #4e4f55;
              margin-bottom: 1em;
              width: 280px;
            }
          `}</style>
        </form>
      )}
    </Formik>
  );
};

export default LoginForm;
