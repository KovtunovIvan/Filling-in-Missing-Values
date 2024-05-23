
import { Form, useActionData} from 'react-router-dom';
import { useEffect, useState } from "react";
import { sendPresentationOrder } from '../../api/userApi';
import { SuccessfulSubmitWindow } from '../../components/main/SuccessfulSubmitWindow';


const EMAIL_REGEXP = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
const PHONE_NUMBER_REGEXP = /^(\s*)?(\+)?([- _():=+]?\d[- _():=+]?){10,14}(\s*)?$/

const infoText = "Наши специалисты расскажут о возможностях аналитической платформы MedMinds применительно для вашего бизнеса."

export const sendPresFormData = async ({params, request}) => {
    let formData = await request.formData();
    const response = await sendPresentationOrder(formData).then(
        (response) => {
            return {msg: response.data, error: undefined}
        }, 
        (error) => {
            return {msg: undefined, error: "Неизвестная ошибка. Попробуйте снова через 1-2 минуты."}
        }
    )
    return response;
}


export function PresentationOrder() {
    return (
            <div className='form-container'>
                <FormPresentation/>
            </div>
    )

}

function FormPresentation() {
    const initialFormState = {
        loading: false,
        message: "",
        success: false,
    };

      const initialFormDataState = {
        first_Name: "",
        last_name: "",
        middle_name: "",
        phone: "",
        email: "",
        company: "",
        position: "",
        message: "",
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

    const [formState, setFormState] = useState(initialFormState);
    const [formData, setFormData] = useState(initialFormDataState);
    const [isDirty, setDirty] = useState(initialIsDirtyState);
    const [isCorrectInput, setIsCorrectInput] = useState(initialIsCorrectInputState);
    const [errors, setErrors] = useState(initialErrorsState);

    const [isFormValid, setIsFormValid] = useState(false);

    const actionData = useActionData()

    useEffect(() => {
        if(actionData){
            const {msg, error} = actionData;
            if(msg){
                if(msg.error){
                    setFormState( {
                        loading: false,
                        message: msg.error,
                        success: false,
                    })
                } else {
                    setFormState( {
                        loading: false,
                        message: "",
                        success: true,
                    })
                }
            } else {
                if(error){
                    setFormState( {
                        loading: false,
                        message: error,
                        success: false,
                    })
                }
            }
        }

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
    }, [isCorrectInput, actionData])

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

    const handleReturnForm = () => {
        setFormState({
            loading: false,
            message: "",
            success: false,
        })
    } 
    const submitInfo = {
        title: "Спасибо за отзыв!",
        message: " Специалисты MedMinds свяжутся с Вами в течение 1-3 рабочих дней по указанной электронной почте или номеру телефона.",
    }
    return (
        <>
        {
            formState.success ? 
                <SuccessfulSubmitWindow 
                    title={submitInfo.title}
                    message={submitInfo.message}
                    setter={handleReturnForm}
                />
                :
                <Form
                    method='POST'
                    className='main-form'>
                    <div className='main-form__headline'>
                        Заказать презентацию
                    </div>
                    <div className='main-form__text'>
                        <div className='main-form__info_contacts'>
                            {infoText}
                        </div>
                        { formState.message && <div className='main-form__error-message'>{formState.message}</div> }
                    </div>
                    <div className='main-form__fuilds-wrapper'>

                        <label className='main-form__label'>
                            Фамилия<span style={{color:'red'}}> *</span>
                        </label>
                        <div className= {
                                    !errors.secondName || !isDirty.secondName ? 
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
                                    !errors.firstName || !isDirty.firstName? 
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
                                    !errors.phone || !isDirty.phone? 
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
                                    !errors.email || !isDirty.email? 
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
                                    !errors.company || !isDirty.company? 
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
                        {
                            isFormValid ?
                                <button 
                                    className='button button_default'
                                    type="submit" 
                                    value="Отправить" 
                                >
                                    Отправить
                                </button>
                                : <button 
                                    className='button button_disable'
                                    disabled
                                >
                                    Отправить
                                </button>
                        }
                    </div>
                </Form>
        }
        </>
    )
}