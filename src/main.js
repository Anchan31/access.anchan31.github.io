import { PLAN_CATALOG, FEATURES, resolvePlanLimits } from "./config/plans.js";
import { PERMISSIONS, ROLE_DEFINITIONS } from "./config/rbac.js";
import { canAccessModule, canAddUser, getBlockedReason, hasFeature, hasPermission } from "./services/accessControlService.js";
import { watchAuth, login, logout, loadAccessSession } from "./services/authService.js";
import { createCompanyWorkspace, getCompanyUsers, inviteUser, assignRole } from "./services/companyService.js";
import { listCollection, getRecord, updateRecord } from "./services/firestoreService.js";
import { createSubscription, upgradePlan, scheduleDowngrade, cancelSubscription } from "./services/subscriptionService.js";
import { logActivity } from "./services/activityLogService.js";
import { escapeHtml, formatDate, formatDateTime, inr, initials, percent } from "./utils/format.js";
import { toast } from "./utils/toast.js";

const app = document.getElementById("app");

const views = {
    overview: {
        icon: "fa-gauge-high",
        label: "Overview",
        title: "Owner Control Center",
        subtitle: "Create subscriptions, companies, login users, roles, and RMS access from one private admin panel."
    },
    companies: {
        icon: "fa-building-shield",
        label: "Companies",
        title: "Company Workspaces",
        subtitle: "Every subscription provisions one isolated company workspace."
    },
    users: {
        icon: "fa-users-gear",
        label: "Users",
        title: "User Management",
        subtitle: "Invite users, enforce plan limits, and assign RBAC roles."
    },
    roles: {
        icon: "fa-user-lock",
        label: "Roles",
        title: "Roles & Permissions",
        subtitle: "System roles map directly to reusable permission helpers."
    },
    subscriptions: {
        icon: "fa-credit-card",
        label: "Subscriptions",
        title: "Manual Subscription Control",
        subtitle: "You control plan status, upgrades, downgrades, cancellations, trial, grace, and suspension."
    },
    modules: {
        icon: "fa-diagram-project",
        label: "RMS Modules",
        title: "RMS Module Access",
        subtitle: "Feature access depends on both plan entitlement and role permissions."
    },
    architecture: {
        icon: "fa-database",
        label: "Architecture",
        title: "Production Architecture",
        subtitle: "Firestore schema, isolation model, access flow, and deployment notes."
    }
};

let state = {
    view: "overview",
    session: null,
    subscriptions: [],
    companies: [],
    users: [],
    roles: [],
    permissions: [],
    logs: []
};

document.addEventListener("DOMContentLoaded", () => {
    renderShell();
    watchAuth(async (firebaseUser) => {
        try {
            state.session = await loadAccessSession(firebaseUser);
            if (!state.session?.blocked) {
                await loadData();
            }
            renderShell();
        } catch (error) {
            console.error(error);
            renderLogin(error.message);
        }
    });
});

async function loadData() {
    const [subscriptions, companies, users, roles, permissions, logs] = await Promise.all([
        safeList("subscriptions"),
        safeList("companies"),
        safeList("users"),
        safeList("roles"),
        safeList("permissions"),
        safeList("activityLogs")
    ]);

    state = {
        ...state,
        subscriptions,
        companies,
        users,
        roles,
        permissions,
        logs
    };
}

async function safeList(path) {
    try {
        return await listCollection(path);
    } catch (error) {
        if (error.code === "permission-denied" || error.message.includes("permissions")) {
            console.warn(`${path} is blocked by Firestore rules for this account.`);
            return [];
        }
        throw error;
    }
}

