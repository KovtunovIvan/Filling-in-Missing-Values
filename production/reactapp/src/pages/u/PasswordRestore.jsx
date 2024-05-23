import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { restorePassword } from '../../api/userApi';

const EMAIL_REGEXP = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;

const textInfo = "На указанную почту будет отправлено письмо со ссылкой для изменения пароля."
const textInstruction = "Инструкции по восстановлению пароля отправлены на указанную почту."

export function PasswordResore(props) {

    const initialRestoreState = {
        loading: false,
        message: "",
        success: false,
    };

      const initialFormDataState = {
        email: "",
    };

      const initialErrorsState = {
        email: "",
    };

      const initialIsCorrectInputState = {
        email: false,
    };

      const initialIsDirtyState = {
        email: false,
    };
    
    const [restoreState, setRestoreState] = useState(initialRestoreState);
    const [formData, setFormData] = useState(initialFormDataState);
    const [isDirty, setDirty] = useState(initialIsDirtyState);
    const [isCorrectInput, setIsCorrectInput] = useState(initialIsCorrectInputState);
    const [errors, setErrors] = useState(initialErrorsState);

    const [isFormValid, setIsFormValid] = useState(false);

    useEffect(() => {
        if(isCorrectInput.email) {
            setIsFormValid(true);
        } else {
            setIsFormValid(false);
        }
    }, [isCorrectInput])

    const handleBlur = (e) => {
        setRestoreState(initialRestoreState);
        const {name} = e.target;
        setDirty(prevFormData => ({
            ...prevFormData,
            [name]: true
        }));
    }

    function validate(name, value) {
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
              
    }

    const handleChange = (event) => {
        const {name, value} = event.target;
        setFormData(prevFormData => ({
            ...prevFormData,
            [name]: value
        }));

        validate(name, value);
    }

    const handleSendEmail = (e) => {
        setRestoreState( {
            loading: true,
            message: "",
            success: false,
        });
        restorePassword(formData.email).then(
            (response) => {
                if(response.data.error){
                    setRestoreState( {
                        loading: false,
                        message: response.data.error,
                        success: false,
                    })
                } else {
                    setRestoreState( {
                        loading: false,
                        message: "",
                        success: true,
                    })
                }
            },
            (error) => {
                setRestoreState( {
                    loading: false,
                    message: "Неизвестная ошибка. Попробуйте снова через 1-2 минуты.",
                    success: false,
                })
            }
        )
    }

    const emailFuild = (
        <>
            <div className='main-form__info_contacts main-form__info_restore'>
                {textInfo}
            </div>
            <div className='main-form__fuilds-wrapper'>
                <label className='main-form__label'>
                    Email
                </label>
                <div className= {
                            !errors.email || !isDirty.email? 
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
                {restoreState.message ?
                    (<div className='main-form__error-message'>{restoreState.message}</div>)
                    :((isDirty.email && errors.email) && <div className='main-form__error-message'>{errors.email}</div>)}
            </div>
        </>
    );

    const instraction = (
        <div className='main-form__info_contacts main-form__info_restore'>
            {textInstruction}
        </div>
    )

    const submitButton = (
        <>
            {
                isFormValid ?
                <button 
                    type='input'
                    className="button button_default"
                    onClick={handleSendEmail}
                >
                    Отправить
                </button>
                : <button 
                    className="button button_desable"
                    disabled
                >
                    Отправить
                </button>
            }
        </>
    )

    const repeatButton = (
        <button 
            className="button button_default"
            onClick={() => {
                setRestoreState( {
                    loading: false,
                    message: "",
                    success: false,
                })
            }}
        > 
            Отправить снова 
        </button>
    )

    return (
        <div className='form-container'>
            <div className='main-form'>
                <div className='main-form__headline'>
                    Восстановить пароль
                </div>
                {
                    restoreState.success ?
                        instraction
                        : emailFuild
                }
                        <div className='main-form__bottom_start'>
                            {
                                restoreState.success ?
                                    repeatButton
                                    : submitButton
                            }
                            <Link to='/u/login' 
                                className='success-main-submit__link-main'
                                style={{marginLeft: "20px", textDecoration: "none"}}
                            >
                                Назад
                            </Link>
                        </div>
            </div>
        </div>
    )
}