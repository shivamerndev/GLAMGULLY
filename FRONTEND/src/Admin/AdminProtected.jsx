import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AdminDataContext } from "../context/AdminContext";

const AdminProtected = ({ children }) => {
  const navigate = useNavigate();
  const { GetAdminDashboard } = useContext(AdminDataContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        let admin = await GetAdminDashboard()
        if (!admin) return navigate("/admin/login")
        setLoading(false)
      } catch (error) {
        navigate("/admin/login");
      }
    };
    checkAuth()
  }, []);

  if (!loading) {
    return <>{children}</>;
  }

};

export default AdminProtected;