function renderShell() {
    if (!state.session?.firebaseUser) {
        renderLogin();
        return;
    }

    if (state.session.blocked) {
        renderExpired();
        return;
    }

    const current = views[state.view];
    app.className = "";
    app.innerHTML = `
        <div class="app-shell">
            <aside class="sidebar">
                <div class="brand">
                    <div class="logo-mark"><i class="fas fa-shield-halved"></i></div>
                    <div>
                        <span class="brand-title">NextGen Udaan</span>
                        <span class="brand-subtitle">Access Control</span>
                    </div>
                </div>
                <nav class="nav">
                    ${Object.entries(views).map(([key, view]) => `
                        <button class="nav-button ${key === state.view ? "active" : ""}" data-view="${key}">
                            <i class="fas ${view.icon}"></i>
                            <span>${view.label}</span>
                        </button>
                    `).join("")}
                </nav>
                <div class="tenant-card">
                    <strong>${escapeHtml(state.session.company?.companyName || "Platform Admin")}</strong>
                    <span>${state.session.adminMode ? "Private owner panel" : `${escapeHtml(state.session.user?.role || "No role")} - ${escapeHtml(state.session.subscription?.status || "No subscription")}`}</span>
                    <button class="btn" id="logoutButton" type="button" style="margin-top:14px;width:100%">
                        <i class="fas fa-arrow-right-from-bracket"></i> Logout
                    </button>
                </div>
            </aside>
            <main class="content">
                <header class="topbar">
                    <div>
                        <h1>${current.title}</h1>
                        <p class="muted">${current.subtitle}</p>
                    </div>
                    <div class="actions">
                        <button class="btn" id="refreshButton" type="button"><i class="fas fa-rotate"></i> Refresh</button>
                        <button class="btn btn-primary" id="primaryAction" type="button"><i class="fas fa-plus"></i> ${primaryActionLabel()}</button>
                    </div>
                </header>
                <section id="viewRoot" class="fade-in">${renderView()}</section>
            </main>
        </div>
    `;
    bindShellEvents();
    bindViewEvents();
}

function renderLogin(error = "") {
    app.className = "shell-loading";
    app.innerHTML = `
        <form class="boot-card form" id="loginForm">
            <div class="brand-mark"><i class="fas fa-shield-halved"></i></div>
            <div>
                <h1>NextGen Udaan Access</h1>
                <p class="muted">Private owner login. Customers should not use this panel.</p>
            </div>
            ${error ? `<p class="badge badge-danger">${escapeHtml(error)}</p>` : ""}
            <div class="field">
                <label for="loginEmail">Email</label>
                <input id="loginEmail" type="email" autocomplete="email" required>
            </div>
            <div class="field">
                <label for="loginPassword">Password</label>
                <input id="loginPassword" type="password" autocomplete="current-password" required>
            </div>
            <button class="btn btn-primary" type="submit"><i class="fas fa-lock"></i> Sign In</button>
            <p class="muted">Add your UID to <code>/platformAdmins/{uid}</code> to unlock full control.</p>
        </form>
    `;
    document.getElementById("loginForm").addEventListener("submit", async (event) => {
        event.preventDefault();
        try {
            await login(
                document.getElementById("loginEmail").value.trim(),
                document.getElementById("loginPassword").value
            );
        } catch (loginError) {
            toast(loginError.message, true);
        }
    });
}

function renderExpired() {
    app.className = "expired";
    app.innerHTML = `
        <div class="panel">
            <p class="eyebrow">${state.session.ownerOnly ? "Owner access required" : "Subscription required"}</p>
            <h1>${state.session.ownerOnly ? "This account is not an admin" : "Access is paused"}</h1>
            <p class="muted">${escapeHtml(state.session.blockedReason || "Subscription inactive. Contact NextGen Udaan to restore access.")}</p>
            ${state.session.ownerOnly ? `<p class="muted">Create that Firestore document once, then refresh and sign in again.</p>` : ""}
            <div class="actions">
                <button class="btn btn-primary" id="billingRetry"><i class="fas fa-copy"></i> Copy UID</button>
                <button class="btn" id="logoutButton"><i class="fas fa-arrow-right-from-bracket"></i> Logout</button>
            </div>
        </div>
    `;
    document.getElementById("logoutButton").addEventListener("click", logout);
    document.getElementById("billingRetry").addEventListener("click", () => {
        navigator.clipboard?.writeText(state.session.firebaseUser?.uid || "");
        toast("UID copied.");
    });
}

function renderView() {
    switch (state.view) {
        case "companies": return renderCompanies();
        case "users": return renderUsers();
        case "roles": return renderRoles();
        case "subscriptions": return renderSubscriptions();
        case "modules": return renderModules();
        case "architecture": return renderArchitecture();
        default: return renderOverview();
    }
}

