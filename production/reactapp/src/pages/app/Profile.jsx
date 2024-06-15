import { Form, json, redirect, useFetcher } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import eyeOpen from "../../theme/img/forms/eye-open.svg"
import eyeOff from "../../theme/img/forms/eye-off.svg"
import uploadIcon from "../../theme/img/profile/button_upload_avatar.svg"
import deleteIcon_active from "../../theme/img/profile/button_delete_avatar_active.svg"
import deleteIcon_disable from "../../theme/img/profile/button_delete_avatar_disable.svg"
import { changePassword, deleteAvatar, deleteProfile, getAvatarByURL, updateProfile, uploadAvatar } from "../../api/userApi";
import userPhoto from "../../theme/img/app/avatar.svg"
import { Modal } from "../../components/app/Modal";
import { LocalStorageTools } from "../../localStorage";
import { Loader } from "../../components/optional/Loader";
import { fetchUser } from "../../redux/userData";

const PHONE_NUMBER_REGEXP = /^(\s*)?(\+)?([- _():=+]?\d[- _():=+]?){10,14}(\s*)?$/


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
        placeholder: "Введите имя"
    },
    {
        label: "Отчество",
        name: "last_name",
        placeholder: "Введите отчество"
    },
    {
        label: "Email",
        name: "email",
        placeholder: "Введите email"
    },
    {
        label: "Телефон",
        name: "phone_number",
        placeholder: "Пример: +7(000)000-00-00"
    },
]

const SuccessUpdateProfileModal = {
    title: "Успешно!",
    msg: "Изменения в данных профиля сохранены.",
};

const ServerErrorModal = {
    title: "Неизвестная ошибка!",
    msg: "Пожалуйста, перезагрузите страницу или спустя 1-2 минуты попробуйте снова.",
};

const SizeFileErrorModal = {
    title: "Внимание!",
    msg: "Пожалуйста, выберите файл размером не более 10МБ.",
};

const InvalidPasswordModal = {
    title: " Ошибка!",
    msg: (<>Пароль неверный.<br/>Введите корректный пароль.</>),
};

const IncorrectPassLengthModal = {
    title: "Ошибка!",
    msg: "Пароль должен содержать не менее 8 символов.",
};

const IncorrectPhoneFormatModal = {
    title: "Ошибка!",
    msg: (<>Неккоректный формат номера телефона.<br/>Пример: +7(000)000-00-00</>),
};

const PassMatchErrorModal = {
    title: "Ошибка!",
    msg: "Введённые пароли не совпадают.",
};


