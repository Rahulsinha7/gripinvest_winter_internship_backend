import {Routes, Route,Navigate} from "react-router";
import Homepage from "./pages/Homepage"
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import { checkAuth }  from "./authSlice";
import { useDispatch,useSelector } from "react-redux";
import { useEffect } from "react";
import Admin from "./pages/Admin";
import AdminPanel from "./components/AdminPanel";
import AdminDelete from "./components/AdminDelete";
import ProductPage from "./pages/productPage";


function App(){
  
  const dispatch = useDispatch();
  const {isAuthenticated,user,loading} = useSelector((state)=>state.auth);

  // check initial authentication
  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);
  
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">
      <span className="loading loading-spinner loading-lg"></span>
    </div>;
  }

  return(
  <>
    <Routes>
      <Route path="/" element={isAuthenticated ?<Homepage></Homepage>:<Navigate to="/signup" />}></Route>
      <Route path="/login" element={isAuthenticated?<Navigate to="/" />:<Login></Login>}></Route>
      <Route path="/signup" element={isAuthenticated?<Navigate to="/" />:<Signup></Signup>}></Route>
      <Route path="/admin" element={isAuthenticated && user?.role === 'admin' ? <Admin /> : <Navigate to="/" />} />
     <Route path="/admin/create" element={isAuthenticated && user?.role === 'admin' ? <AdminPanel /> : <Navigate to="/" />} />
     <Route path="/admin/delete" element={isAuthenticated && user?.role === 'admin' ? <AdminDelete /> : <Navigate to="/" />} />
      <Route path="/product/:productId" element={<ProductPage/>}></Route>
      
    </Routes>
  </>
  )
}

export default App;