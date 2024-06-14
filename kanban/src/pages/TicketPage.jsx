
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import http from "../api/axios";

import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import { useState } from "react";
import { useAuth } from "../context/AuthContext";




const TicketPage = () => {

  // const editMode = false;
  const { setTicketHasBeenPosted } = useAuth()

  const { user } = useAuth()

  const schema = yup.object().shape({
    title: yup.string().required(),
    description: yup.string().min(8).max(32).required(),
    category: yup.string().oneOf(["Q1", "Q2", "Q3", "Q4"]),
    priority: yup.number().required(),
  });

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: yupResolver(schema),
  });

  const [progress, setProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  // console.log(progress);

  // console.log(isLoading)
  const onSubmitHandler = async (data) => {

    const formData = new FormData();

    formData.append('logo', data['logo'][0]);
    formData.append('title', data.title);
    formData.append('category', data.category);
    formData.append('priority', data.priority);
    formData.append('description', data.description);

    setIsUploading(true)
    console.log(progress);

    try {
      await http.post('/api/tickets', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: ({ loaded, total }) => {
          setProgress(Math.round((loaded * 100) / total))
          console.log(Math.round((loaded * 100) / total));
        }
      })

      setIsUploading(false)
      reset()
      setTicketHasBeenPosted(true)




    } catch (error) {
      console.log("Error creating ticket");
    }

    console.log(formData);

  }




  const categories = ['Q1', 'Q2', 'Q3', 'Q4']


  return (
    <div className="ticket">
      <h1>{'Create a ticket'}</h1>
      {!user.email_verified ? <h3 style={{ color: "#D3D3D3", padding: "100px" }}>Please check your email and verify your account before creating your first ticket! </h3> :
        <div className="ticket-container">
          <form onSubmit={handleSubmit(onSubmitHandler)}>

            <section>

              <label htmlFor="title">Title</label>
              <input
                type="text"
                name="title"
                id="title"
                {...register("title")}
                required
              />
              <p style={{ color: 'red' }}>{errors.title?.message}</p>

              <label htmlFor="description">Description</label>
              <input
                type="text"
                name="description"
                id="description"
                {...register("description")}
                required
              />
              <p style={{ color: 'red' }}>{errors.description?.message}</p>


              <label htmlFor="logo">Logo</label>
              <input
                type="file"
                name="logo"
                id="logo"
                {...register("logo")}
                required
              />
              <p style={{ color: 'red' }}>{errors.logo?.message}</p>


              <label>Category</label>
              <select
                name="category"
                {...register("category")}
              >
                <option>Select a category</option>
                {categories?.map((category, i) => (
                  <option key={i} value={category}>{category}</option>
                ))}
              </select>
              <p style={{ color: 'red' }}>{errors.category?.message}</p>




              <label>Priority</label>


              <div className="multiple-input-container">

                <div className="form-group">
                  <label htmlFor="priority-1">1</label>
                  <input
                    id="priority-1"
                    type="radio"
                    name="priority"
                    value="1"

                    {...register("priority")}

                  />

                </div>


                <div className="form-group">
                  <label htmlFor="priority-2">2</label>
                  <input
                    id="priority-2"
                    type="radio"
                    name="priority"
                    value="2"

                    {...register("priority")}
                  />

                </div>



                <div className="form-group">
                  <label htmlFor="priority-3">3</label>
                  <input
                    id="priority-3"
                    type="radio"
                    name="priority"
                    value="3"

                    {...register("priority")}
                  />

                </div>



                <div className="form-group">
                  <label htmlFor="priority-4">4</label>
                  <input
                    id="priority-4"
                    type="radio"
                    name="priority"
                    value="4"

                    {...register("priority")}
                  />

                </div>




                <div className="form-group">
                  <label htmlFor="priority-5">5</label>
                  <input
                    id="priority-5"
                    type="radio"
                    name="priority"
                    value="5"
                    {...register("priority")}
                  />

                  <p style={{ color: 'red' }}>{errors.priority?.message}</p>


                </div>


              </div>



            </section>

            <input type="submit" />

          </form>

        </div>
      }

      <Box sx={{
        width: '60%',
        marginTop: '0.6rem',
      }}>
        {isUploading ? <LinearProgress variant="buffer" value={progress} valueBuffer={progress + 10} /> : ""
        }      </Box>


    </div >
  )
}

export default TicketPage