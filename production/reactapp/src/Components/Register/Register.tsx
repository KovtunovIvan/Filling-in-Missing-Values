import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { RegisterWrapper } from "./RegisterWrapper";
import { register } from "../../api/userApi";
import Button from "@mui/material/Button";
import { IconButton, InputAdornment, TextField } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import { useAppDispatch } from "../../redux/hooks";
import PersonIcon from '@mui/icons-material/Person';
import { useState } from "react";

type State = {
  username: string;
  email: string;
  password: string;
  successful: boolean;
  message: string;
};

const Register: React.FC = () => {
  const [isBool, setIsBool] = useState(true);

  const state: State = {
    username: "",
    email: "",
    password: "",
    successful: false,
    message: "",
  };

  const navigate = useNavigate();

  const dispatch = useAppDispatch();

  const validationSchema = () => {
    return Yup.object().shape({
      username: Yup.string()
        .test(
          "len",
          "The username must be between 3 and 20 characters.",
          (val: any) =>
            val && val.toString().length >= 3 && val.toString().length <= 20
        )
        .required("This field is required!"),
      email: Yup.string()
        .email("This is not a valid email.")
        .required("This field is required!"),
      password: Yup.string()
        .test(
          "len",
          "The password must be between 6 and 40 characters.",
          (val: any) =>
            val && val.toString().length >= 6 && val.toString().length <= 40
        )
        .required("This field is required!"),
    });
  };

  const onClickHandler = () => {
    setIsBool(!isBool);
  };

  const handleRegister = (formValue: {
    username: string;
    email: string;
    password: string;
  }) => {
    const { username, email, password } = formValue;

    state.message = "";
    state.successful = false;

    register(username, email, password, dispatch).then(
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

        state.successful = false;
        state.message = resMessage;
      }
    );
  };

  const initialValues = {
    username: "",
    email: "",
    password: "",
  };

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: validationSchema,
    onSubmit: (values) => {
      handleRegister(values);
    },
  });

  return (
    <RegisterWrapper>
      <div className="register_container">
        <img
          src="//ssl.gstatic.com/accounts/ui/avatar_2x.png"
          alt="profile-img"
          className="profile-img-card"
        />
        <form onSubmit={formik.handleSubmit} className="register_form">
          <TextField
            className="register_textfield"
            id="username"
            name="username"
            label="Username"
            variant="outlined"
            value={formik.values.username}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.username && Boolean(formik.errors.username)}
            helperText={
              formik.errors.username
                ? formik.errors.username &&
                  formik.touched.username &&
                  String(formik.errors.username)
                : "Enter your username"
            }
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonIcon />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            className="register_textfield"
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
            className="register_textfield"
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
          <Button variant="contained" type="submit">
            Sing up
          </Button>
        </form>
      </div>
    </RegisterWrapper>
  );
};

export default Register;