function renderOverview() {
    const activeSubscriptions = state.subscriptions.filter((sub) => ["active", "trialing", "grace"].includes(sub.status)).length;
    const activeCompanies = state.companies.filter((company) => company.status === "active").length;
    const activeUsers = state.users.filter((user) => user.status === "active").length;
    const suspended = state.companies.filter((company) => company.status === "suspended").length;

    return `
        <div class="grid">
            <section class="hero">
                <div>
                    <p class="eyebrow">Multi-tenant SaaS access</p>
                    <h2>Your private provisioning desk for Recruitment Management customers.</h2>
                    <p class="muted">Customers contact you. You create their subscription, company, users, and roles, then send only their RMS portal link, email, and password.</p>
                </div>
                <div class="domain-strip">
                    ${domainItem("nextgenudaan.in", "Public information and contact")}
                    ${domainItem("access.nextgenudaan.in", "Private owner-only control panel")}
                    ${domainItem("app.nextgenudaan.in", "Customer RMS login")}
                </div>
            </section>
            <section class="grid metrics">
                ${metric("Subscriptions", activeSubscriptions, "fa-credit-card")}
                ${metric("Companies", activeCompanies, "fa-building")}
                ${metric("Active Users", activeUsers, "fa-users")}
                ${metric("Suspended", suspended, "fa-ban")}
            </section>
            <section class="grid two">
                <div class="panel">
                    <div class="table-head">
                        <div>
                            <h3>Plan Usage</h3>
                            <p class="muted">Active users compared with plan maximum.</p>
                        </div>
                    </div>
                    ${companyUsageList()}
                </div>
                <div class="panel">
                    <div class="table-head">
                        <div>
                            <h3>Recent Activity</h3>
                            <p class="muted">Audit-ready access and billing events.</p>
                        </div>
                    </div>
                    ${activityTable(state.logs.slice(0, 8))}
                </div>
            </section>
        </div>
    `;
}

function renderCompanies() {
    const availableSubscriptions = state.subscriptions.filter((sub) => !sub.companyId && ["active", "trialing", "grace"].includes(sub.status));
    return `
        <div class="grid two">
            <div class="panel">
                <h3>Create Company Workspace</h3>
                <p class="muted">Creates the customer workspace and first login profile after you create the Firebase Auth user.</p>
                <form id="companyForm" class="form">
                    <div class="field">
                        <label for="companySubscription">Subscription</label>
                        <select id="companySubscription" required>
                            <option value="">Select subscription</option>
                            ${availableSubscriptions.map((sub) => `<option value="${sub.id}">${escapeHtml(sub.customerName)} - ${planName(sub.plan)}</option>`).join("")}
                        </select>
                    </div>
                    <div class="field">
                        <label for="companyName">Company Name</label>
                        <input id="companyName" required placeholder="e.g. Udaan Talent Partners">
                    </div>
                    <div class="field">
                        <label for="ownerId">Firebase Auth UID</label>
                        <input id="ownerId" required placeholder="UID for the customer login you created">
                    </div>
                    <div class="field">
                        <label for="ownerName">Owner Name</label>
                        <input id="ownerName" required>
                    </div>
                    <div class="field">
                        <label for="ownerEmail">Owner Email</label>
                        <input id="ownerEmail" type="email" required>
                    </div>
                    <button class="btn btn-primary" type="submit"><i class="fas fa-building-circle-check"></i> Provision</button>
                </form>
            </div>
            <div class="panel">
                <div class="table-head">
                    <div>
                        <h3>Managed Companies</h3>
                        <p class="muted">${state.companies.length} company records</p>
                    </div>
                </div>
                ${companyTable(state.companies)}
            </div>
        </div>
    `;
}