export function Profile() {
    return (
        <div className="profile-wrapper">
            <div className="profile-wrapper__grid-pos-1">
                <AvatarSettings/>
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

function AvatarSettings() {
    const dispatch = useDispatch();
    const uploudedAvatarUrl = useSelector((state) => state.userData.avatar);
    let avatarSrc = uploudedAvatarUrl ? getAvatarByURL(uploudedAvatarUrl): userPhoto;
    const deleteAvatarButtonStyle = uploudedAvatarUrl ? deleteIcon_active : deleteIcon_disable;

    const fetcher = useFetcher()
    const [isLoading, setloading] = useState(false);

    const [modalActive, setModalActive] = useState(false);
    const [modalContent, setModelContent] = useState(ServerErrorModal);

    useEffect(()=>{
        if(fetcher.state === 'submitting'){
            setloading(true);
        } else {
            setloading(false);
        }

        avatarSrc = uploudedAvatarUrl ? getAvatarByURL(uploudedAvatarUrl): userPhoto;

        if(fetcher.data){
            const { intent, msg } = fetcher.data;
            console.log(intent)
            switch(intent) {
                //Загрузить аватар
                case "add_avatar":
                    if(msg === "OK"){
                        dispatch(fetchUser());
                    } else {
                        if(msg === "file size exceeds 10MB"){
                            setModelContent(SizeFileErrorModal);
                            setModalActive(true);
                        } else {
                            setModelContent(ServerErrorModal);;
                            setModalActive(true);
                        }
                    }
                    break;
                //Удалить аватар
                case "delete_avatar":
                    if(msg === "OK"){
                        dispatch(fetchUser());
                    } else {
                        setModelContent(ServerErrorModal);;
                        setModalActive(true);
                    }
                    break;
                default:
                    setModelContent(ServerErrorModal);;
                    setModalActive(true);
            }
        }

    }, [fetcher])

    function handleUpload(e) {
        fetcher.submit(e.currentTarget,{
            method: "post",
            action: "/app/profile",
          });
    }

    function handleDelete(e) {
        if(uploudedAvatarUrl) {
            fetcher.submit(e.currentTarget,{
                method: "delete",
                action: "/app/profile",
              });
        }
    }

return (
    <> 
        <Modal 
            active={modalActive}
            setActive={setModalActive}
        > 
            <div className="modal__content__title">
                {modalContent.title}
            </div>
            <div className="modal__content__msg">
                {modalContent.msg}
            </div>
            <div className="modal__content__bottom">
                <button
                    className="button button_default modal__content__button_ok"
                    onClick={() => setModalActive(false)}>
                    OK
                </button>
            </div>
        </Modal>
        <Loader active={isLoading} />
        <div className="profile___inner-wrapper">
            <div className="profile___inner-wrapper__flex">
            <div className="profile___avatar-settings__avatar">
                <img 
                    className="profile___avatar-settings__avatar__img"
                    src={avatarSrc} 
                    alt="avatar" 
                />
            </div>

            <Form 
                id="avatar-upload-form"
                className="profile___avatar-settings__button-wrapper"
                onChange={handleUpload}
            >
                <input 
                    type="file" 
                    name="upload-avatar"
                    accept={acceptFiles}
                    id="upload-avatar"
                    className='profile___avatar-settings__button_upload'
                />
                <input name="intent" value="add_avatar" className="profile___avatar-settings__button_upload"/>
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

            </Form>
            <Form 
                id="avatar-delete-form"
                method="DELETE"
                className="profile___avatar-settings__button-wrapper"
                onClick={handleDelete}
            >
                <label for="delete-avatar" className="profile___avatar-settings__button__label-wrapper">
                    <img 
                        className="profile___avatar-settings__button__label__icon"
                        src={deleteAvatarButtonStyle} 
                        alt="icon"
                    />
                <input name="intent" value="delete_avatar" className="profile___avatar-settings__button_upload"/>
                <div className="profile___avatar-settings__button__label__text">
                    Удалить фото
                </div>
                </label>
            </Form>
            </div>
        </div>
    </>
    
)
}


function PersonalDataSettings(props){
    const fetcher = useFetcher()
    const [isLoading, setloading] = useState(false);

    const [modalActive, setModalActive] = useState(false);
    const [modalContent, setModelContent] = useState(ServerErrorModal);
    
    const initialFormDataState = {
        middle_name: useSelector((state) => state.userData.middle_name),
        first_name: useSelector((state) => state.userData.first_name),
        last_name: useSelector((state) => state.userData.last_name),
        email: useSelector((state) => state.userData.email),
        phone_number: useSelector((state) => state.userData.phone_number),
    };

    useEffect(()=>{
        if(fetcher.state === 'submitting'){
            console.log(fetcher.state)
            setloading(true);
        } else {
            setloading(false);
        }
    }, [fetcher.state])

    
    useEffect(()=>{
        if(fetcher.data){
            const { intent, msg } = fetcher.data;
            if(msg === "Incorrect phone number"){
                setModelContent(IncorrectPhoneFormatModal);
                setModalActive(true)
            }
            if(msg === "OK"){
                setModelContent(SuccessUpdateProfileModal);
                setModalActive(true)
            }
        }
    }, [fetcher.data])

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
        if(item.name === "email"){
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
                        disabled
                    />
                </div>
            </p>
            )
        }
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
        <>
            <Modal 
                active={modalActive}
                setActive={setModalActive}
            > 
                <div className="modal__content__title">
                    {modalContent.title}
                </div>
                <div className="modal__content__msg">
                    {modalContent.msg}
                </div>
                <div className="modal__content__bottom">
                    <button
                        className="button button_default modal__content__button_ok"
                        onClick={() => setModalActive(false)}>
                        OK
                    </button>
                </div>
            </Modal>
            <Loader active={isLoading} />

            <div className="profile___inner-wrapper">
                <div className="profile__headline">
                    Личные данные
                </div>
                <fetcher.Form 
                    method="PUT"
                    className="profile___personal-settings__fuilds-container"
                >
                    {fuilds}
                    <button 
                        className="button button_default button_center"
                        type="submit"
                        name="intent"  
                        value="update_profile"
                    >
                            Сохранить
                    </button>
                </fetcher.Form>
            </div>
        </>
    )
}

