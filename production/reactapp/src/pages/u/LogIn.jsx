import { Link, useNavigate} from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { login } from "../../api/userApi"
import eyeOpen from "../../theme/img/forms/eye-open.svg"
import eyeOff from "../../theme/img/forms/eye-off.svg"
import line from "../../theme/img/forms/line-login.svg"

const EMAIL_REGEXP = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;


function LogIn() {
    return (
        <div className='form-container'>
            <FormLogin/>
        </div>

    )

}

function FormLogin() {
    const initialLoginState = {
        loading: false,
        message: "",
    };

      const initialFormDataState = {
        email: "",
        password: "",
    };

      const initialErrorsState = {
        email: "",
        password: "",
    };

      const initialIsCorrectInputState = {
        email: false,
        password: false,
    };

      const initialIsDirtyState = {
        email: false,
        password: false,
    };
    
    const [loginState, setLoginState] = useState(initialLoginState);
    const [formData, setFormData] = useState(initialFormDataState);
    const [isDirty, setDirty] = useState(initialIsDirtyState);
    const [isCorrectInput, setIsCorrectInput] = useState(initialIsCorrectInputState);
    const [errors, setErrors] = useState(initialErrorsState);

    const [isFormValid, setIsFormValid] = useState(false);
    const [isHidden, setIsHidden] = useState(true);

    useEffect(() => {
        if(isCorrectInput.password && isCorrectInput.email) {
            setIsFormValid(true);
        } else {
            setIsFormValid(false);
        }
    }, [isCorrectInput])

    const handleHidePassword = () => {
        setIsHidden(prevState => !prevState)
    }

    const handleBlur = (e) => {
        setLoginState(initialLoginState);
        const {name} = e.target;
        setDirty(prevFormData => ({
            ...prevFormData,
            [name]: true
        }));
    }

    function validate(name, value) {
        switch(name) {
            case 'email':
                if (!EMAIL_REGEXP.test(value)) {
                    setErrors(prev=> ({
                        ...prev,
                        email: "Некорректый email"
                     }));
                     setIsCorrectInput(prev=> ({
                        ...prev,
                        email: false
                     }));
                } else {
                    setErrors(prev=> ({
                        ...prev,
                        email: ""
                    }));
                    setIsCorrectInput(prev=> ({
                        ...prev,
                        email: true
                     }));
                }
                break;
            case 'password':
                if (value.length < 8) {
                    setErrors(prev=> ({
                        ...prev,
                        password: "Минимальная длинна пароля: 8"
                     }));
                     setIsCorrectInput(prev=> ({
                        ...prev,
                        password: false
                     }));
                } else {
                    setErrors(prev=> ({
                        ...prev,
                        password: ""
                    }));
                    setIsCorrectInput(prev=> ({
                        ...prev,
                        password: true
                     }));
                }
                break;
            default:;
      }
    }

    const handleChange = (event) => {
        const {name, value} = event.target;
        setFormData(prevFormData => ({
            ...prevFormData,
            [name]: value
        }));

        validate(name, value);
    }

    
    const navigate = useNavigate();
    const dispatch = useDispatch();

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
                    message: "Неверный логин или пароль"
                })
                setFormData(prevFormData => ({
                    ...prevFormData,
                    password: ""
                }));
            }
        )
    }

    return (
            <form className='main-form wrapper_form'>
                <div className='main-form__headline'>
                    Войти
                        <img 
                            className='line'
                            src={line} 
                            alt="line" 
                            width={95}
                        />
                </div>
                <div className='main-form__info'>
                    <div className='main-form__text'>
                        Нет аккаунта?
                    </div>
                    <Link to='/u/reg' className='main-form__auth-link' replace>
                        Зарегистрируйтесь
                    </Link>
                </div>
                <div className='main-form__fuilds-wrapper'>
                <label className='main-form__label'>
                        Email
                    </label>
                    <div className= {
                                !errors.email ? 
                                    'main-form__input'
                                    :'main-form__input main-form__input_error'}
                    >
                        <input 
                            className='main-form__input__text'
                            type="text" 
                            name="email" 
                            placeholder='Введите email'
                            value={formData.email} 
                            onBlur={handleBlur}
                            onChange={handleChange} 
                        />
                    </div>
                    
                    {loginState.message ?
                        (<div className='main-form__error-message'>{loginState.message}</div>)
                        :((isDirty.email && errors.email) && <div className='main-form__error-message'>{errors.email}</div>)}
                    <label className='main-form__label'>
                        Пароль
                    </label>
                    <div 
                        tabIndex="0" 
                        className={
                            !errors.password ?
                            'main-form__password-fuild'
                            : 'main-form__password-fuild main-form__input_error'
                        }
                    >
                    <input 
                        className='main-form__password-fuild__input'
                        type={
                            isHidden?
                            'password'
                            :'text'
                        }
                        name="password" 
                        placeholder='Введите пароль'
                        value={formData.password} 
                        onBlur={handleBlur}
                        onChange={handleChange} 
                    />
                        <img 
                            className='eye'
                            src={
                                isHidden?
                                eyeOff
                                : eyeOpen         
                            } 
                            onClick={handleHidePassword}
                            alt="Hide the password"/>
                    </div>
                    {(isDirty.password && errors.password) && <div className='main-form__error-message'>{errors.password}</div>}
                </div>
                    <div className='main-form__bottom_space-between'>
                    <Link to='/u/pass' className='main-form__pass-link' replace>
                            Забыли пароль?
                    </Link>
                    <input 
                        className={ 
                            isFormValid ? 
                                'button button_default'
                                : 'button button_disable'
                        }
                        type="button" 
                        value="Войти" 
                        onClick={
                            isFormValid ? 
                                handleLogin
                                : null
                        }
                    />
                </div>
            </form>
    )
}


export { LogIn };