function renderUsers() {
    return `
        <div class="grid two">
            <div class="panel">
                <h3>Invite User</h3>
                <p class="muted">Create the Firebase Auth account first, then add the user profile here and send the customer their app link plus credentials.</p>
                <form id="userForm" class="form">
                    <div class="field">
                        <label for="userCompany">Company</label>
                        <select id="userCompany" required>
                            <option value="">Select company</option>
                            ${state.companies.map((company) => `<option value="${company.id}">${escapeHtml(company.companyName)} - ${userCount(company.id)}/${company.maxUsers}</option>`).join("")}
                        </select>
                    </div>
                    <div class="field">
                        <label for="inviteName">User Name</label>
                        <input id="inviteName" required>
                    </div>
                    <div class="field">
                        <label for="inviteUid">Firebase Auth UID</label>
                        <input id="inviteUid" required placeholder="UID for the login you created">
                    </div>
                    <div class="field">
                        <label for="inviteEmail">Email</label>
                        <input id="inviteEmail" type="email" required>
                    </div>
                    <div class="field">
                        <label for="inviteRole">Role</label>
                        <select id="inviteRole" required>
                            ${Object.values(ROLE_DEFINITIONS).map((role) => `<option value="${role.id}">${role.label}</option>`).join("")}
                        </select>
                    </div>
                    <button class="btn btn-primary" type="submit"><i class="fas fa-user-plus"></i> Create Login Profile</button>
                </form>
            </div>
            <div class="panel">
                <div class="table-head">
                    <div>
                        <h3>Users</h3>
                        <p class="muted">${state.users.length} users across all tenants</p>
                    </div>
                </div>
                ${userTable(state.users)}
            </div>
        </div>
    `;
}

function renderRoles() {
    return `
        <div class="grid">
            <section class="grid three">
                ${Object.values(ROLE_DEFINITIONS).map((role) => `
                    <div class="panel">
                        <h3>${role.label}</h3>
                        <p class="muted">${role.permissions.length} permissions</p>
                        <div>${role.permissions.map((permission) => badge(permission, "soft")).join("")}</div>
                    </div>
                `).join("")}
            </section>
            <section class="panel">
                <div class="table-head">
                    <div>
                        <h3>Role Assignment</h3>
                        <p class="muted">Change a user's role without touching tenant isolation.</p>
                    </div>
                </div>
                <form id="roleForm" class="form" style="max-width:520px">
                    <div class="field">
                        <label for="roleUser">User</label>
                        <select id="roleUser" required>
                            <option value="">Select user</option>
                            ${state.users.map((user) => `<option value="${user.id}">${escapeHtml(user.name)} - ${escapeHtml(user.email)}</option>`).join("")}
                        </select>
                    </div>
                    <div class="field">
                        <label for="roleValue">Role</label>
                        <select id="roleValue" required>
                            ${Object.values(ROLE_DEFINITIONS).map((role) => `<option value="${role.id}">${role.label}</option>`).join("")}
                        </select>
                    </div>
                    <button class="btn btn-primary" type="submit"><i class="fas fa-user-check"></i> Assign Role</button>
                </form>
            </section>
        </div>
    `;
}

function renderSubscriptions() {
    return `
        <div class="grid">
            <section class="grid three">
                ${Object.values(PLAN_CATALOG).map(planCard).join("")}
            </section>
            <section class="grid two">
                <div class="panel">
                    <h3>Create Subscription</h3>
                    <p class="muted">Owner-operated provisioning. Customers do not see billing controls here.</p>
                    <form id="subscriptionForm" class="form">
                        <div class="field"><label for="customerName">Customer Name</label><input id="customerName" required></div>
                        <div class="field"><label for="customerEmail">Customer Email</label><input id="customerEmail" type="email" required></div>
                        <div class="field">
                            <label for="plan">Plan</label>
                            <select id="plan" required>
                                ${Object.values(PLAN_CATALOG).map((plan) => `<option value="${plan.id}">${plan.name}</option>`).join("")}
                            </select>
                        </div>
                        <div class="field"><label for="customMaxUsers">Custom Max Users</label><input id="customMaxUsers" type="number" min="1" placeholder="Only for Custom"></div>
                        <div class="field"><label for="customPrice">Custom Price Monthly</label><input id="customPrice" type="number" min="0" placeholder="Only for Custom"></div>
                        <div class="field">
                            <label for="status">Status</label>
                            <select id="status">
                                <option value="trialing">Trialing</option>
                                <option value="active">Active</option>
                                <option value="grace">Grace</option>
                                <option value="past_due">Past due</option>
                                <option value="suspended">Suspended</option>
                            </select>
                        </div>
                        <button class="btn btn-primary" type="submit"><i class="fas fa-circle-plus"></i> Create Subscription</button>
                    </form>
                </div>
                <div class="panel">
                    <div class="table-head">
                        <div>
                            <h3>Subscriptions</h3>
                            <p class="muted">${state.subscriptions.length} billing records</p>
                        </div>
                    </div>
                    ${subscriptionTable(state.subscriptions)}
                </div>
            </section>
        </div>
    `;
}

