import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { login } from "../../api/userApi"

function LogIn() {
    const initialLoginState = {
        loading: false,
        message: "",
      };
      const initialFormDataState = {
        email: "",
        password: "",
      };

    const [loginState, setLoginState] = useState(initialLoginState);
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

    const handleLogin = () => {
        setLoginState( {
            loading: true,
            message: ""
        });
        login(formData.email, formData.password, dispatch).then(
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

                setLoginState( {
                    loading: false,
                    message: resMessage
                })
            }
        )
    }

    return (
        <div className='content'>
            <form>
                <div>ВОЙТИ</div>
                <div>
                    Нет аккаунта? 
                    <Link to='/u/reg' className='' >
                        Зарегистрируйтесь
                    </Link>
                </div>
                <label>Почта</label>
                <input type="text" name="email" value={formData.email} onChange={handleChange} />
                <label>Пароль</label>
                <input type="text" name="password" value={formData.password} onChange={handleChange} />
                <Link to='/u/pass' className=''>
                        Забыли пароль?
                </Link>
                <input type="button" value="Войти" onClick={handleLogin}/>
            </form>
        </div>
    )
}


export { LogIn };