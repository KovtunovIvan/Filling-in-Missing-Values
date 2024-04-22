import { Link } from "react-router-dom";

export function SuccessfulSubmitWindow(props) {
  const {title, message, path} = props;
  return (
      <div className="success-main-submit wrapper_form_submit">
        <div className="success-main-submit__title">
          {title}
        </div>
        <div className="success-main-submit__msg">
            {message}
        </div>
        <div className="success-main-submit__bottom-wrapper">
          <Link to="/"
            className="success-main-submit__link-main"
          >
            На главную
          </Link>
          <Link to={path}
          className="success-main-submit__link-back"
          >
            Отправить еще
          </Link>
        </div>
      </div>
  )
}