function renderModules() {
    const company = selectedCompany();
    const subscription = selectedSubscription(company);
    const user = state.session.user;

    return `
        <div class="grid">
            <section class="panel">
                <div class="table-head">
                    <div>
                        <h3>Current Access Evaluation</h3>
                        <p class="muted">Reusable helper output for <code>hasPermission()</code>, <code>hasFeature()</code>, and module gates.</p>
                    </div>
                </div>
                <div class="grid three">
                    ${Object.values(FEATURES).map((feature) => `
                        <div class="panel">
                            <h3>${feature.label}</h3>
                            <p class="muted">${feature.description}</p>
                            ${badge(hasFeature(company, subscription, feature.key) ? "Plan enabled" : "Plan blocked", hasFeature(company, subscription, feature.key) ? "success" : "danger")}
                            ${badge(canAccessModule(user, company, subscription, feature.key) ? "Role allowed" : "Role blocked", canAccessModule(user, company, subscription, feature.key) ? "success" : "warning")}
                        </div>
                    `).join("")}
                </div>
            </section>
            <section class="panel">
                <h3>Permission Probe</h3>
                <p class="muted">Active user: ${escapeHtml(user?.name || "Unknown")} - role: ${escapeHtml(user?.role || "none")}</p>
                <div>${Object.values(PERMISSIONS).map((permission) => badge(`${permission}: ${hasPermission(user, permission) ? "yes" : "no"}`, hasPermission(user, permission) ? "success" : "soft")).join("")}</div>
            </section>
        </div>
    `;
}

function renderArchitecture() {
    return `
        <div class="grid">
            <section class="hero">
                <div>
                    <p class="eyebrow">Login access flow</p>
                    <h2>Owner admin first, customer app login second.</h2>
                    <p class="muted">You use this panel to control every tenant. Customers only use <code>app.nextgenudaan.in</code>; inactive subscriptions render a contact-admin page in the RMS app.</p>
                </div>
                <div class="domain-strip">
                    ${domainItem("1. Firebase Auth", "Verify signed-in user")}
                    ${domainItem("2. /platformAdmins/{uid}", "Your private owner access to all tenants")}
                    ${domainItem("3. /users/{uid}", "Customer app login profile")}
                    ${domainItem("4. /companies/{companyId}", "Tenant status and plan")}
                    ${domainItem("5. /subscriptions/{id}", "Status, expiry, grace, suspension")}
                    ${domainItem("6. Helper gates", "hasPermission + hasFeature")}
                </div>
            </section>
            <section class="grid two">
                <div class="panel">
                    <h3>Firestore Collections</h3>
                    <div class="domain-strip">
                        ${domainItem("/platformAdmins/{uid}", "owner-only admin access for this panel")}
                        ${domainItem("/companies/{companyId}", "companyName, ownerId, subscriptionId, plan, maxUsers, status, features")}
                        ${domainItem("/users/{userId}", "companyId, name, email, role, status, inviteStatus")}
                        ${domainItem("/subscriptions/{subscriptionId}", "plan, maxUsers, status, dates, Razorpay ids, custom limits")}
                        ${domainItem("/roles/{roleId}", "companyId, label, permissions, status")}
                        ${domainItem("/permissions/{permissionId}", "key, module, description")}
                        ${domainItem("/activityLogs/{logId}", "companyId, actorId, action, entity, metadata")}
                    </div>
                </div>
                <div class="panel">
                    <h3>Production Notes</h3>
                    <div class="domain-strip">
                        ${domainItem("Tenant isolation", "All RMS reads and writes include companyId equality checks.")}
                        ${domainItem("Optimized queries", "Use companyId + createdAt indexes for users, jobs, candidates, and logs.")}
                        ${domainItem("Credential flow", "You create Auth users, add /users profiles, and send app link plus credentials.")}
                        ${domainItem("Webhook sync", "Existing Razorpay webhook updates /subscriptions and logs activity.")}
                        ${domainItem("Suspension", "Failed payment enters grace, then suspended after gracePeriodDays.")}
                    </div>
                </div>
            </section>
        </div>
    `;
}

