import loader from '../../theme/img/main/loading.svg'


export function Loader({active}) {
  return (
    <div 
      className={active ? "loader active" : "loader"}
    >
      <div 
          className={active ? "loader__content active" : "loader__content"}
      >
          <img src={loader} alt="loading" />
          <div 
            className='loader__content__text'
          >
              Loading...
            </div>
      </div>
    </div>

  )
}