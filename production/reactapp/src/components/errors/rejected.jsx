import { Link, useNavigate } from "react-router-dom";
import logo from "../../theme/img/main/logo_eye.svg"

export function Rejected() {
  const navigate = useNavigate();
  const goBack = () => {
    navigate(-1);
  }

  return (
    <div className="rejected-wrapper">
        <img className="rejected-wrapper__header" src={logo} alt="logo"/>
        <div className="rejected-wrapper__msg">
          Неизвестная ошибка. Попробуйте снова!
        </div>
        <div className="rejected-wrapper__bottom">
          <button className="rejected-wrapper__link-back" onClick={goBack}>
            Назад
          </button>
          <Link to="/" className="rejected-wrapper__link-main"> 
            На главную
          </Link>
        </div>
    </div>
  )
}