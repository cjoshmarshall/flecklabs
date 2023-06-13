import React, { Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
// import PrivateRoute from "./PrivateRoute";

const Root = React.lazy(() => import("../pages/Root"));
const Login = React.lazy(() => import("../pages/Login"));
const Signup = React.lazy(() => import("../pages/Signup"));
const NotFound = React.lazy(() => import("../pages/404"));

const PrivateRoute = React.lazy(() => import("./PrivateRoute"));

function Router() {
  return (
    <Suspense>
      <BrowserRouter>
        <Routes>
          <Route element={<PrivateRoute />}>
            <Route path="/" element={<Root />} />
          </Route>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </Suspense>
  );
}

export default Router;
