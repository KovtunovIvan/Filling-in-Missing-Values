import { Link, useNavigate } from "react-router-dom";
import logo from "../../theme/img/main/logo_eye.svg"


export function NotFoundPage() {
  const navigate = useNavigate();
  const goBack = () => {
    navigate(-1);
  }

  return (
    <div className="not-found-wrapper">
        <img className="not-found-wrapper__header" src={logo} alt="logo"/>
        <div className="not-found-wrapper__msg">
          Страница не найдена
        </div>
        <div className="not-found-wrapper__bottom">
          <button className="not-found-wrapper__link-back" onClick={goBack}>
            Назад
          </button>
          <Link to="/" className="not-found-wrapper__link-main"> 
            На главную
          </Link>
        </div>
    </div>
  )
}