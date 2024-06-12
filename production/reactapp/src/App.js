import { createBrowserRouter, RouterProvider } from "react-router-dom";
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
import './theme/styles/success-main-submit.css';
import './theme/styles/modal.css';
import './theme/styles/loader.css';
import './theme/styles/error404.css';
import './theme/styles/rejected.css';
import { PrivateRoute } from "./routes/PrivateRoute";
import { GuestRoute } from "./routes/GuestRoute";
import { MainLayout } from './components/main/MainLayout';
import { AppLayout} from './components/app/AppLayout';
import { Root } from './pages/root/Root';
import { Contacts } from './pages/platform/Contacts';
import { Guide } from './pages/platform/Guide';
import { Feedback, sendFeedbackFormData } from './pages/platform/Feedback';
import { PresentationOrder, sendPresFormData } from './pages/platform/PresentationOrder';
import { LogIn } from './pages/u/LogIn';
import { Registration } from './pages/u/Registration';
import { Demo } from './pages/platform/Demo';
import { CreateProject } from './pages/app/CreateNewProject';
import { AllProjects } from "./pages/app/AllProjects";
import { Settings } from "./pages/app/Settings";
import { PasswordResore } from "./pages/u/PasswordRestore";
import { Profile, sendProfileFormData } from "./pages/app/Profile";
import { OneProjectLoader, Project } from "./pages/app/Project";
import { sendFormData } from "./components/app/ProcessingSettings";
import { giudeChildrenRoutes } from "./pages/platform/Guide"
import { NotFoundPage } from "./pages/optional/error404";


function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Root/>,
      errorElement: <NotFoundPage/>
    },
    {
      path:"/platform",
      element: <MainLayout/>,
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
          action: sendFeedbackFormData,
        },
        {
          path:"presentation",
          element:<PresentationOrder/>,
          action: sendPresFormData,
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
      element:(
        <PrivateRoute>
          <AppLayout/>
        </PrivateRoute>
      ),
      children: [
        {
          index:true,
          path: "create",
          element:<CreateProject/>,
        },
        {
          path:"projects",
          element:<AllProjects/>,
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
  // react router old version
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
