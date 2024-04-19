import { Form, json, useLoaderData } from "react-router-dom";
import { useEffect, useState } from "react";

import avatar_default from "../../theme/img/app/avatar.svg"
import eyeOpen from "../../theme/img/forms/eye-open.svg"
import eyeOff from "../../theme/img/forms/eye-off.svg"
import uploadIcon from "../../theme/img/profile/button_upload_photo.svg"
import deleteIcon from "../../theme/img/profile/button_delete_photo.svg"

import { useSelector } from "react-redux";

const acceptFiles = ".png, .jpg"
const personalDataFuilds = [
    {
        label: "Фамилия",
        name: "middle_name",
        placeholder: "Введите фамилию"
    },
    {
        label: "Имя",
        name: "first_name",
        placeholder: "Введите Имя"
    },
    {
        label: "Отчество",
        name: "last_name",
        placeholder: "Введите Отчество"
    },
    {
        label: "Email",
        name: "email",
        placeholder: "Введите Email"
    },
    {
        label: "Телефон",
        name: "phone_number",
        placeholder: "Пример: +7(000)000-00-00"
    },
]


export const sendProfileFormData = async ({request}) => {
    let formData = await request.formData();
    let intent = formData.get("intent");

    if (intent === "add_avatar") {
        await (formData);
        return { ok: true };
    }

    if (intent === "delete_avatar") {
    await (formData);
    return { ok: true };
    }

    if (intent === "edit_profile_data") {
        await (formData);
        return { ok: true };
    }
    
    if (intent === "edit_password") {
        await (formData);
        return { ok: true };
    }

    if (intent === "delete_profile") {
        await (formData);
        return { ok: true };
    }
    
    throw json(
        { message: "Invalid intent" },
        { status: 400 }
    );
} 

function Profile() {
    const avatar = avatar_default; //= data.avatar;

    return (
        <div className="profile-wrapper">
            <div className="profile-wrapper__grid-pos-1">
                <AvatarSettings avatar={avatar}/>
            </div>
            <div className="profile-wrapper__grid-pos-2">
                <PersonalDataSettings />
            </div>
            <div className="profile-wrapper__grid-pos-3">
                <PasswordChange />
            </div>
            <div className="profile-wrapper__grid-pos-4">
                <DeleteProfile />
            </div>
        </div>
    )
}

function AvatarSettings(props) {
    const {avatar} = props;

    function handleUpload() {

        // validste and send to server
        console.log("Uploaded!");
        // show dialog window 
    }

    function handleDelete() {

        // validste and send to server
        console.log("Deleted!");
        // show dialog window 
    }


return (
    <div className="profile___inner-wrapper">
        <div className="profile___inner-wrapper__flex">
        <div className="profile___avatar-settings__avatar">
            <img 
                className="profile___avatar-settings__avatar__img"
                src={avatar} 
                alt="avatar" 
            />
        </div>

        <div className="profile___avatar-settings__button-wrapper">
            <input 
                type="file" 
                name="upload-avatar"
                accept={acceptFiles}
                id="upload-avatar"
                className='profile___avatar-settings__button_upload'
                onChange={handleUpload}
            />
            <label for="upload-avatar" className="profile___avatar-settings__button__label-wrapper">
                    <img 
                        className="profile___avatar-settings__button__label__icon"
                        src={uploadIcon} 
                        alt="icon"
                    />
                <div className="profile___avatar-settings__button__label__text">
                    Загрузить фото
                </div>
            </label>
        </div>
        <div className="profile___avatar-settings__button-wrapper">
            <label for="upload-avatar" className="profile___avatar-settings__button__label-wrapper">
                    <img 
                        className="profile___avatar-settings__button__label__icon"
                        src={deleteIcon} 
                        alt="icon"
                    />
                <div className="profile___avatar-settings__button__label__text">
                    Удалить фото
                </div>
            </label>
        </div>

        </div>
    </div>
)
}