function bindShellEvents() {
    document.querySelectorAll("[data-view]").forEach((button) => {
        button.addEventListener("click", () => {
            state.view = button.dataset.view;
            renderShell();
        });
    });

    document.getElementById("logoutButton")?.addEventListener("click", logout);
    document.getElementById("refreshButton")?.addEventListener("click", async () => {
        await loadData();
        renderShell();
        toast("Data refreshed.");
    });
    document.getElementById("primaryAction")?.addEventListener("click", () => {
        document.querySelector("form input, form select")?.focus();
        document.querySelector("form")?.scrollIntoView({ behavior: "smooth", block: "center" });
    });
}

function bindViewEvents() {
    document.getElementById("subscriptionForm")?.addEventListener("submit", handleCreateSubscription);
    document.getElementById("companyForm")?.addEventListener("submit", handleCreateCompany);
    document.getElementById("userForm")?.addEventListener("submit", handleInviteUser);
    document.getElementById("roleForm")?.addEventListener("submit", handleAssignRole);

    document.querySelectorAll("[data-sub-action]").forEach((button) => {
        button.addEventListener("click", () => handleSubscriptionAction(button));
    });
}

async function handleCreateSubscription(event) {
    event.preventDefault();
    const payload = {
        customerName: document.getElementById("customerName").value.trim(),
        customerEmail: document.getElementById("customerEmail").value.trim(),
        plan: document.getElementById("plan").value,
        maxUsers: document.getElementById("customMaxUsers").value,
        priceMonthly: document.getElementById("customPrice").value,
        status: document.getElementById("status").value
    };
    const id = await createSubscription(payload);
    await logActivity({
        companyId: state.session.company?.id || "platform",
        actorId: state.session.user?.id || "system",
        action: "subscription.created",
        entityType: "subscription",
        entityId: id,
        metadata: { plan: payload.plan }
    });
    await loadData();
    renderShell();
    toast("Subscription created.");
}

async function handleCreateCompany(event) {
    event.preventDefault();
    const subscription = await getRecord("subscriptions", document.getElementById("companySubscription").value);
    const companyId = await createCompanyWorkspace(subscription, {
        companyName: document.getElementById("companyName").value.trim(),
        ownerId: document.getElementById("ownerId").value.trim(),
        ownerName: document.getElementById("ownerName").value.trim(),
        ownerEmail: document.getElementById("ownerEmail").value.trim()
    });
    await logActivity({
        companyId,
        actorId: state.session.user?.id || "system",
        action: "company.provisioned",
        entityType: "company",
        entityId: companyId
    });
    await loadData();
    renderShell();
    toast("Company workspace provisioned.");
}

async function handleInviteUser(event) {
    event.preventDefault();
    const company = state.companies.find((item) => item.id === document.getElementById("userCompany").value);
    const subscription = selectedSubscription(company);
    const activeUserCount = userCount(company.id);
    const check = canAddUser(company, subscription, activeUserCount);
    if (!check.allowed) {
        toast(check.reason, true);
        return;
    }

    const userId = await inviteUser({
        company,
        subscription,
        activeUserCount,
        userId: document.getElementById("inviteUid").value.trim(),
        name: document.getElementById("inviteName").value.trim(),
        email: document.getElementById("inviteEmail").value.trim(),
        role: document.getElementById("inviteRole").value
    });
    await logActivity({
        companyId: company.id,
        actorId: state.session.user?.id || "system",
        action: "user.login_profile_created",
        entityType: "user",
        entityId: userId
    });
    await loadData();
    renderShell();
    toast("Customer login profile created.");
}

async function handleAssignRole(event) {
    event.preventDefault();
    const userId = document.getElementById("roleUser").value;
    const role = document.getElementById("roleValue").value;
    await assignRole(userId, role);
    const user = state.users.find((item) => item.id === userId);
    await logActivity({
        companyId: user?.companyId || state.session.company?.id || "platform",
        actorId: state.session.user?.id || "system",
        action: "role.assigned",
        entityType: "user",
        entityId: userId,
        metadata: { role }
    });
    await loadData();
    renderShell();
    toast("Role assigned.");
}

