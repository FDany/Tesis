export type Permission = {
    id: number;
    name: string;
};

export type Role = {
    id: number;
    name: string;
    users_count: number;
    permissions: Permission[];
};

export type RoleFormValues = {
    id?: number;
    name: string;
    permissions: string[];
};

export type RolesIndexProps = {
    roles: Role[];
    flash: {
        success: string | null;
        error: string | null;
    };
};

export type RoleCreateProps = {
    permissions: Permission[];
};

export type RoleEditProps = {
    role: Required<RoleFormValues>;
    permissions: Permission[];
};
