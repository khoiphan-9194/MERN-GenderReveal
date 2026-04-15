import { useState } from "react";
import { Link } from "react-router-dom";
import { useMutation } from "@apollo/client";
import { MUTATION_LOGIN } from "../utils/mutations";
import { Form, Button, Alert } from "react-bootstrap";

import Auth from "../utils/auth";

const Login = () => {
  const [formState, setFormState] = useState({
    email: "",
    password: "",
  });

  const [login, { error }] = useMutation(MUTATION_LOGIN);
  const [showAlert, setShowAlert] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormState({
      ...formState,
      [name]: value,
    });
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    try {
      const { data } = await login({
        variables: {
          input: {
            email: formState.email,
            password: formState.password,
          },
        },
      });

      const { token } = data.login;

      Auth.login(token);
    } catch (e) {
      console.error(e);
      setShowAlert(true);
    }

    setFormState({
      email: "",
      password: "",
    });
  };

  return (
    <>
      <Form onSubmit={handleFormSubmit}>
        <Alert
          dismissible
          onClose={() => setShowAlert(false)}
          show={showAlert}
          variant="danger"
        >
          Something went wrong with your login credentials!
        </Alert>

        {/* EMAIL */}
        <Form.Group className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            placeholder="Your email"
            name="email"
            value={formState.email}
            onChange={handleChange}
            required
          />
        </Form.Group>

        {/* PASSWORD */}
        <Form.Group className="mb-3">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Your password"
            name="password"
            value={formState.password}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Button
          disabled={!(formState.email && formState.password)}
          type="submit"
          variant="primary"
        >
          Login
        </Button>
      </Form>

      {error && (
        <div className="my-3 p-3 bg-danger text-white">{error.message}</div>
      )}

      <p className="my-3 p-3 bg-info text-white">
        Don’t have an account?{" "}
        <Link
          to="/signup"
          style={{ color: "white", textDecoration: "underline" }}
        >
          Sign up
        </Link>
      </p>
    </>
  );
};

export default Login;
