import{getAuth as ae,onAuthStateChanged as ie,signInWithEmailAndPassword as ne,signOut as re}from"https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";import{initializeApp as oe}from"https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";import{getFirestore as le,collection as x,getDocs as M,query as D,where as ce,orderBy as G,limit as z,getDoc as de,doc as w,updateDoc as ue,serverTimestamp as m,addDoc as me,runTransaction as pe,setDoc as fe}from"https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))a(i);new MutationObserver(i=>{for(const r of i)if(r.type==="childList")for(const d of r.addedNodes)d.tagName==="LINK"&&d.rel==="modulepreload"&&a(d)}).observe(document,{childList:!0,subtree:!0});function s(i){const r={};return i.integrity&&(r.integrity=i.integrity),i.referrerPolicy&&(r.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?r.credentials="include":i.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function a(i){if(i.ep)return;i.ep=!0;const r=s(i);fetch(i.href,r)}})();const O={recruitModule:{key:"recruitModule",label:"Recruit",description:"Jobs, pipelines, candidates, interviews, and RMS operations."},careerPortal:{key:"careerPortal",label:"Career Portal",description:"Public job pages and applicant intake."},shareProfile:{key:"shareProfile",label:"Share Profile",description:"Secure candidate profile sharing with clients."},dialer:{key:"dialer",label:"Dialer",description:"Calling workflow and call disposition tracking."},qrBridgeLogin:{key:"qrBridgeLogin",label:"QR Bridge Login",description:"QR-based bridge login for connected RMS sessions."},advancedAnalytics:{key:"advancedAnalytics",label:"Advanced Analytics",description:"Executive metrics, funnel analytics, and exportable insights."}},f={starter:{id:"starter",name:"Starter",priceMonthly:1499,maxUsers:1,features:["recruitModule","shareProfile"]},professional:{id:"professional",name:"Professional",priceMonthly:2999,maxUsers:3,features:["recruitModule","shareProfile","dialer"]},enterprise:{id:"enterprise",name:"Enterprise",priceMonthly:8999,maxUsers:10,features:["recruitModule","shareProfile","dialer","qrBridgeLogin","advancedAnalytics"]},custom:{id:"custom",name:"Custom",priceMonthly:null,maxUsers:null,features:Object.keys(O),configurable:!0}},L={trialing:"trialing",active:"active",grace:"grace"};function ve(e="starter"){return f[e]||f.starter}function I(e={},t={}){const s=ve(e.plan||t.plan),a=e.customLimits||t.customLimits||{},i=e.customFeatures||t.features;return{plan:s.id,maxUsers:Number(a.maxUsers||e.maxUsers||t.maxUsers||s.maxUsers||1),features:Array.isArray(i)&&i.length?i:s.features,priceMonthly:a.priceMonthly??e.priceMonthly??s.priceMonthly}}const l={fullAccess:"full_access",manageUsers:"manage_users",manageRoles:"manage_roles",manageBilling:"manage_billing",manageJobs:"manage_jobs",manageCandidates:"manage_candidates",useDialer:"use_dialer",shareProfiles:"share_profiles",readOnly:"read_only",viewAnalytics:"view_analytics",useQrBridgeLogin:"use_qr_bridge_login"},y={owner:{id:"owner",label:"Owner",permissions:Object.values(l)},admin:{id:"admin",label:"Admin",permissions:[l.manageUsers,l.manageRoles,l.manageJobs,l.manageCandidates,l.shareProfiles,l.readOnly,l.viewAnalytics]},recruiter:{id:"recruiter",label:"Recruiter",permissions:[l.manageCandidates,l.useDialer,l.shareProfiles,l.readOnly]},viewer:{id:"viewer",label:"Viewer",permissions:[l.readOnly]}},be={recruitModule:[l.manageJobs,l.manageCandidates,l.readOnly],careerPortal:[l.manageJobs,l.readOnly],shareProfile:[l.shareProfiles],dialer:[l.useDialer],qrBridgeLogin:[l.useQrBridgeLogin],advancedAnalytics:[l.viewAnalytics]};function ye(e="viewer"){return y[e]||y.viewer}const H=new Set([L.trialing,L.active,L.grace]);function N(e,t){if(!e||e.status!=="active")return!1;const s=ye(e.role);return s.permissions.includes("full_access")||s.permissions.includes(t)}function P(e,t,s){return!e||e.status!=="active"||!T(t)?!1:I(t,e).features.includes(s)}function B(e,t,s,a){return P(t,s,a)?(be[a]||[]).some(r=>N(e,r)):!1}function F(e,t,s){if(!e||e.status!=="active")return{allowed:!1,reason:"Company is not active."};if(!T(t))return{allowed:!1,reason:"Subscription is not active."};const{maxUsers:a}=I(t,e);return s>=a?{allowed:!1,reason:`User limit reached: ${s}/${a}.`}:{allowed:!0,reason:"User can be added."}}function T(e){if(!e||!H.has(e.status))return!1;const t=e.currentPeriodEnd||e.trialEndsAt||e.expiresAt;if(!t)return!0;const s=t.seconds?new Date(t.seconds*1e3):new Date(t);if(Number.isNaN(s.getTime()))return!0;const a=Number(e.gracePeriodDays||0),i=new Date(s);return i.setDate(i.getDate()+a),i>=new Date}function ge(e){return e?H.has(e.status)?T(e)?"":"Subscription period has expired.":`Subscription status is ${e.status}.`:"No subscription is linked to this company."}const he={apiKey:"AIzaSyDKuFUJyHUl5AIFSFHCg-4S_wadsha6Et4",authDomain:"recruitment-suite-hr.firebaseapp.com",projectId:"recruitment-suite-hr",storageBucket:"recruitment-suite-hr.firebasestorage.app",messagingSenderId:"1049067446272",appId:"1:1049067446272:web:a0eb4e5a9fac1589a8f8e5"},J=oe(he),q=ae(J),p=le(J);function k(e){return{id:e.id,...e.data()}}async function we(e,t="createdAt",s="desc",a=100){const i=x(p,e);try{return(await M(D(i,G(t,s),z(a)))).docs.map(k)}catch(r){if(r.code==="failed-precondition"||r.message.includes("requires an index"))return(await M(D(i,z(a)))).docs.map(k);throw r}}async function $e(e,t,s="createdAt"){const a=x(p,e);return(await M(D(a,ce("companyId","==",t),G(s,"desc")))).docs.map(k)}async function W(e,t){if(!t)return null;const s=await de(w(p,e,t));return s.exists()?k(s):null}async function Y(e,t){const s={...t,createdAt:m(),updatedAt:m()};return(await me(x(p,e),s)).id}async function Ie(e,t,s){return await fe(w(p,e,t),{...s,createdAt:m(),updatedAt:m()},{merge:!0}),t}async function E(e,t,s){await ue(w(p,e,t),{...s,updatedAt:m()})}async function Ee({company:e,owner:t,subscriptionId:s}){return pe(p,async a=>{const i=w(x(p,"companies")),r=w(p,"users",t.userId),d=w(p,"subscriptions",s);return a.set(i,{...e,companyId:i.id,createdAt:m(),updatedAt:m()}),a.set(r,{...t,companyId:i.id,createdAt:m(),updatedAt:m()}),a.update(d,{companyId:i.id,updatedAt:m()}),i.id})}function Ae(e){return ie(q,e)}async function Se(e,t){return(await ne(q,e,t)).user}async function Q(){await re(q)}async function Ce(e){if(!e)return{firebaseUser:null,user:null,company:null,subscription:null,blocked:!1};const t=await Ue("platformAdmins",e.uid);return(t==null?void 0:t.status)==="active"?{firebaseUser:e,platformAdmin:t,user:{id:e.uid,userId:e.uid,name:t.name||e.email||"Platform Admin",email:e.email,role:"platform_admin",status:"active"},company:null,subscription:null,blocked:!1,adminMode:!0}:{firebaseUser:e,user:null,company:null,subscription:null,blocked:!0,ownerOnly:!0,blockedReason:`This private control panel requires /platformAdmins/${e.uid} with status "active".`}}async function Ue(e,t){try{return await W(e,t)}catch(s){if(s.code==="permission-denied"||s.message.includes("permissions"))return null;throw s}}async function Ne(e,t){const s=I(e),a=t.ownerId||crypto.randomUUID();return Ee({subscriptionId:e.id,company:{companyName:t.companyName,ownerId:a,subscriptionId:e.id,plan:e.plan||f.starter.id,maxUsers:s.maxUsers,status:"active",features:s.features,customLimits:e.customLimits||{}},owner:{userId:a,name:t.ownerName,email:t.ownerEmail.toLowerCase(),role:"owner",status:"active",inviteStatus:"accepted"}})}async function Pe({company:e,subscription:t,activeUserCount:s,userId:a,name:i,email:r,role:d}){const C=F(e,t,s);if(!C.allowed)throw new Error(C.reason);return Ie("users",a,{userId:a,companyId:e.id,name:i,email:r.toLowerCase(),role:d,status:"active",inviteStatus:"credentials_sent",credentialsProvidedBy:"platform_admin",activatedAt:new Date().toISOString()})}async function ke(e,t){if(!y[t])throw new Error("Unknown role.");await E("users",e,{role:t})}async function xe(e){return $e("users",e)}async function Re(e){var i;const t=f[e.plan]||f.starter,s=e.plan==="custom"?{maxUsers:Number(e.maxUsers||1),priceMonthly:Number(e.priceMonthly||0)}:{},a=I({plan:t.id,customLimits:s,customFeatures:e.features});return Y("subscriptions",{subscriptionId:e.subscriptionId||`sub_${crypto.randomUUID()}`,razorpayCustomerId:e.razorpayCustomerId||"",razorpaySubscriptionId:e.razorpaySubscriptionId||"",customerName:e.customerName,customerEmail:e.customerEmail.toLowerCase(),billingEmail:((i=e.billingEmail)==null?void 0:i.toLowerCase())||e.customerEmail.toLowerCase(),plan:t.id,priceMonthly:a.priceMonthly,maxUsers:a.maxUsers,customLimits:s,customFeatures:a.features,status:e.status||"trialing",trialEndsAt:e.trialEndsAt||null,currentPeriodStart:e.currentPeriodStart||new Date().toISOString(),currentPeriodEnd:e.currentPeriodEnd||null,gracePeriodDays:Number(e.gracePeriodDays||7),cancelAtPeriodEnd:!1,lastPaymentStatus:e.lastPaymentStatus||"not_started"})}async function Le(e,t){const s=f[t];if(!s)throw new Error("Unknown upgrade plan.");await E("subscriptions",e,{plan:s.id,maxUsers:s.maxUsers,priceMonthly:s.priceMonthly,customLimits:{},customFeatures:s.features,status:"active",pendingPlanChange:null})}async function Me(e,t){const s=f[t];if(!s)throw new Error("Unknown downgrade plan.");await E("subscriptions",e,{pendingPlanChange:{plan:s.id,effectiveAt:"period_end",requestedAt:new Date().toISOString()}})}async function De(e){await E("subscriptions",e,{cancelAtPeriodEnd:!0,status:"cancelled"})}async function A({companyId:e,actorId:t,action:s,entityType:a,entityId:i,metadata:r={}}){return Y("activityLogs",{companyId:e,actorId:t,action:s,entityType:a,entityId:i,metadata:r})}const K=new Intl.NumberFormat("en-IN",{style:"currency",currency:"INR",maximumFractionDigits:0});function X(e){if(!e)return"N/A";const t=e.seconds?new Date(e.seconds*1e3):new Date(e);return Number.isNaN(t.getTime())?"N/A":t.toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"})}function Be(e){if(!e)return"N/A";const t=e.seconds?new Date(e.seconds*1e3):new Date(e);return Number.isNaN(t.getTime())?"N/A":t.toLocaleString("en-IN",{day:"2-digit",month:"short",year:"numeric",hour:"2-digit",minute:"2-digit"})}function o(e=""){return e.toString().replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#039;")}function Z(e=0,t=1){return t?Math.min(100,Math.round(e/t*100)):0}function v(e,t=!1){var a;(a=document.querySelector(".toast"))==null||a.remove();const s=document.createElement("div");s.className=`toast${t?" error":""}`,s.textContent=e,document.body.appendChild(s),setTimeout(()=>s.remove(),3400)}const $=document.getElementById("app"),V={overview:{icon:"fa-gauge-high",label:"Overview",title:"Owner Control Center",subtitle:"Create subscriptions, companies, login users, roles, and RMS access from one private admin panel."},companies:{icon:"fa-building-shield",label:"Companies",title:"Company Workspaces",subtitle:"Every subscription provisions one isolated company workspace."},users:{icon:"fa-users-gear",label:"Users",title:"User Management",subtitle:"Invite users, enforce plan limits, and assign RBAC roles."},roles:{icon:"fa-user-lock",label:"Roles",title:"Roles & Permissions",subtitle:"System roles map directly to reusable permission helpers."},subscriptions:{icon:"fa-credit-card",label:"Subscriptions",title:"Manual Subscription Control",subtitle:"You control plan status, upgrades, downgrades, cancellations, trial, grace, and suspension."},modules:{icon:"fa-diagram-project",label:"RMS Modules",title:"RMS Module Access",subtitle:"Feature access depends on both plan entitlement and role permissions."},architecture:{icon:"fa-database",label:"Architecture",title:"Production Architecture",subtitle:"Firestore schema, isolation model, access flow, and deployment notes."}};let n={view:"overview",session:null,subscriptions:[],companies:[],users:[],roles:[],permissions:[],logs:[]};document.addEventListener("DOMContentLoaded",()=>{b(),Ae(async e=>{var t;try{n.session=await Ce(e),(t=n.session)!=null&&t.blocked||await g(),b()}catch(s){console.error(s),ee(s.message)}})});async function g(){const[e,t,s,a,i,r]=await Promise.all([h("subscriptions"),h("companies"),h("users"),h("roles"),h("permissions"),h("activityLogs")]);n={...n,subscriptions:e,companies:t,users:s,roles:a,permissions:i,logs:r}}async function h(e){try{return await we(e)}catch(t){if(t.code==="permission-denied"||t.message.includes("permissions"))return console.warn(`${e} is blocked by Firestore rules for this account.`),[];throw t}}function b(){var t,s,a,i;if(!((t=n.session)!=null&&t.firebaseUser)){ee();return}if(n.session.blocked){Oe();return}const e=V[n.view];$.className="",$.innerHTML=`
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
                    ${Object.entries(V).map(([r,d])=>`
                        <button class="nav-button ${r===n.view?"active":""}" data-view="${r}">
                            <i class="fas ${d.icon}"></i>
                            <span>${d.label}</span>
                        </button>
                    `).join("")}
                </nav>
                <div class="tenant-card">
                    <strong>${o(((s=n.session.company)==null?void 0:s.companyName)||"Platform Admin")}</strong>
                    <span>${n.session.adminMode?"Private owner panel":`${o(((a=n.session.user)==null?void 0:a.role)||"No role")} - ${o(((i=n.session.subscription)==null?void 0:i.status)||"No subscription")}`}</span>
                    <button class="btn" id="logoutButton" type="button" style="margin-top:14px;width:100%">
                        <i class="fas fa-arrow-right-from-bracket"></i> Logout
                    </button>
                </div>
            </aside>
            <main class="content">
                <header class="topbar">
                    <div>
                        <h1>${e.title}</h1>
                        <p class="muted">${e.subtitle}</p>
                    </div>
                    <div class="actions">
                        <button class="btn" id="refreshButton" type="button"><i class="fas fa-rotate"></i> Refresh</button>
                        <button class="btn btn-primary" id="primaryAction" type="button"><i class="fas fa-plus"></i> ${ot()}</button>
                    </div>
                </header>
                <section id="viewRoot" class="fade-in">${Fe()}</section>
            </main>
        </div>
    `,He(),Je()}function ee(e=""){$.className="shell-loading",$.innerHTML=`
        <form class="boot-card form" id="loginForm">
            <div class="brand-mark"><i class="fas fa-shield-halved"></i></div>
            <div>
                <h1>NextGen Udaan Access</h1>
                <p class="muted">Private owner login. Customers should not use this panel.</p>
            </div>
            ${e?`<p class="badge badge-danger">${o(e)}</p>`:""}
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
    `,document.getElementById("loginForm").addEventListener("submit",async t=>{t.preventDefault();try{await Se(document.getElementById("loginEmail").value.trim(),document.getElementById("loginPassword").value)}catch(s){v(s.message,!0)}})}function Oe(){$.className="expired",$.innerHTML=`
        <div class="panel">
            <p class="eyebrow">${n.session.ownerOnly?"Owner access required":"Subscription required"}</p>
            <h1>${n.session.ownerOnly?"This account is not an admin":"Access is paused"}</h1>
            <p class="muted">${o(n.session.blockedReason||"Subscription inactive. Contact NextGen Udaan to restore access.")}</p>
            ${n.session.ownerOnly?'<p class="muted">Create that Firestore document once, then refresh and sign in again.</p>':""}
            <div class="actions">
                <button class="btn btn-primary" id="billingRetry"><i class="fas fa-copy"></i> Copy UID</button>
                <button class="btn" id="logoutButton"><i class="fas fa-arrow-right-from-bracket"></i> Logout</button>
            </div>
        </div>
    `,document.getElementById("logoutButton").addEventListener("click",Q),document.getElementById("billingRetry").addEventListener("click",()=>{var e,t;(t=navigator.clipboard)==null||t.writeText(((e=n.session.firebaseUser)==null?void 0:e.uid)||""),v("UID copied.")})}function Fe(){switch(n.view){case"companies":return qe();case"users":return je();case"roles":return _e();case"subscriptions":return ze();case"modules":return Ve();case"architecture":return Ge();default:return Te()}}function Te(){const e=n.subscriptions.filter(i=>["active","trialing","grace"].includes(i.status)).length,t=n.companies.filter(i=>i.status==="active").length,s=n.users.filter(i=>i.status==="active").length,a=n.companies.filter(i=>i.status==="suspended").length;return`
        <div class="grid">
            <section class="hero">
                <div>
                    <p class="eyebrow">Multi-tenant SaaS access</p>
                    <h2>Your private provisioning desk for Recruitment Management customers.</h2>
                    <p class="muted">Customers contact you. You create their subscription, company, users, and roles, then send only their RMS portal link, email, and password.</p>
                </div>
                <div class="domain-strip">
                    ${c("nextgenudaan.in","Public information and contact")}
                    ${c("access.nextgenudaan.in","Private owner-only control panel")}
                    ${c("app.nextgenudaan.in","Customer RMS login")}
                </div>
            </section>
            <section class="grid metrics">
                ${U("Subscriptions",e,"fa-credit-card")}
                ${U("Companies",t,"fa-building")}
                ${U("Active Users",s,"fa-users")}
                ${U("Suspended",a,"fa-ban")}
            </section>
            <section class="grid two">
                <div class="panel">
                    <div class="table-head">
                        <div>
                            <h3>Plan Usage</h3>
                            <p class="muted">Active users compared with plan maximum.</p>
                        </div>
                    </div>
                    ${at()}
                </div>
                <div class="panel">
                    <div class="table-head">
                        <div>
                            <h3>Recent Activity</h3>
                            <p class="muted">Audit-ready access and billing events.</p>
                        </div>
                    </div>
                    ${st(n.logs.slice(0,8))}
                </div>
            </section>
        </div>
    `}function qe(){return`
        <div class="grid two">
            <div class="panel">
                <h3>Create Company Workspace</h3>
                <p class="muted">Creates the customer workspace and first login profile after you create the Firebase Auth user.</p>
                <form id="companyForm" class="form">
                    <div class="field">
                        <label for="companySubscription">Subscription</label>
                        <select id="companySubscription" required>
                            <option value="">Select subscription</option>
                            ${n.subscriptions.filter(t=>!t.companyId&&["active","trialing","grace"].includes(t.status)).map(t=>`<option value="${t.id}">${o(t.customerName)} - ${_(t.plan)}</option>`).join("")}
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
                        <p class="muted">${n.companies.length} company records</p>
                    </div>
                </div>
                ${Ze(n.companies)}
            </div>
        </div>
    `}function je(){return`
        <div class="grid two">
            <div class="panel">
                <h3>Invite User</h3>
                <p class="muted">Create the Firebase Auth account first, then add the user profile here and send the customer their app link plus credentials.</p>
                <form id="userForm" class="form">
                    <div class="field">
                        <label for="userCompany">Company</label>
                        <select id="userCompany" required>
                            <option value="">Select company</option>
                            ${n.companies.map(e=>`<option value="${e.id}">${o(e.companyName)} - ${R(e.id)}/${e.maxUsers}</option>`).join("")}
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
                            ${Object.values(y).map(e=>`<option value="${e.id}">${e.label}</option>`).join("")}
                        </select>
                    </div>
                    <button class="btn btn-primary" type="submit"><i class="fas fa-user-plus"></i> Create Login Profile</button>
                </form>
            </div>
            <div class="panel">
                <div class="table-head">
                    <div>
                        <h3>Users</h3>
                        <p class="muted">${n.users.length} users across all tenants</p>
                    </div>
                </div>
                ${et(n.users)}
            </div>
        </div>
    `}function _e(){return`
        <div class="grid">
            <section class="grid three">
                ${Object.values(y).map(e=>`
                    <div class="panel">
                        <h3>${e.label}</h3>
                        <p class="muted">${e.permissions.length} permissions</p>
                        <div>${e.permissions.map(t=>u(t,"soft")).join("")}</div>
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
                            ${n.users.map(e=>`<option value="${e.id}">${o(e.name)} - ${o(e.email)}</option>`).join("")}
                        </select>
                    </div>
                    <div class="field">
                        <label for="roleValue">Role</label>
                        <select id="roleValue" required>
                            ${Object.values(y).map(e=>`<option value="${e.id}">${e.label}</option>`).join("")}
                        </select>
                    </div>
                    <button class="btn btn-primary" type="submit"><i class="fas fa-user-check"></i> Assign Role</button>
                </form>
            </section>
        </div>
    `}function ze(){return`
        <div class="grid">
            <section class="grid three">
                ${Object.values(f).map(it).join("")}
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
                                ${Object.values(f).map(e=>`<option value="${e.id}">${e.name}</option>`).join("")}
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
                            <p class="muted">${n.subscriptions.length} billing records</p>
                        </div>
                    </div>
                    ${tt(n.subscriptions)}
                </div>
            </section>
        </div>
    `}function Ve(){const e=rt(),t=te(e),s=n.session.user;return`
        <div class="grid">
            <section class="panel">
                <div class="table-head">
                    <div>
                        <h3>Current Access Evaluation</h3>
                        <p class="muted">Reusable helper output for <code>hasPermission()</code>, <code>hasFeature()</code>, and module gates.</p>
                    </div>
                </div>
                <div class="grid three">
                    ${Object.values(O).map(a=>`
                        <div class="panel">
                            <h3>${a.label}</h3>
                            <p class="muted">${a.description}</p>
                            ${u(P(e,t,a.key)?"Plan enabled":"Plan blocked",P(e,t,a.key)?"success":"danger")}
                            ${u(B(s,e,t,a.key)?"Role allowed":"Role blocked",B(s,e,t,a.key)?"success":"warning")}
                        </div>
                    `).join("")}
                </div>
            </section>
            <section class="panel">
                <h3>Permission Probe</h3>
                <p class="muted">Active user: ${o((s==null?void 0:s.name)||"Unknown")} - role: ${o((s==null?void 0:s.role)||"none")}</p>
                <div>${Object.values(l).map(a=>u(`${a}: ${N(s,a)?"yes":"no"}`,N(s,a)?"success":"soft")).join("")}</div>
            </section>
        </div>
    `}function Ge(){return`
        <div class="grid">
            <section class="hero">
                <div>
                    <p class="eyebrow">Login access flow</p>
                    <h2>Owner admin first, customer app login second.</h2>
                    <p class="muted">You use this panel to control every tenant. Customers only use <code>app.nextgenudaan.in</code>; inactive subscriptions render a contact-admin page in the RMS app.</p>
                </div>
                <div class="domain-strip">
                    ${c("1. Firebase Auth","Verify signed-in user")}
                    ${c("2. /platformAdmins/{uid}","Your private owner access to all tenants")}
                    ${c("3. /users/{uid}","Customer app login profile")}
                    ${c("4. /companies/{companyId}","Tenant status and plan")}
                    ${c("5. /subscriptions/{id}","Status, expiry, grace, suspension")}
                    ${c("6. Helper gates","hasPermission + hasFeature")}
                </div>
            </section>
            <section class="grid two">
                <div class="panel">
                    <h3>Firestore Collections</h3>
                    <div class="domain-strip">
                        ${c("/platformAdmins/{uid}","owner-only admin access for this panel")}
                        ${c("/companies/{companyId}","companyName, ownerId, subscriptionId, plan, maxUsers, status, features")}
                        ${c("/users/{userId}","companyId, name, email, role, status, inviteStatus")}
                        ${c("/subscriptions/{subscriptionId}","plan, maxUsers, status, dates, Razorpay ids, custom limits")}
                        ${c("/roles/{roleId}","companyId, label, permissions, status")}
                        ${c("/permissions/{permissionId}","key, module, description")}
                        ${c("/activityLogs/{logId}","companyId, actorId, action, entity, metadata")}
                    </div>
                </div>
                <div class="panel">
                    <h3>Production Notes</h3>
                    <div class="domain-strip">
                        ${c("Tenant isolation","All RMS reads and writes include companyId equality checks.")}
                        ${c("Optimized queries","Use companyId + createdAt indexes for users, jobs, candidates, and logs.")}
                        ${c("Credential flow","You create Auth users, add /users profiles, and send app link plus credentials.")}
                        ${c("Webhook sync","Existing Razorpay webhook updates /subscriptions and logs activity.")}
                        ${c("Suspension","Failed payment enters grace, then suspended after gracePeriodDays.")}
                    </div>
                </div>
            </section>
        </div>
    `}function He(){var e,t,s;document.querySelectorAll("[data-view]").forEach(a=>{a.addEventListener("click",()=>{n.view=a.dataset.view,b()})}),(e=document.getElementById("logoutButton"))==null||e.addEventListener("click",Q),(t=document.getElementById("refreshButton"))==null||t.addEventListener("click",async()=>{await g(),b(),v("Data refreshed.")}),(s=document.getElementById("primaryAction"))==null||s.addEventListener("click",()=>{var a,i;(a=document.querySelector("form input, form select"))==null||a.focus(),(i=document.querySelector("form"))==null||i.scrollIntoView({behavior:"smooth",block:"center"})})}function Je(){var e,t,s,a;(e=document.getElementById("subscriptionForm"))==null||e.addEventListener("submit",We),(t=document.getElementById("companyForm"))==null||t.addEventListener("submit",Ye),(s=document.getElementById("userForm"))==null||s.addEventListener("submit",Qe),(a=document.getElementById("roleForm"))==null||a.addEventListener("submit",Ke),document.querySelectorAll("[data-sub-action]").forEach(i=>{i.addEventListener("click",()=>Xe(i))})}async function We(e){var a,i;e.preventDefault();const t={customerName:document.getElementById("customerName").value.trim(),customerEmail:document.getElementById("customerEmail").value.trim(),plan:document.getElementById("plan").value,maxUsers:document.getElementById("customMaxUsers").value,priceMonthly:document.getElementById("customPrice").value,status:document.getElementById("status").value},s=await Re(t);await A({companyId:((a=n.session.company)==null?void 0:a.id)||"platform",actorId:((i=n.session.user)==null?void 0:i.id)||"system",action:"subscription.created",entityType:"subscription",entityId:s,metadata:{plan:t.plan}}),await g(),b(),v("Subscription created.")}async function Ye(e){var a;e.preventDefault();const t=await W("subscriptions",document.getElementById("companySubscription").value),s=await Ne(t,{companyName:document.getElementById("companyName").value.trim(),ownerId:document.getElementById("ownerId").value.trim(),ownerName:document.getElementById("ownerName").value.trim(),ownerEmail:document.getElementById("ownerEmail").value.trim()});await A({companyId:s,actorId:((a=n.session.user)==null?void 0:a.id)||"system",action:"company.provisioned",entityType:"company",entityId:s}),await g(),b(),v("Company workspace provisioned.")}async function Qe(e){var d;e.preventDefault();const t=n.companies.find(C=>C.id===document.getElementById("userCompany").value),s=te(t),a=R(t.id),i=F(t,s,a);if(!i.allowed){v(i.reason,!0);return}const r=await Pe({company:t,subscription:s,activeUserCount:a,userId:document.getElementById("inviteUid").value.trim(),name:document.getElementById("inviteName").value.trim(),email:document.getElementById("inviteEmail").value.trim(),role:document.getElementById("inviteRole").value});await A({companyId:t.id,actorId:((d=n.session.user)==null?void 0:d.id)||"system",action:"user.login_profile_created",entityType:"user",entityId:r}),await g(),b(),v("Customer login profile created.")}async function Ke(e){var i,r;e.preventDefault();const t=document.getElementById("roleUser").value,s=document.getElementById("roleValue").value;await ke(t,s);const a=n.users.find(d=>d.id===t);await A({companyId:(a==null?void 0:a.companyId)||((i=n.session.company)==null?void 0:i.id)||"platform",actorId:((r=n.session.user)==null?void 0:r.id)||"system",action:"role.assigned",entityType:"user",entityId:t,metadata:{role:s}}),await g(),b(),v("Role assigned.")}async function Xe(e){var i,r;const t=e.dataset.subId,s=e.dataset.subAction,a=e.dataset.plan;s==="upgrade"&&await Le(t,a),s==="downgrade"&&await Me(t,a),s==="cancel"&&await De(t),s==="suspend"&&await E("subscriptions",t,{status:"suspended"}),await A({companyId:((i=n.session.company)==null?void 0:i.id)||"platform",actorId:((r=n.session.user)==null?void 0:r.id)||"system",action:`subscription.${s}`,entityType:"subscription",entityId:t,metadata:{plan:a}}),await g(),b(),v(`Subscription ${s} saved.`)}function Ze(e){return e.length?`
        <div class="table-wrap">
            <table>
                <thead><tr><th>Company</th><th>Plan</th><th>Status</th><th>Users</th><th>Features</th></tr></thead>
                <tbody>
                    ${e.map(t=>{const s=R(t.id);return`
                            <tr>
                                <td><span class="cell-title">${o(t.companyName)}</span><span class="cell-sub">${o(t.id)}</span></td>
                                <td>${u(_(t.plan),"info")}</td>
                                <td>${u(t.status||"unknown",j(t.status))}</td>
                                <td><span class="cell-title">${s}/${t.maxUsers}</span><div class="progress"><span style="--value:${Z(s,t.maxUsers)}%"></span></div></td>
                                <td>${(t.features||[]).map(a=>u(se(a),"soft")).join("")}</td>
                            </tr>
                        `}).join("")}
                </tbody>
            </table>
        </div>
    `:S("No companies provisioned yet.")}function et(e){return e.length?`
        <div class="table-wrap">
            <table>
                <thead><tr><th>User</th><th>Company</th><th>Role</th><th>Status</th><th>Created</th></tr></thead>
                <tbody>
                    ${e.map(t=>{var s;return`
                        <tr>
                            <td><span class="cell-title">${o(t.name)}</span><span class="cell-sub">${o(t.email)}</span></td>
                            <td>${o(nt(t.companyId))}</td>
                            <td>${u(((s=y[t.role])==null?void 0:s.label)||t.role,"info")}</td>
                            <td>${u(t.status||"unknown",j(t.status))}</td>
                            <td>${X(t.createdAt)}</td>
                        </tr>
                    `}).join("")}
                </tbody>
            </table>
        </div>
    `:S("No users created yet.")}function tt(e){return e.length?`
        <div class="table-wrap">
            <table>
                <thead><tr><th>Customer</th><th>Plan</th><th>Status</th><th>Billing</th><th>Actions</th></tr></thead>
                <tbody>
                    ${e.map(t=>`
                        <tr>
                            <td><span class="cell-title">${o(t.customerName)}</span><span class="cell-sub">${o(t.customerEmail)}</span></td>
                            <td>${u(_(t.plan),"info")}<span class="cell-sub">${t.maxUsers||I(t).maxUsers} users</span></td>
                            <td>${u(t.status||"unknown",j(t.status))}<span class="cell-sub">${ge(t)}</span></td>
                            <td><span class="cell-title">${t.priceMonthly?K.format(t.priceMonthly):"Custom"}</span><span class="cell-sub">Period end ${X(t.currentPeriodEnd)}</span></td>
                            <td>
                                <button class="btn" data-sub-action="upgrade" data-plan="enterprise" data-sub-id="${t.id}" title="Upgrade to Enterprise"><i class="fas fa-arrow-up"></i></button>
                                <button class="btn" data-sub-action="downgrade" data-plan="starter" data-sub-id="${t.id}" title="Schedule downgrade"><i class="fas fa-arrow-down"></i></button>
                                <button class="btn" data-sub-action="suspend" data-sub-id="${t.id}" title="Suspend"><i class="fas fa-ban"></i></button>
                                <button class="btn btn-danger" data-sub-action="cancel" data-sub-id="${t.id}" title="Cancel"><i class="fas fa-xmark"></i></button>
                            </td>
                        </tr>
                    `).join("")}
                </tbody>
            </table>
        </div>
    `:S("No subscriptions created yet.")}function st(e){return e.length?`
        <div class="table-wrap">
            <table>
                <thead><tr><th>Action</th><th>Entity</th><th>When</th></tr></thead>
                <tbody>
                    ${e.map(t=>`
                        <tr>
                            <td>${u(t.action,"info")}</td>
                            <td><span class="cell-title">${o(t.entityType||"record")}</span><span class="cell-sub">${o(t.entityId||"")}</span></td>
                            <td>${Be(t.createdAt)}</td>
                        </tr>
                    `).join("")}
                </tbody>
            </table>
        </div>
    `:S("No activity logs yet.")}function at(){return n.companies.length?`<div class="domain-strip">${n.companies.map(e=>{const t=R(e.id);return`
            <div>
                <div class="domain-item">
                    <strong>${o(e.companyName)}</strong>
                    <span>${t}/${e.maxUsers} users</span>
                </div>
                <div class="progress"><span style="--value:${Z(t,e.maxUsers)}%"></span></div>
            </div>
        `}).join("")}</div>`:S("No usage data yet.")}function it(e){const t=e.priceMonthly?`${K.format(e.priceMonthly)}/month`:"Dynamic pricing";return`
        <div class="panel plan-card">
            <div>
                <h3>${e.name}</h3>
                <div class="plan-price">${t}</div>
                <p class="muted">${e.maxUsers?`${e.maxUsers} max users`:"Custom user limits"}</p>
            </div>
            <div class="plan-features">
                ${e.features.map(s=>`<span><i class="fas fa-check"></i> ${se(s)}</span>`).join("")}
            </div>
        </div>
    `}function U(e,t,s){return`
        <div class="metric">
            <div class="metric-icon"><i class="fas ${s}"></i></div>
            <div class="metric-value">${t}</div>
            <div class="metric-label">${e}</div>
        </div>
    `}function c(e,t){return`<div class="domain-item"><strong>${o(e)}</strong><span>${o(t)}</span></div>`}function u(e,t="soft"){return`<span class="badge badge-${t}">${o(e)}</span>`}function S(e){return`<div class="empty">${o(e)}</div>`}function j(e=""){return["active","accepted"].includes(e)?"success":["trialing","grace","invited","pending"].includes(e)?"warning":["suspended","cancelled","expired","past_due","disabled"].includes(e)?"danger":"soft"}function R(e){return n.users.filter(t=>t.companyId===e&&t.status!=="disabled").length}function nt(e){var t;return((t=n.companies.find(s=>s.id===e))==null?void 0:t.companyName)||"Unknown company"}function rt(){var e;return((e=n.session)==null?void 0:e.company)||n.companies[0]||null}function te(e){var t;return((t=n.session)==null?void 0:t.subscription)||n.subscriptions.find(s=>s.id===(e==null?void 0:e.subscriptionId))||n.subscriptions[0]||null}function _(e){var t;return((t=f[e])==null?void 0:t.name)||"Custom"}function se(e){var t;return((t=O[e])==null?void 0:t.label)||e}function ot(){return n.view==="companies"?"Create Company":n.view==="users"?"Invite User":n.view==="roles"?"Assign Role":n.view==="subscriptions"?"Create Plan":"New Record"}window.NextGenAccess={hasPermission:N,hasFeature:P,canAddUser:F,canAccessModule:B,getCompanyUsers:xe};
