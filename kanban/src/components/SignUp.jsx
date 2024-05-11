import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useAuth } from "../context/AuthContext";
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';


const SignUp = () => {

  const schema = yup.object().shape({
    name: yup.string().required(),
    email: yup.string().required(),
    password: yup.string().min(8).max(32).required(),
    password_confirmation: yup.string().required()
      .oneOf([yup.ref("password"), null], "Passwords must match")
  });


  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: yupResolver(schema),
  });

  const { signup, logging } = useAuth()

  const onSubmitHandler = async (data) => {
    //signup from context
    signup(data);
    reset();
  }


  return (
    <div className='form'>
      <form className="wrapper" onSubmit={handleSubmit(onSubmitHandler)}>
        <h2>SIGN UP</h2>
        <section className="group">
          <input
            type="text"
            size="30"
            className="input"
            name="email"
            {...register("email")}
            required
          />
          <label htmlFor="email" className="label">
            Email
          </label>
          <p style={{ color: 'red' }}>{errors.category?.email}</p>
        </section>
        {/* name */}
        <section className="group">
          <input
            type="text"
            className="input"
            name="name"
            {...register("name")}
            required
          />
          <label htmlFor="name" className="label">
            Name
          </label>
          <p style={{ color: 'red' }}>{errors.category?.name}</p>
        </section>


        <section className="group">
          <input
            type="password"
            minLength="8"
            className="input"
            name="password"
            {...register("password")}
            required
          />
          <label htmlFor="password" className="label">
            Password
          </label>
          <p style={{ color: 'red' }}>{errors.category?.password}</p>
        </section>

        {/* password conirmation */}
        <section className="group">
          <input
            type="password"
            minLength="8"
            className="input"
            name="password_confirmation"
            {...register("password_confirmation")}
            required
          />
          <label htmlFor="password" className="label">
            Password Confirmation
          </label>
          <p style={{ color: 'red' }}>{errors.category?.password_confirmation}</p>
        </section>

        <button type="submit" className="btn">
          SIGN UP
          {logging ? <Box sx={{ display: 'flex', margin: "0.375rem" }}>
            <CircularProgress color="secondary" />
          </Box> : ""}
        </button>
        <span className="footer"></span>
      </form>
    </div>
  )
}

export default SignUp
