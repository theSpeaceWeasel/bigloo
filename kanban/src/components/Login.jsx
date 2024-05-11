import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useAuth } from "../context/AuthContext";
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';




const Login = () => {
  const schema = yup.object().shape({
    email: yup.string().required(),
    password: yup.string().min(8).max(32).required(),
  });

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: yupResolver(schema),
  });

  const { login, logging } = useAuth();

  const onSubmitHandler = async (data) => {
    //login from context
    login(data);
    reset();
  }

  return (
    <div className='form'>
      <form className="wrapper" onSubmit={handleSubmit(onSubmitHandler)}>
        <h2>LOGIN</h2>
        <section className="group">
          <input
            id="email"
            type="text"
            size="30"
            className="input"
            name="email"
            {...register("email")}
            required
            autoComplete="username"
          />
          <label htmlFor="email" className="label">
            Email
          </label>
          <p style={{ color: 'red' }}>{errors.category?.email}</p>
        </section>
        <section className="group">
          <input
            id="password"
            type="password"
            minLength="8"
            className="input"
            name="password"
            {...register("password")}
            required
            autoComplete="new-password"
          />
          <label htmlFor="password" className="label">
            Password
          </label>
          <p style={{ color: 'red' }}>{errors.category?.password}</p>
        </section>
        <button type="submit" className="btn">
          LOGIN
          {logging ? <Box sx={{ display: 'flex', margin: "0.375rem" }}>
            <CircularProgress color="secondary" />
          </Box> : ""}
        </button>
        <span className="footer"></span>
      </form>
    </div>
  )
}

export default Login
