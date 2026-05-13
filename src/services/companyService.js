import { PLAN_CATALOG, resolvePlanLimits } from "../config/plans.js";
import { ROLE_DEFINITIONS } from "../config/rbac.js";
import { atomicCreateCompany, createRecord, listByCompany, setRecord, updateRecord } from "./firestoreService.js";
import { canAddUser } from "./accessControlService.js";

export async function createCompanyWorkspace(subscription, input) {
    const limits = resolvePlanLimits(subscription);
    const ownerId = input.ownerId || crypto.randomUUID();

    return atomicCreateCompany({
        subscriptionId: subscription.id,
        company: {
            companyName: input.companyName,
            ownerId,
            subscriptionId: subscription.id,
            plan: subscription.plan || PLAN_CATALOG.starter.id,
            maxUsers: limits.maxUsers,
            status: "active",
            features: limits.features,
            customLimits: subscription.customLimits || {}
        },
        owner: {
            userId: ownerId,
            name: input.ownerName,
            email: input.ownerEmail.toLowerCase(),
            role: "owner",
            status: "active",
            inviteStatus: "accepted"
        }
    });
}

export async function inviteUser({ company, subscription, activeUserCount, userId, name, email, role }) {
    const check = canAddUser(company, subscription, activeUserCount);
    if (!check.allowed) throw new Error(check.reason);

    return setRecord("users", userId, {
        userId,
        companyId: company.id,
        name,
        email: email.toLowerCase(),
        role,
        status: "active",
        inviteStatus: "credentials_sent",
        credentialsProvidedBy: "platform_admin",
        activatedAt: new Date().toISOString()
    });
}

export async function assignRole(userId, role) {
    if (!ROLE_DEFINITIONS[role]) throw new Error("Unknown role.");
    await updateRecord("users", userId, { role });
}

export async function getCompanyUsers(companyId) {
    return listByCompany("users", companyId);
}

export async function getCompanyActivity(companyId) {
    return listByCompany("activityLogs", companyId, "createdAt");
}