function PersonalDataSettings(props){
    const {data} = props;
    
    const initialFormDataState = {
        middle_name: useSelector((state) => state.userData.middle_name),
        first_name: useSelector((state) => state.userData.first_name),
        last_name: useSelector((state) => state.userData.middle_name),
        email: useSelector((state) => state.userData.email),
        phone_number: useSelector((state) => state.userData.phone_number),
    };

    const [formData, setFormData] = useState(initialFormDataState);
    const handleChange = (event) => {
        const {name, value} = event.target;
        setFormData(prevFormData => ({
            ...prevFormData,
            [name]: value
        }));
    }

    const fuilds = personalDataFuilds.map((item, index) => {
        const value = formData[item.name];
        return (
            <p className="profile_fuild-conteiner" key={index}>
                <div className='profile__label'>
                    {item.label}
                </div>
                <div className="profile__input">
                    <input 
                        className='profile__input__text'
                        type="text" 
                        name={item.name} 
                        placeholder={item.placeholder}
                        value={value}
                        onChange={handleChange} 
                    />
                </div>
            </p>
        )
    })
    return (
        <div className="profile___inner-wrapper">
            <div className="profile__headline">
                Личные данные
            </div>
            <Form 
                method="POST"
                className="profile___personal-settings__fuilds-container"
            >
                {fuilds}
                <button 
                    className="button button_default button_center"
                    type="submit"
                    name="intent"  
                    value="edit_profile_data"
                >
                        Сохранить
                </button>
            </Form>
        </div>
    )
}

function PasswordChange(){

    const [isHidden, setIsHidden] = useState(true);
    
    const handleHidePassword = () => {
        setIsHidden(prevErrors=> setIsHidden(!prevErrors))
    }

    return (
        <div className="profile___inner-wrapper">
            <div className="profile__headline profile__headline_center">
                Изменить пароль
            </div>
            <Form className="profile___personal-settings__fuilds-container_password">
                <p className="profile_fuild-conteiner_passsword">
                    <div className='profile__label profile__label_password'>
                        Старый пароль
                    </div>
                    <div 
                        className="profile__input_password"
                    >
                    <input 
                        className='main-form__password-fuild__input'
                        type={
                            isHidden?
                            'password'
                            :'text'
                        }
                        name="password" 
                        placeholder='Введите старый пароль'
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
                </p>

                <p className="profile_fuild-conteiner_passsword">
                    <div className='profile__label profile__label_password'>
                        Повторите пароль
                    </div>
                    <div 
                        className="profile__input_password"
                    >
                    <input 
                        className='main-form__password-fuild__input'
                        type={
                            isHidden?
                            'password'
                            :'text'
                        }
                        name="password" 
                        placeholder='Повторите старый пароль'
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
                </p>

                <p className="profile_fuild-conteiner_passsword">
                    <div className='profile__label profile__label_password'>
                        Новый пароль
                    </div>
                    <div 
                        className="profile__input_password"
                    >
                    <input 
                        className='main-form__password-fuild__input'
                        type={
                            isHidden?
                            'password'
                            :'text'
                        }
                        name="password" 
                        placeholder='Введите новый пароль'
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
                </p>

                <button 
                    className="button button_default button_center"
                    type="submit"
                    name="intent"  
                    value="edit_password"
                >
                        Изменить
                </button>
            </Form>
        </div>
    )
}


function DeleteProfile(){

    const [isHidden, setIsHidden] = useState(true);
    
    const handleHidePassword = () => {
        setIsHidden(prevErrors=> setIsHidden(!prevErrors))
    }

    return (
        <div className="profile___inner-wrapper">
            <div className="profile__headline profile__headline_center">
                Удалить профиль
            </div>
            <Form className="profile___personal-settings__fuilds-container_password">
                <p className="profile_fuild-conteiner_passsword">
                    <div className='profile__label profile__label_password'>
                        Пароль
                    </div>
                    <div 
                        className="profile__input_password"
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
                </p>

                <p className="profile_fuild-conteiner_passsword">
                    <div className='profile__label profile__label_password'>
                        Повторите пароль
                    </div>
                    <div 
                        className="profile__input_password"
                    >
                    <input 
                        className='main-form__password-fuild__input'
                        type={
                            isHidden?
                            'password'
                            :'text'
                        }
                        name="password" 
                        placeholder='Повторите пароль'
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
                </p>
                <p className="profile__checkbox">
                    <input 
                        type="checkbox" 
                        name="agreement" 
                        value="AGREE"
                    /> 
                    <div className="profile__checkbox__text">
                        Я принимаю, что все мои данные и информация о проектах будут безвозвратно удалены
                    </div>
                </p>
                <button 
                    className="button button_default button_center"
                    type="submit"
                    name="intent"  
                    value="delete_profile"
                >
                        Удалить
                </button>
            </Form>
        </div>
    )
}


export { Profile }