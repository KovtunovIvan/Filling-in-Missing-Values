import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { useDispatch, useSelector} from "react-redux";
import { useEffect } from "react";
import { jwtDecode } from "jwt-decode";

import './theme/styles/App.css';
import './theme/styles/guide.css';
import './theme/styles/projects-list.css';
import './theme/styles/project.css';
import './theme/styles/main-form.css';
import './theme/styles/app-sidebar.css';
import './theme/styles/root.css';
import './theme/styles/settings.css';
import './theme/styles/profile.css';
import './theme/styles/footer.css';

import { userCheck } from "./api/userApi"
import { setUser } from "./redux/userData";
import { LocalStorageTools } from "./localStorage";

import { PrivateRoute,userLoader } from "./routes/PrivateRoute";
import { GuestRoute } from "./routes/GuestRoute";

import { MainLayout } from './components/main/MainLayout';
import { AppLayout} from './components/app/AppLayout';

import { Root } from './pages/root/Root';
import { Contacts } from './pages/platform/Contacts';
import { Guide } from './pages/platform/Guide';
import { Feedback } from './pages/platform/Feedback';
import { PresentationOrder } from './pages/platform/PresentationOrder';
import { LogIn } from './pages/u/LogIn';
import { Registration } from './pages/u/Registration';
import { Demo } from './pages/platform/Demo';
import { CreateProject } from './pages/app/CreateNewProject';
import { AllProjects, projectsLoader } from "./pages/app/AllProjects";
import { Settings } from "./pages/app/Settings";
import { PasswordResore } from "./pages/u/PasswordRestore";
import { Profile, sendProfileFormData } from "./pages/app/Profile";
import { OneProjectLoader, Project } from "./pages/app/Project";

import ErrorPage from './components/ErrorPage';
import { sendFormData } from "./components/app/ProcessingSettings";
import store from './redux/store';


import {giudeChildrenRoutes} from "./pages/platform/Guide"


function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Root/>,
    },
    {
      path:"/platform",
      element: <MainLayout/>,
      errorElement: <ErrorPage/>,
      children: [
        {
          index:true,
          path:"contacts",
          element:<Contacts/>,
        },
        {
          path:"guide",
          element:<Guide/>,
          children: giudeChildrenRoutes,
        },
        {
          path:"feedback",
          element:<Feedback/>,
        },
        {
          path:"presentation",
          element:<PresentationOrder/>,
        },
        {
          path:"demo",
          element:<Demo/>,
        },
      ]
    },
    {
      path: "/u",
      element: (
      <GuestRoute>
        <MainLayout/>
      </GuestRoute>
      ),
      errorElement: <ErrorPage/>,
      children: [
        {
          path:"login",
          element:<LogIn/>,
        },
        {
          path:"reg",
          element:<Registration/>,
        },
        {
          path:"pass",
          element:<PasswordResore/>,
        },
      ]
    },
    {
      path:"/app",
      errorElement: <ErrorPage/>,
      element:(
        <PrivateRoute>
          <AppLayout/>
        </PrivateRoute>
      ),
      loader: userLoader,
      children: [
        {
          index:true,
          path: "create",
          element:<CreateProject/>,
        },
        {
          path:"projects",
          element:<AllProjects/>,
          loader: projectsLoader,
        },
        {
          path:"projects/:id",
          element:<Project/>,
          loader: OneProjectLoader,
          action: sendFormData,
        },
        {
          path:"profile",
          element:<Profile/>,
          action: sendProfileFormData,
        },
        {
          path:"settings",
          element:<Settings/>,
        },
      ]
    }
  ])

  /*
  const router2 = createBrowserRouter(
    createRoutesFromElements(
        <Route path='/' element={<Outlet/>} >
          <Route errorElement={<ErrorPage/>}/>
          <Route index element={<Root/>}/>
          <Route path='platform/' element={<MainLayout/>}>
            <Route path='contacts' element={<Contacts/>} />
            <Route path='guide' element={<Guide/>} />
            <Route path='feedback' element={<Feedback/>} />
            <Route path='presentation' element={<PresentationOrder/>} />
            <Route path='demo' element={<Demo/>} />
          </Route>
          <Route 
            path='u/' 
            element={<GuestRoute user={user}><MainLayout/></GuestRoute>}>
            <Route path='login' element={<LogIn/>}/>
            <Route path='pass' element={ <PasswordResore/> }/>
            <Route path='reg' element={<Registration/>} />
          </Route>
          <Route 
            path='app/'
            element={<PrivateRoute user={user}><AppLayout/></PrivateRoute>}>
            <Route index element={<CreateProject/>}/>
            <Route path='projects' element={<AllProjects/>} />
            <Route path='projects/:id' element={<Settings/>} />
            <Route path='settings' element={<Settings/>} />
          </Route> 
        </Route>
    )
  );
  */


  return (
      <RouterProvider router={router} />
  );
}


export default App;
