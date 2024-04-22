import { SuccessfulSubmitWindow } from "../../components/main/SuccessfulSubmitWindow";

const feedback = {
  title: "Спасибо за отзыв!",
  message: " Специалисты MedMinds свяжутся с Вами в течение 1-3 рабочих дней по указанной электронной почте или номеру телефона.",
  path: "/platform/feedback",
}

const presentation = {
  title: "Заявка отправлена!",
  message: " Специалисты MedMinds свяжутся с Вами в течение 1-3 рабочих дней по указанной электронной почте или номеру телефона.",
  path: "/platform/presentation",
}

export function SuccessfulSubmitPage(props) {
  const {page} = props;
  const state = page === "feedback" ? feedback : presentation;
  return (
    <div className="success-main-submit-wrapper">
      <SuccessfulSubmitWindow 
          title={state.title}
          message={state.message}
          path={state.path}
      />
    </div>
  )
}