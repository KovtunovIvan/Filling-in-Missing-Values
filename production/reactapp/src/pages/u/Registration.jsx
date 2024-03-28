import { Link, useNavigate  } from 'react-router-dom';
import React, { useState } from 'react';
import { useDispatch } from "react-redux";
import { register } from "../../api/userApi"


function Registration() {
    const initialRegisterState = {
        loading: false,
        message: "",
      };
      const initialFormDataState = {
        email: "",
        password: "",
        repeat: ""
      };

      const [registerState, setRegisterState] = useState(initialRegisterState);
      const [formData, setFormData] = useState(initialFormDataState);

      const navigate = useNavigate();
      const dispatch = useDispatch();

      const handleChange = (event) => {
        const {name, value} = event.target;
        setFormData(prevFormData => ({
            ...prevFormData,
            [name]: value
        }));
    }

    const handleRegister = () => {
        setRegisterState( {
            loading: true,
            message: ""
        });

        if(formData.password !== formData.repeat){
            setRegisterState( {
                loading: true,
                message: "Разные пароли",
            })
        } else {
            register(formData.email, formData.password, dispatch).then(
                () => {
                    navigate("/app");
                },
                (error) => {
                    const resMessage =
                        (error.response &&
                        error.response.data &&
                        error.response.data.message) ||
                        error.message ||
                        error.toString();
    
                    setRegisterState( {
                        loading: false,
                        message: resMessage
                    })
                }
            )
        }
    }

    console.log(registerState.message);

    return (
        <div className='content'>
            <div>РЕГИСТРАЦИЯ</div>
            <div>
                Уже есть аккаунт? 
                <Link to='/u/login' className=''>
                    Авторизируйтесь
                </Link>
            </div>
            <form>
            <label>
                Почта
                <input type="text" name="email" value={formData.email} onChange={handleChange}/>
            </label>

            <label>
                Пароль
                <input type="text" name="password" value={formData.password} onChange={handleChange}/>
            </label>

            <label>
                Повторите пароль
                <input type="text" name="repeat" value={formData.repeat} onChange={handleChange}/>
            </label>

            <input type="button" value="Готово" onClick={handleRegister}/>

            </form>
        </div>
    )
}


export { Registration };