async function handleSubscriptionAction(button) {
    const id = button.dataset.subId;
    const action = button.dataset.subAction;
    const plan = button.dataset.plan;

    if (action === "upgrade") await upgradePlan(id, plan);
    if (action === "downgrade") await scheduleDowngrade(id, plan);
    if (action === "cancel") await cancelSubscription(id);
    if (action === "suspend") await updateRecord("subscriptions", id, { status: "suspended" });

    await logActivity({
        companyId: state.session.company?.id || "platform",
        actorId: state.session.user?.id || "system",
        action: `subscription.${action}`,
        entityType: "subscription",
        entityId: id,
        metadata: { plan }
    });
    await loadData();
    renderShell();
    toast(`Subscription ${action} saved.`);
}

function companyTable(companies) {
    if (!companies.length) return empty("No companies provisioned yet.");
    return `
        <div class="table-wrap">
            <table>
                <thead><tr><th>Company</th><th>Plan</th><th>Status</th><th>Users</th><th>Features</th></tr></thead>
                <tbody>
                    ${companies.map((company) => {
                        const used = userCount(company.id);
                        return `
                            <tr>
                                <td><span class="cell-title">${escapeHtml(company.companyName)}</span><span class="cell-sub">${escapeHtml(company.id)}</span></td>
                                <td>${badge(planName(company.plan), "info")}</td>
                                <td>${badge(company.status || "unknown", statusTone(company.status))}</td>
                                <td><span class="cell-title">${used}/${company.maxUsers}</span><div class="progress"><span style="--value:${percent(used, company.maxUsers)}%"></span></div></td>
                                <td>${(company.features || []).map((feature) => badge(featureLabel(feature), "soft")).join("")}</td>
                            </tr>
                        `;
                    }).join("")}
                </tbody>
            </table>
        </div>
    `;
}

function userTable(users) {
    if (!users.length) return empty("No users created yet.");
    return `
        <div class="table-wrap">
            <table>
                <thead><tr><th>User</th><th>Company</th><th>Role</th><th>Status</th><th>Created</th></tr></thead>
                <tbody>
                    ${users.map((user) => `
                        <tr>
                            <td><span class="cell-title">${escapeHtml(user.name)}</span><span class="cell-sub">${escapeHtml(user.email)}</span></td>
                            <td>${escapeHtml(companyName(user.companyId))}</td>
                            <td>${badge(ROLE_DEFINITIONS[user.role]?.label || user.role, "info")}</td>
                            <td>${badge(user.status || "unknown", statusTone(user.status))}</td>
                            <td>${formatDate(user.createdAt)}</td>
                        </tr>
                    `).join("")}
                </tbody>
            </table>
        </div>
    `;
}

function subscriptionTable(subscriptions) {
    if (!subscriptions.length) return empty("No subscriptions created yet.");
    return `
        <div class="table-wrap">
            <table>
                <thead><tr><th>Customer</th><th>Plan</th><th>Status</th><th>Billing</th><th>Actions</th></tr></thead>
                <tbody>
                    ${subscriptions.map((sub) => `
                        <tr>
                            <td><span class="cell-title">${escapeHtml(sub.customerName)}</span><span class="cell-sub">${escapeHtml(sub.customerEmail)}</span></td>
                            <td>${badge(planName(sub.plan), "info")}<span class="cell-sub">${sub.maxUsers || resolvePlanLimits(sub).maxUsers} users</span></td>
                            <td>${badge(sub.status || "unknown", statusTone(sub.status))}<span class="cell-sub">${getBlockedReason(sub)}</span></td>
                            <td><span class="cell-title">${sub.priceMonthly ? inr.format(sub.priceMonthly) : "Custom"}</span><span class="cell-sub">Period end ${formatDate(sub.currentPeriodEnd)}</span></td>
                            <td>
                                <button class="btn" data-sub-action="upgrade" data-plan="enterprise" data-sub-id="${sub.id}" title="Upgrade to Enterprise"><i class="fas fa-arrow-up"></i></button>
                                <button class="btn" data-sub-action="downgrade" data-plan="starter" data-sub-id="${sub.id}" title="Schedule downgrade"><i class="fas fa-arrow-down"></i></button>
                                <button class="btn" data-sub-action="suspend" data-sub-id="${sub.id}" title="Suspend"><i class="fas fa-ban"></i></button>
                                <button class="btn btn-danger" data-sub-action="cancel" data-sub-id="${sub.id}" title="Cancel"><i class="fas fa-xmark"></i></button>
                            </td>
                        </tr>
                    `).join("")}
                </tbody>
            </table>
        </div>
    `;
}

