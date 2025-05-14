import { useState } from "react";
import UserControl from "./control-users";
import LotsControl from "./control-lots";

function AdminPage() {
  return (
    <div style={{ display: "flex", justifyContent: "space-between" }}>
      <UserControl />
      <LotsControl />
    </div>
  );
}

export default AdminPage;
