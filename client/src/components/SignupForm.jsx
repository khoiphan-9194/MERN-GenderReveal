// ================= IMPORTS =================

// React hooks: useState = store data, useEffect = run code over time
import { useState, useEffect } from "react";

// Bootstrap UI components
import { Form, Button, Alert } from "react-bootstrap";

// Router tools: Link = clickable link, useNavigate = redirect user
import { Link, useNavigate } from "react-router-dom";

// Auth helper (handles login + token)
import Auth from "../utils/auth";

// GraphQL mutation
import { MUTATION_REGISTER } from "../utils/mutations";

// Apollo hook to call backend
import { useMutation } from "@apollo/client";

const SignupForm = () => {
  // ================= STATE =================

  // store what user types (username, email, password)
  const [userFormData, setUserFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  // form validation (not heavily used here but kept)
  const [validated] = useState(false);

  // show error alert if something fails
  const [showAlert, setShowAlert] = useState(false);

  // track if signup is successful
  const [isSuccess, setIsSuccess] = useState(false);

  // countdown timer (starts at 5 seconds)
  const [countdown, setCountdown] = useState(5);

  // store token TEMPORARILY (important fix!)
  const [savedToken, setSavedToken] = useState(null);

  // function to redirect user
  const navigate = useNavigate();

  // GraphQL mutation function
  const [addUser, { error }] = useMutation(MUTATION_REGISTER);

  // ================= HANDLE INPUT =================

  const handleInputChange = (event) => {
    // get input name + value
    const { name, value } = event.target;

    // update the correct field (username/email/password)
    setUserFormData({
      ...userFormData, // keep old values
      [name]: value, // update only the changed one
    });
  };

  // ================= HANDLE SUBMIT =================

  const handleFormSubmit = async (event) => {
    event.preventDefault(); // stop page from refreshing

    try {
      // send data to backend
      const { data } = await addUser({
        variables: {
          input: {
            username: userFormData.username,
            email: userFormData.email,
            password: userFormData.password,
          },
        },
      });

      // if backend fails → throw error
      if (!data) throw new Error("Something went wrong!");

      // ✅ IMPORTANT FIX:
      // DO NOT login immediately (this was your bug)
      // Instead → store token first
      const { token } = data.register;
      setSavedToken(token);

      // show success screen
      setIsSuccess(true);
    } catch (err) {
      console.error(err);

      // show error message
      setShowAlert(true);
    }
  };

  // ================= COUNTDOWN TIMER =================

  useEffect(() => {
    // only run when signup is successful
    if (!isSuccess) return;

    // run every 1 second
    const timer = setInterval(() => {
      // decrease countdown by 1
      setCountdown((prev) => prev - 1);
    }, 1000);

    // cleanup → stop timer when component updates
    return () => clearInterval(timer);
  }, [isSuccess]); // runs ONLY when isSuccess becomes true

  // ================= REDIRECT AFTER COUNTDOWN =================

  useEffect(() => {
    // when countdown reaches 0 AND we have a token
    if (countdown === 0 && savedToken) {
      // now login user (this may redirect internally)
      Auth.login(savedToken);

      // optional: force navigation (depends on your Auth.login)
      navigate("/");
    }
  }, [countdown, savedToken, navigate]);

  // ================= UI =================

  return (
    <main className="flex-row justify-center mb-4">
      <div className="col-12 col-lg-10">
        <div className="card">
          {/* TITLE */}
          <h4 className="card-header bg-dark text-light p-2">Sign Up</h4>

          <div className="card-body">
            {/* ================= SUCCESS SCREEN ================= */}
            {isSuccess ? (
              <div style={{ textAlign: "center" }}>
                {/* success message */}
                <h3>🎉 Account Created Successfully!</h3>

                {/* clickable link */}
                <p>
                  Click here to go <Link to="/">home</Link>
                </p>

                {/* countdown text */}
                <p style={{ fontSize: "22px", fontWeight: "bold" }}>
                  Redirecting in {countdown} seconds...
                </p>
              </div>
            ) : (
              // ================= FORM =================
              <Form
                noValidate
                validated={validated}
                onSubmit={handleFormSubmit}
              >
                {/* error alert */}
                <Alert
                  dismissible
                  onClose={() => setShowAlert(false)}
                  show={showAlert}
                  variant="danger"
                >
                  Something went wrong with your signup!
                </Alert>

                {/* USERNAME INPUT */}
                <Form.Group className="mb-3">
                  <Form.Label>Username</Form.Label>
                  <Form.Control
                    type="text"
                    name="username"
                    value={userFormData.username}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>

                {/* EMAIL INPUT */}
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={userFormData.email}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>

                {/* PASSWORD INPUT */}
                <Form.Group className="mb-3">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    value={userFormData.password}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>

                {/* SUBMIT BUTTON */}
                <Button
                  type="submit"
                  variant="success"
                  disabled={
                    !(
                      userFormData.username &&
                      userFormData.email &&
                      userFormData.password
                    )
                  }
                >
                  Submit
                </Button>
              </Form>
            )}

            {/* backend error message */}
            {error && (
              <div className="my-3 p-3 bg-danger text-white">
                {error.message}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default SignupForm;