function PasswordChange(){
    const fetcher = useFetcher()
    const [isLoading, setloading] = useState(false);

    const [modalActive, setModalActive] = useState(false);
    const [modalContent, setModelContent] = useState(ServerErrorModal);

    const initialFormDataState = {
        old_password: "",
        new_password: "",
        repeat: "",
    };

    const [formData, setFormData] = useState(initialFormDataState);
    const [isActive, setIsActive] = useState(false);

    const [isHiddenOldnPassword, setIsHiddenOldnPassword] = useState(true);
    const [isHiddenNewPassword, setIsHiddenNewPassword] = useState(true);
    const [isHiddenRepeat, setIsHiddenRepeat] = useState(true);

    useEffect(()=>{
        if(fetcher.state === 'submitting'){
            setloading(true);
        } else {
            setloading(false);
        }
    }, [fetcher.state])

    useEffect(()=>{
        if(formData.old_password !== "" && formData.new_password !== "" && formData.repeat !== ""){
            setIsActive(true)
        } else {
            setIsActive(false);
        }
    }, [formData])

    useEffect(()=>{
        if(fetcher.data){
            const { intent, msg } = fetcher.data;
            console.log(intent)
                //Изменить пароль
            if(msg === "OK"){
                setModelContent(SuccessUpdateProfileModal);
                setModalActive(true)
            }
            if(msg === "Invalid old password"){
                setModelContent(InvalidPasswordModal);
                setModalActive(true)
            }
            if(msg === "Incorrect password length"){
                setModelContent(IncorrectPassLengthModal);
                setModalActive(true)
            }
            if(msg === "Passwords don't match"){
                setModelContent(PassMatchErrorModal);
                setModalActive(true)
            }
        }
    }, [fetcher.data])

    const handleChange = (event) => {
        const {name, value} = event.target;
        setFormData(prevFormData => ({
            ...prevFormData,
            [name]: value
        }));
    }

    return (
        <>
            <Modal 
                active={modalActive}
                setActive={setModalActive}
            > 
                <div className="modal__content__title">
                    {modalContent.title}
                </div>
                <div className="modal__content__msg">
                    {modalContent.msg}
                </div>
                <div className="modal__content__bottom">
                    <button
                        className="button button_default modal__content__button_ok"
                        onClick={() => setModalActive(false)}>
                        OK
                    </button>
                </div>
            </Modal>
            <Loader active={isLoading} />
            <div className="profile___inner-wrapper">
                <div className="profile__headline profile__headline_center">
                    Изменить пароль
                </div>
                <fetcher.Form 
                    method="PUT"
                    className="profile___personal-settings__fuilds-container_password">
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
                                isHiddenOldnPassword?
                                'password'
                                :'text'
                            }
                            name="old_password" 
                            placeholder='Введите старый пароль'
                            onChange={handleChange}
                        />
                            <img 
                                className='eye'
                                src={
                                    isHiddenOldnPassword?
                                    eyeOff
                                    : eyeOpen         
                                } 
                                onClick={() => setIsHiddenOldnPassword(prevState => !prevState)}
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
                                isHiddenNewPassword?
                                'password'
                                :'text'
                            }
                            name="new_password" 
                            placeholder='Введите новый пароль'
                            onChange={handleChange}
                        />
                            <img 
                                className='eye'
                                src={
                                    isHiddenNewPassword?
                                    eyeOff
                                    : eyeOpen         
                                } 
                                onClick={() => setIsHiddenNewPassword(prevState => !prevState)}
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
                                isHiddenRepeat?
                                'password'
                                :'text'
                            }
                            name="repeat" 
                            placeholder='Повторите новый пароль'
                            onChange={handleChange}
                        />
                            <img 
                                className='eye'
                                src={
                                    isHiddenRepeat?
                                    eyeOff
                                    : eyeOpen         
                                } 
                                onClick={() => setIsHiddenRepeat(prevState => !prevState)}
                                alt="Hide the password"/>
                        </div>
                    </p>

                    {
                        isActive ?
                        <button 
                            className="button button_default button_center"
                            type="submit"
                            name="intent"  
                            value="change_password"
                        >
                            Изменить
                        </button>
                        : <button 
                            className="button button_desable button_center"
                            disabled
                        >
                            Изменить
                        </button>
                    }
                </fetcher.Form>
            </div>
        </>
        
    )
}


