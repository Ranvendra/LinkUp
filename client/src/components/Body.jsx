import { useEffect } from "react";
import NavBar from "./NavBar";
import { Outlet, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import api from "../services/api";
import { addUser } from "../store/userSlice";

const Body = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((store) => store.user);

  const fetchUser = async () => {
    if (user) return;

    try {
      const res = await api.get("/profile/view");
      dispatch(addUser(res.data));
    } catch (err) {
      console.error("Fetch user failed", err);
      navigate("/");
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#FAFBFC" }}>
      <NavBar />
      <main className="pt-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-10">
        <Outlet />
      </main>
    </div>
  );
};

export default Body;
