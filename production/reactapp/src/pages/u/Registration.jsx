import { Link, useNavigate  } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { useDispatch } from "react-redux";
import { register } from "../../api/userApi"
import eyeOpen from "../../theme/img/forms/eye-open.svg"
import eyeOff from "../../theme/img/forms/eye-off.svg"
import line from "../../theme/img/forms/line-reg.svg"

const EMAIL_REGEXP = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;


function Registration() {
    return (
        <div className=''>
            <FormReg/>
        </div>
    )

}

function FormReg() {
    const initialRegisterState = {
        loading: false,
        message: "",
    };

      const initialFormDataState = {
        email: "",
        password: "",
        repeat: "",
    };

      const initialErrorsState = {
        email: "",
        password: "",
        repeat: "",
    };

      const initialIsCorrectInputState = {
        email: false,
        password: false,
        repeat: false,
    };

      const initialIsDirtyState = {
        email: false,
        password: false,
        repeat: false,
    };

    const [registerState, setRegisterState] = useState(initialRegisterState);
    const [formData, setFormData] = useState(initialFormDataState);
    const [isDirty, setDirty] = useState(initialIsDirtyState);
    const [isCorrectInput, setIsCorrectInput] = useState(initialIsCorrectInputState);
    const [errors, setErrors] = useState(initialErrorsState);

    const [isFormValid, setIsFormValid] = useState(false);
    const [isHiddenPassword, setIsHiddenPassword] = useState(true);
    const [isHiddenRepeat, setIsHiddenRepeat] = useState(true);

    useEffect(() => {
        if(isCorrectInput.password && isCorrectInput.email && isCorrectInput.repeat) {
            setIsFormValid(true);
        } else {
            setIsFormValid(false);
        }
    }, [isCorrectInput])


    const handleHidePassword = () => {
        setIsHiddenPassword(prevErrors=> setIsHiddenPassword(!prevErrors))
    }

    const handleHideRepeat = () => {
        setIsHiddenRepeat(prevErrors=> setIsHiddenRepeat(!prevErrors))
    }

    
    const handleBlur = (e) => {
        setRegisterState(initialRegisterState);
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
            case "repeat":
                if (formData.password !== value) {
                    setErrors(prev=> ({
                        ...prev,
                        repeat: "Пароли не совпадают"
                     }));
                     setIsCorrectInput(prev=> ({
                        ...prev,
                        repeat: false
                     }));
                } else {
                    setErrors(prev=> ({
                        ...prev,
                        repeat: ""
                    }));
                    setIsCorrectInput(prev=> ({
                        ...prev,
                        repeat: true
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

    const handleRegister = () => {
        setRegisterState( {
            loading: true,
            message: ""
        });

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
                    message: "Пользователь с данным email уже существует"
                })
            }
        )
    }
    return (
        <form className='main-form wrapper_form'>
            <div id="reg-hdl" className='main-form__headline'>
                Регистрация
            <img 
                className='line'
                src={line}
                alt="line"
                width={"Регистрация".split('').length*18}
            />
            </div>
            <div className='main-form__info'>
                <div className='main-form__text'>
                    Уже есть аккаунт? 
                </div>
                <Link to='/u/login' className='main-form__auth-link'>
                    Авторизируйтесь
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
                {registerState.message ?
                        (<div className='main-form__error-message'>{registerState.message}</div>)
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
                        isHiddenPassword?
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
                            isHiddenPassword?
                            eyeOff
                            : eyeOpen         
                        } 
                        onClick={handleHidePassword}
                        alt="Hide the password"/>
                </div>
                {(isDirty.password && errors.password) && <div className='main-form__error-message'>{errors.password}</div>}
                <label className='main-form__label'>
                    Повторите пароль
                </label>
                <div 
                        tabIndex="0" 
                        className={
                            !errors.repeat ?
                            'main-form__password-fuild'
                            : 'main-form__password-fuild main-form__input_error'
                        }
                    >
                    <input 
                        className='main-form__password-fuild__input'
                        type={
                            isHiddenRepeat?
                            'password'
                            :'text'
                        }
                        name="repeat" 
                        placeholder='Повторите пароль'
                        value={formData.repeat} 
                        onBlur={handleBlur}
                        onChange={handleChange} 
                    />
                    <img 
                        className='eye'
                        src={
                            isHiddenRepeat?
                            eyeOff
                            : eyeOpen         
                        } 
                        onClick={handleHideRepeat}
                        alt="Hide the password"/>
                </div>
                {(isDirty.repeat && errors.repeat) && <div className='main-form__error-message'>{errors.repeat}</div>}
            </div>
            <div className='main-form__bottom_center'>
                <input 
                    className={ 
                        isFormValid ? 
                            'button button_default'
                            : 'button button_disable'
                    }
                    type="button" 
                    value="Готово" 
                    onClick={
                        isFormValid ? 
                            handleRegister
                            : null
                    }
                />
            </div>
        </form>
    )
}


export { Registration };