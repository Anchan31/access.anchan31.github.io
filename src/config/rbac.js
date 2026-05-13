export const PERMISSIONS = {
    fullAccess: "full_access",
    manageUsers: "manage_users",
    manageRoles: "manage_roles",
    manageBilling: "manage_billing",
    manageJobs: "manage_jobs",
    manageCandidates: "manage_candidates",
    useDialer: "use_dialer",
    shareProfiles: "share_profiles",
    readOnly: "read_only",
    viewAnalytics: "view_analytics",
    useQrBridgeLogin: "use_qr_bridge_login"
};

export const ROLE_DEFINITIONS = {
    owner: {
        id: "owner",
        label: "Owner",
        permissions: Object.values(PERMISSIONS)
    },
    admin: {
        id: "admin",
        label: "Admin",
        permissions: [
            PERMISSIONS.manageUsers,
            PERMISSIONS.manageRoles,
            PERMISSIONS.manageJobs,
            PERMISSIONS.manageCandidates,
            PERMISSIONS.shareProfiles,
            PERMISSIONS.readOnly,
            PERMISSIONS.viewAnalytics
        ]
    },
    recruiter: {
        id: "recruiter",
        label: "Recruiter",
        permissions: [
            PERMISSIONS.manageCandidates,
            PERMISSIONS.useDialer,
            PERMISSIONS.shareProfiles,
            PERMISSIONS.readOnly
        ]
    },
    viewer: {
        id: "viewer",
        label: "Viewer",
        permissions: [PERMISSIONS.readOnly]
    }
};

export const MODULE_REQUIREMENTS = {
    recruitModule: [PERMISSIONS.manageJobs, PERMISSIONS.manageCandidates, PERMISSIONS.readOnly],
    careerPortal: [PERMISSIONS.manageJobs, PERMISSIONS.readOnly],
    shareProfile: [PERMISSIONS.shareProfiles],
    dialer: [PERMISSIONS.useDialer],
    qrBridgeLogin: [PERMISSIONS.useQrBridgeLogin],
    advancedAnalytics: [PERMISSIONS.viewAnalytics]
};

export function getRole(roleId = "viewer") {
    return ROLE_DEFINITIONS[roleId] || ROLE_DEFINITIONS.viewer;
}
