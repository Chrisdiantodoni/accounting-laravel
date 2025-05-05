import { create } from "zustand";
import { usePage } from "@inertiajs/react";
import { useEffect } from "react";

const usePermissionStore = create((set) => ({
    permissionUser: [],
    setPermissionUser: (permissions) => set({ permissionUser: permissions }),
}));

export const initialPermissionLists = (permissionUser) => {
    const setPermissionUser = usePermissionStore(
        (state) => state.setPermissionUser
    );
    useEffect(() => {
        setPermissionUser(permissionUser);
    }, [permissionUser]);
};

export default usePermissionStore;