function activityTable(logs) {
    if (!logs.length) return empty("No activity logs yet.");
    return `
        <div class="table-wrap">
            <table>
                <thead><tr><th>Action</th><th>Entity</th><th>When</th></tr></thead>
                <tbody>
                    ${logs.map((log) => `
                        <tr>
                            <td>${badge(log.action, "info")}</td>
                            <td><span class="cell-title">${escapeHtml(log.entityType || "record")}</span><span class="cell-sub">${escapeHtml(log.entityId || "")}</span></td>
                            <td>${formatDateTime(log.createdAt)}</td>
                        </tr>
                    `).join("")}
                </tbody>
            </table>
        </div>
    `;
}

function companyUsageList() {
    if (!state.companies.length) return empty("No usage data yet.");
    return `<div class="domain-strip">${state.companies.map((company) => {
        const used = userCount(company.id);
        return `
            <div>
                <div class="domain-item">
                    <strong>${escapeHtml(company.companyName)}</strong>
                    <span>${used}/${company.maxUsers} users</span>
                </div>
                <div class="progress"><span style="--value:${percent(used, company.maxUsers)}%"></span></div>
            </div>
        `;
    }).join("")}</div>`;
}

function planCard(plan) {
    const price = plan.priceMonthly ? `${inr.format(plan.priceMonthly)}/month` : "Dynamic pricing";
    return `
        <div class="panel plan-card">
            <div>
                <h3>${plan.name}</h3>
                <div class="plan-price">${price}</div>
                <p class="muted">${plan.maxUsers ? `${plan.maxUsers} max users` : "Custom user limits"}</p>
            </div>
            <div class="plan-features">
                ${plan.features.map((feature) => `<span><i class="fas fa-check"></i> ${featureLabel(feature)}</span>`).join("")}
            </div>
        </div>
    `;
}

function metric(label, value, icon) {
    return `
        <div class="metric">
            <div class="metric-icon"><i class="fas ${icon}"></i></div>
            <div class="metric-value">${value}</div>
            <div class="metric-label">${label}</div>
        </div>
    `;
}

function domainItem(title, value) {
    return `<div class="domain-item"><strong>${escapeHtml(title)}</strong><span>${escapeHtml(value)}</span></div>`;
}

function badge(text, tone = "soft") {
    return `<span class="badge badge-${tone}">${escapeHtml(text)}</span>`;
}

function empty(message) {
    return `<div class="empty">${escapeHtml(message)}</div>`;
}

function statusTone(status = "") {
    if (["active", "accepted"].includes(status)) return "success";
    if (["trialing", "grace", "invited", "pending"].includes(status)) return "warning";
    if (["suspended", "cancelled", "expired", "past_due", "disabled"].includes(status)) return "danger";
    return "soft";
}

function userCount(companyId) {
    return state.users.filter((user) => user.companyId === companyId && user.status !== "disabled").length;
}

function companyName(companyId) {
    return state.companies.find((company) => company.id === companyId)?.companyName || "Unknown company";
}

function selectedCompany() {
    return state.session?.company || state.companies[0] || null;
}

function selectedSubscription(company) {
    return state.session?.subscription || state.subscriptions.find((sub) => sub.id === company?.subscriptionId) || state.subscriptions[0] || null;
}

function planName(planId) {
    return PLAN_CATALOG[planId]?.name || "Custom";
}

function featureLabel(featureKey) {
    return FEATURES[featureKey]?.label || featureKey;
}

function primaryActionLabel() {
    if (state.view === "companies") return "Create Company";
    if (state.view === "users") return "Invite User";
    if (state.view === "roles") return "Assign Role";
    if (state.view === "subscriptions") return "Create Plan";
    return "New Record";
}

window.NextGenAccess = {
    hasPermission,
    hasFeature,
    canAddUser,
    canAccessModule,
    getCompanyUsers
};
