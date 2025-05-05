import usePermissionStore from "@/context/permissionUser";
import { usePage } from "@inertiajs/react";

const hasPermission = (permission_names, permissionUsers) => {
    if (Array.isArray(permission_names)) {
        return permission_names.some((permission) =>
            permissionUsers.some((some) => some.name === permission)
        );
    }
    return (
        permissionUsers?.some((some) => some.name === permission_names) || false
    );
};

export const useUserPermission = () => {
    const permissionUser = usePermissionStore((state) => state.permissionUser);
    return {
        hasPermission: (permission_name) =>
            hasPermission(permission_name, permissionUser),
    };
};