function DeleteProfile(){
    const fetcher = useFetcher()
    const [isLoading, setloading] = useState(false);

    const [modalActive, setModalActive] = useState(false);
    const [modalContent, setModelContent] = useState(ServerErrorModal);

    useEffect(()=>{
        if(fetcher.state === 'submitting'){
            setloading(true);
        } else {
            setloading(false);
        }

    }, [fetcher.state])

    useEffect(()=>{
        if(fetcher.data){
            const { intent, msg } = fetcher.data;
            if(msg === "incorrect password length"){
                setModelContent(IncorrectPassLengthModal);
                setModalActive(true)
            }
            if(msg === "Invalid password"){
                setModelContent(InvalidPasswordModal);
                setModalActive(true)
            }
            if(msg === "Passwords don't match"){
                setModelContent(PassMatchErrorModal);
                setModalActive(true)
            }
        }
    }, [fetcher.data])

    const initialFormDataState = {
        password: "",
        repeat: "",
    };

    const [formData, setFormData] = useState(initialFormDataState);

    const [isHiddenPassword, setIsHiddenPassword] = useState(true);
    const [isHiddenRepeat, setIsHiddenRepeat] = useState(true);
    const [isAgree, setIsAgree] = useState(false);
    const [isActive, setIsActive] = useState(false);

    const handleAgree = (e) => {
        if(e.target.checked) {
            setIsAgree(true);
        } else {
            setIsAgree(false);
        }
    } 

    useEffect(()=>{
        if(formData.password !== "" && formData.repeat !== "" && isAgree){
            setIsActive(true)
        } else {
            setIsActive(false);
        }
    }, [formData, isAgree])

    const handleChange = (event) => {
        const {name, value} = event.target;
        setFormData(prevFormData => ({
            ...prevFormData,
            [name]: value
        }));
    }

    return (
        <>
            <Modal 
                active={modalActive}
                setActive={setModalActive}
            > 
                <div className="modal__content__title">
                    {modalContent.title}
                </div>
                <div className="modal__content__msg">
                    {modalContent.msg}
                </div>
                <div className="modal__content__bottom">
                    <button
                        className="button button_default modal__content__button_ok"
                        onClick={() => setModalActive(false)}>
                        OK
                    </button>
                </div>
            </Modal>
            <Loader active={isLoading} />
            <div className="profile___inner-wrapper">
                <div className="profile__headline profile__headline_center">
                    Удалить профиль
                </div>
                <fetcher.Form
                    method="DELETE" 
                    className="profile___personal-settings__fuilds-container_password">
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
                                isHiddenPassword?
                                'password'
                                :'text'
                            }
                            name="password" 
                            placeholder='Введите пароль'
                            onChange={handleChange}
                        />
                            <img 
                                className='eye'
                                src={
                                    isHiddenPassword?
                                    eyeOff
                                    : eyeOpen         
                                } 
                                onClick={() => setIsHiddenPassword(prevState => !prevState)}
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
                                isHiddenRepeat?
                                'password'
                                :'text'
                            }
                            name="repeat" 
                            placeholder='Повторите пароль'
                            onChange={handleChange}
                        />
                            <img 
                                className='eye'
                                src={
                                    isHiddenRepeat?
                                    eyeOff
                                    : eyeOpen         
                                } 
                                onClick={() => setIsHiddenRepeat(prevState => !prevState)}
                                alt="Hide the password"/>
                        </div>
                    </p>
                    <p className="profile__checkbox">
                        <input 
                            type="checkbox" 
                            name="agreement" 
                            value="AGREE"
                            onChange={handleAgree}
                        /> 
                        <div className="profile__checkbox__text">
                            Я принимаю, что все мои данные и информация о проектах будут безвозвратно удалены
                        </div>
                    </p>

                    {
                        isActive ?
                            <button 
                                className="button button_default button_center"
                                type="submit"
                                name="intent"  
                                value="delete_profile"
                            >
                                Удалить
                            </button>
                            : <button 
                            className="button button_desable button_center"
                            disabled
                        >
                            Удалить
                        </button>
                    }
                </fetcher.Form>
            </div>
        </>
    )
}


