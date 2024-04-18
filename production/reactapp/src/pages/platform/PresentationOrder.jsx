
import { Link, useNavigate} from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";

const EMAIL_REGEXP = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
const PHONE_NUMBER_REGEXP = /^(\s*)?(\+)?([- _():=+]?\d[- _():=+]?){10,14}(\s*)?$/
const infoText = "Наши специалисты расскажут о возможностях аналитической платформы MedMinds применительно для вашего бизнеса."

function PresentationOrder() {
    return (
            <div className=''>
                <FormPresentation/>
            </div>
    )

}

function FormPresentation() {
    const initialFormState = {
        loading: false,
        message: "",
    };

      const initialFormDataState = {
        firstName: "",
        secondName: "",
        surname: "",
        phone: "",
        email: "",
        company: "",
        post: "",
        details: "",
    };

      const initialErrorsState = {
        firstName: "",
        secondName: "",
        phone: "",
        email: "",
        company: "",
        post: "",
    };

      const initialIsCorrectInputState = {
        firstName: false,
        secondName: false,
        phone: false,
        email: false,
        company: false,
        post: false,
    };

      const initialIsDirtyState = {
        firstName: false,
        secondName: false,
        phone: false,
        email: false,
        company: false,
        post: false,
    };

    const [FormState, setFormState] = useState(initialFormState);
    const [formData, setFormData] = useState(initialFormDataState);
    const [isDirty, setDirty] = useState(initialIsDirtyState);
    const [isCorrectInput, setIsCorrectInput] = useState(initialIsCorrectInputState);
    const [errors, setErrors] = useState(initialErrorsState);

    const [isFormValid, setIsFormValid] = useState(false);

    useEffect(() => {
        if(
            isCorrectInput.firstName && 
            isCorrectInput.secondName && 
            isCorrectInput.phone && 
            isCorrectInput.email && 
            isCorrectInput.company &
            isCorrectInput.post
        ) {
            setIsFormValid(true);
        } else {
            setIsFormValid(false);
        }
    }, [isCorrectInput])

    const handleBlur = (e) => {
        setFormState(initialFormState);
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
            case 'firstName':
                if (value.length < 1) {
                    setErrors(prev=> ({
                        ...prev,
                        firstName: "Поле не может быть пустым"
                     }));
                     setIsCorrectInput(prev=> ({
                        ...prev,
                        firstName: false
                     }));
                } else {
                    setErrors(prev=> ({
                        ...prev,
                        firstName: ""
                    }));
                    setIsCorrectInput(prev=> ({
                        ...prev,
                        firstName: true
                     }));
                }
                break;
                case 'secondName':
                    if (value.length < 1) {
                        setErrors(prev=> ({
                            ...prev,
                            secondName: "Поле не может быть пустым"
                         }));
                         setIsCorrectInput(prev=> ({
                            ...prev,
                            secondName: false
                         }));
                    } else {
                        setErrors(prev=> ({
                            ...prev,
                            secondName: ""
                        }));
                        setIsCorrectInput(prev=> ({
                            ...prev,
                            secondName: true
                         }));
                    }
                    break;
                    case 'phone':
                    if (!PHONE_NUMBER_REGEXP.test(value)) {
                        setErrors(prev=> ({
                            ...prev,
                            phone: "Некорректный номер"
                         }));
                         setIsCorrectInput(prev=> ({
                            ...prev,
                            phone: false
                         }));
                    } else {
                        setErrors(prev=> ({
                            ...prev,
                            phone: ""
                        }));
                        setIsCorrectInput(prev=> ({
                            ...prev,
                            phone: true
                         }));
                    }
                    break;
                    case 'company':
                        if (value.length < 1) {
                            setErrors(prev=> ({
                                ...prev,
                                company: "Поле не может быть пустым"
                             }));
                             setIsCorrectInput(prev=> ({
                                ...prev,
                                company: false
                             }));
                        } else {
                            setErrors(prev=> ({
                                ...prev,
                                company: ""
                            }));
                            setIsCorrectInput(prev=> ({
                                ...prev,
                                company: true
                             }));
                        }
                        break;
                        case 'post':
                            if (value.length < 1) {
                                setErrors(prev=> ({
                                    ...prev,
                                    post: "Поле не может быть пустым"
                                 }));
                                 setIsCorrectInput(prev=> ({
                                    ...prev,
                                    post: false
                                 }));
                            } else {
                                setErrors(prev=> ({
                                    ...prev,
                                    post: ""
                                }));
                                setIsCorrectInput(prev=> ({
                                    ...prev,
                                    post: true
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

    const handleSubmit = () => {
        console.log("Submit!")
    }


    return (
        <form className='main-form wrapper_form'>
            <div className='main-form__headline'>
                Заказать презентацию
            </div>
            <div className='main-form__text'>
                <div className='main-form__info_contacts'>
                    {infoText}
                </div>
                { FormState.message && <div className='main-form__error-message'>{FormState.message}</div> }
            </div>
            <div className='main-form__fuilds-wrapper'>

                <label className='main-form__label'>
                    Фамилия<span style={{color:'red'}}> *</span>
                </label>
                <div className= {
                            !errors.secondName ? 
                                'main-form__input'
                                :'main-form__input main-form__input_error'}
                >
                    <input 
                        className='main-form__input__text'
                        type="text" 
                        name="secondName" 
                        placeholder='Введите фамилию'
                        maxlength={200}
                        value={formData.secondName} 
                        onBlur={handleBlur}
                        onChange={handleChange} 
                    />
                </div>
                { (isDirty.secondName && errors.secondName) && <div className='main-form__error-message'>{ errors.secondName }</div> }
                <label className='main-form__label'>
                    Имя<span style={{color:'red'}}> *</span>
                </label>
                <div className= {
                            !errors.firstName ? 
                                'main-form__input'
                                :'main-form__input main-form__input_error'}
                >
                    <input 
                        className='main-form__input__text'
                        type="text" 
                        name="firstName" 
                        placeholder='Введите имя'
                        maxlength={200}
                        value={formData.firstName} 
                        onBlur={handleBlur}
                        onChange={handleChange} 
                    />
                </div>
                { (isDirty.firstName && errors.firstName) && <div className='main-form__error-message'>{ errors.firstName }</div> }
                <label className='main-form__label'>
                    Отчество
                </label>
                <div 
                    className= 'main-form__input'
                >
                    <input 
                        className='main-form__input__text'
                        type="text" 
                        name="surname" 
                        placeholder='Введите отчество'
                        maxlength={200}
                        value={formData.surname} 
                        onBlur={handleBlur}
                        onChange={handleChange} 
                    />
                </div>
                    
                <label className='main-form__label'>
                    Телефон<span style={{color:'red'}}> *</span>
                </label>
                <div className= {
                            !errors.phone ? 
                                'main-form__input'
                                :'main-form__input main-form__input_error'}
                >
                    <input 
                        className='main-form__input__text'
                        type="text" 
                        name="phone" 
                        placeholder='Введите номер телефона'
                        maxlength={200}
                        value={formData.phone} 
                        onBlur={handleBlur}
                        onChange={handleChange} 
                    />
                </div>
                { (isDirty.phone && errors.phone) && <div className='main-form__error-message'>{ errors.phone }</div> }

                <label className='main-form__label'>
                    Email<span style={{color:'red'}}> *</span>
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
                        maxlength={200}
                        value={formData.email} 
                        onBlur={handleBlur}
                        onChange={handleChange} 
                    />
                </div>
                { (isDirty.email && errors.email) && <div className='main-form__error-message'>{ errors.email }</div> }

                <label className='main-form__label'>
                    Компания<span style={{color:'red'}}> *</span>
                </label>
                <div className= {
                            !errors.company ? 
                                'main-form__input'
                                :'main-form__input main-form__input_error'}
                >
                    <input 
                        className='main-form__input__text'
                        type="text" 
                        name="company" 
                        placeholder='Введите название Вашей компании'
                        maxlength={200}
                        value={formData.company} 
                        onBlur={handleBlur}
                        onChange={handleChange} 
                    />
                </div>
                { (isDirty.company && errors.company) && <div className='main-form__error-message'>{ errors.company }</div> }

                <label className='main-form__label'>
                    Должность<span style={{color:'red'}}> *</span>
                </label>
                <div className= {
                            !errors.post ? 
                                'main-form__input'
                                :'main-form__input main-form__input_error'}
                >
                    <input 
                        className='main-form__input__text'
                        type="text" 
                        name="post" 
                        placeholder='Введите email'
                        maxlength={200}
                        value={formData.post} 
                        onBlur={handleBlur}
                        onChange={handleChange} 
                    />
                </div>
                { (isDirty.post && errors.post) && <div className='main-form__error-message'>{ errors.post }</div> }

                <label className='main-form__label'>
                    Сообщение
                </label>
                <div 
                    className='main-form__input main-form__input_message'
                >
                    <input 
                        className='main-form__input__text main-form__input__text_message'
                        type="text" 
                        name="details" 
                        contenteditable="true"
                        placeholder='Напишите отзыв или вопрос'
                        maxlength={200}
                        value={formData.details} 
                        onBlur={handleBlur}
                        onChange={handleChange} 
                    />
                </div>
            </div>
            <div className='main-form__bottom_center'>
                <input 
                    className={ 
                        isFormValid ? 
                            'button button_default'
                            : 'button button_disable'
                    }
                    type="button" 
                    value="Отправить" 
                    onClick={
                        isFormValid ? 
                            handleSubmit
                            : null
                    }
                />
            </div>
        </form>
)
}

export { PresentationOrder };