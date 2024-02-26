import { useAppSelector } from "../../redux/hooks";

const User: React.FC = () => {
  const currentUser = useAppSelector((state) => state.userData)
    return (
      <div className="container">
          <div>
            <header className="jumbotron">
              <h3>
                <strong>{currentUser.username}</strong> Profile
              </h3>
            </header>
            <p>
              <strong>Id:</strong>{" "}
              {currentUser.id}
            </p>
            <p>
              <strong>Email:</strong>{" "}
              {currentUser.email}
            </p>
          </div> 
      </div>
    );
  }

export default User;