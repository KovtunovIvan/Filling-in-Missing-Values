import { Link } from "react-router-dom";

export function SuccessfulSubmitWindow(props) {
  const {title, message, setter} = props;
  const handleReturn = () => {
    setter()
  }
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
          <div onClick={handleReturn}
          className="success-main-submit__link-back"
          >
            Отправить еще
          </div>
        </div>
      </div>
  )
}