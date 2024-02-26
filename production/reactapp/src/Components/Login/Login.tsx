import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from 'yup';
import { login } from "../../api/userApi";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import { IconButton, InputAdornment, TextField } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import { LoginWrapper } from "./LoginWrapper";

type State = {
  redirect: string | null;
  email: string;
  password: string;
  loading: boolean;
  message: string;
};

const Login: React.FC = () => {
  const [isBool, setIsBool] = useState(true);

  const state: State = {
    redirect: null,
    email: "",
    password: "",
    loading: false,
    message: "",
  };

  const navigate = useNavigate();
  const user = useAppSelector((state) => state.userData.username);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (user) {
      navigate("/user");
    }
  }, [user]);

  const validationSchema = () => {
    return Yup.object().shape({
      email: Yup.string()
        .email("This is not a valid email.")
        .required("This field is required!"),
      password: Yup.string()
        .required("This field is required!"),
    });
  };

  const onClickHandler = () => {
    setIsBool(!isBool);
  };

  const handleLogin = (formValue: { email: string; password: string }) => {
    const { email, password } = formValue;
    state.message = "";
    state.loading = true;

    login(email, password, dispatch).then(
      () => {
        navigate("/user");
      },
      (error) => {
        const resMessage =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();

        state.loading = false;
        state.message = resMessage;
      }
    );
  };

  const { loading, message } = state;

  const initialValues = {
    email: "",
    password: "",
  };

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: validationSchema,
    onSubmit: (values) => {
      handleLogin(values);
    },
  });

  return (
    <LoginWrapper>
      <div className="login_container">
        <img
          src="//ssl.gstatic.com/accounts/ui/avatar_2x.png"
          alt="profile-img"
          className="profile-img-card"
        />
        <form onSubmit={formik.handleSubmit} className="login_form">
          <TextField
            className="login_textfield"
            id="email"
            name="email"
            label="Email"
            variant="outlined"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={
              formik.errors.email
                ? formik.errors.email &&
                  formik.touched.email &&
                  String(formik.errors.email)
                : "Enter your email"
            }
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <MailOutlineIcon />
                </InputAdornment>
              ),
            }}
          />
          <TextField
            className="login_textfield"
            id="password"
            name={"password"}
            label="Password"
            variant="outlined"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            type={isBool ? "password" : "text"}
            error={Boolean(formik.errors.password && formik.touched.password)}
            helperText={
              formik.errors.password
                ? formik.errors.password &&
                  formik.touched.password &&
                  String(formik.errors.password)
                : "Enter your password"
            }
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <IconButton onClick={onClickHandler}>
                    {isBool ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Button
            variant="contained"
            type="submit">
              Login
          </Button>
        </form>
      </div>
    </LoginWrapper>
  );
};

export default Login;