export const sendProfileFormData = async ({params, request}) => {
    let formData = await request.formData();
    let intent = formData.get("intent");
    formData.delete("intent")

    // Загрузить аватар
    if (intent === "add_avatar") {
        const selectedFile = document.getElementById("upload-avatar").files[0];
        let newFormData =  new FormData();
        if(selectedFile['size'] > 10485760){
            return {
                intent: intent,
                msg: "file size exceeds 10MB"
            }
        }
        newFormData.append("avatar", selectedFile)
        const response = await uploadAvatar(newFormData).then(
            (response) => {
                switch (response.status) {
                    case 200: 
                        return {
                            intent: intent,
                            msg: "OK"
                        }
                    default:
                        return {
                            intent: intent,
                            msg: "Unknown error"
                        }
                }
            }, (error) => {
                switch (error.response.status) {
                    case 400: 
                        return {
                            intent: intent,
                            msg: "No avatar file provided"
                        }
                    case 401: 
                    return {
                        intent: intent,
                        msg: "Authentication failed"
                    }
                    default:
                        return {
                            intent: intent,
                            msg: "Unknown error"
                        }
                }
            }
        )
        return response;
    }
    // Удалить аватар
    if (intent === "delete_avatar") {
        const response = await deleteAvatar().then(
            (response) => {
                switch (response.status) {
                    case 200: 
                        return {
                            intent: intent,
                            msg: "OK"
                        }
                    default:
                        return {
                            intent: intent,
                            msg: "Unknown error"
                        }
                }
            }, (error) => {
                switch (error.response.status) {
                    case 400: 
                        return {
                            intent: intent,
                            msg: "No avatar file provided"
                        }
                    case 401: 
                        return {
                            intent: intent,
                            msg: "Authentication failed"
                        }
                    default:
                        return {
                            intent: intent,
                            msg: "Unknown error"
                        }
                }
            }
        )
        return response;
    }
    // Изменить личные данные
    if (intent === "update_profile") {
        if(formData.get("phone_number") === '' || PHONE_NUMBER_REGEXP.test(formData.get("phone_number"))){
            const response = await updateProfile(formData).then(
                (response) => {
                    switch (response.status) {
                        case 200: 
                            return {
                                intent: intent,
                                msg: "OK"
                            }
                        default:
                            return {
                                intent: intent,
                                msg: "Unknown error"
                            }
                    }
                }, (error) => {
                    switch (error.response.status) {
                        case 401: 
                            return {
                                intent: intent,
                                msg: "Authentication failed"
                            }
                        default:
                            return {
                                intent: intent,
                                msg: "Unknown error"
                            }
                    }
                }
            )
            return response;
        }
        return { 
            intent: intent,  
            msg: "Incorrect phone number",
        };
    }
    // Изменить пароль
    if (intent === "change_password") {
        const old_password = formData.get("old_password");
        const new_password = formData.get("new_password");
        const repeat = formData.get("repeat");
        if(new_password.length < 8 || old_password.length < 8){
            return { 
                intent: intent,  
                msg: "Incorrect password length",
            }; 
        }
        if(new_password === repeat){
            const newFormData = new FormData();
            newFormData.append("old_password", old_password)
            newFormData.append("new_password", new_password)
            const response = await changePassword(newFormData).then(
                (response) => {
                    switch (response.status) {
                        case 200: 
                            return {
                                intent: intent,
                                msg: "OK"
                            }
                        default:
                            return {
                                intent: intent,
                                msg: "Unknown error"
                            }
                    }
                }, (error) => {
                    if(error){
                        switch (error.response.status) {
                            case 401: 
                                return {
                                    intent: intent,
                                    msg: "Authentication failed"
                                }
                            case 400: 
                                return {
                                    intent: intent,
                                    msg: "Invalid old password"
                                }
                            default:
                                return {
                                    intent: intent,
                                    msg: "Unknown error"
                                }
                        }
                }
            })
            return response;
        } else {
            return {
                intent: intent,
                msg: "Passwords don't match",
            }
        }
    }
    // Удалить профиль
    if (intent === "delete_profile") {
        const password = formData.get("password");
        const repeat = formData.get("repeat");
        const agreement = formData.get("agreement")
        if(password === repeat){
            if(agreement === "AGREE"){
                const newFormData = new FormData();
                newFormData.append("password", password)
                const response = await deleteProfile(newFormData).then(
                    (response) => {
                        switch (response.status) {
                            case 200: 
                                LocalStorageTools.removeFromLocalStorage('tokens');
                                return redirect('/');
                            default:
                                return {
                                    intent: intent,
                                    msg: "Unknown error"
                                }
                        }
                    }, (error) => {
                        switch (error.response.status) {
                            case 401: 
                                return {
                                    intent: intent,
                                    msg: "Authentication failed"
                                }
                            case 400: 
                                return {
                                    intent: intent,
                                    msg: "Invalid password"
                                }
                            default:
                                return {
                                    intent: intent,
                                    msg: "Unknown error"
                                }
                        }
                    }
                )
                return response;
            } else {
                return {
                    intent: intent,
                    msg: "Agreement error",
                }
            }
        } else {
            return {
                intent: intent,
                msg: "Passwords don't match",
            }
        }
    }
    
    throw json(
        { msg: "Invalid intent" },
        { status: 400 }
    );
} 