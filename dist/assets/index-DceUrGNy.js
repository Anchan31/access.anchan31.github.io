import{getAuth as te,onAuthStateChanged as ve,signInWithEmailAndPassword as be,signOut as ye,createUserWithEmailAndPassword as ge}from"https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";import{initializeApp as se}from"https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";import{getFirestore as he,collection as B,getDocs as j,query as _,where as we,orderBy as ae,limit as Z,updateDoc as xe,doc as I,serverTimestamp as b,getDoc as $e,addDoc as Ie,setDoc as Ae,runTransaction as Ee}from"https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))a(i);new MutationObserver(i=>{for(const r of i)if(r.type==="childList")for(const u of r.addedNodes)u.tagName==="LINK"&&u.rel==="modulepreload"&&a(u)}).observe(document,{childList:!0,subtree:!0});function s(i){const r={};return i.integrity&&(r.integrity=i.integrity),i.referrerPolicy&&(r.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?r.credentials="include":i.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function a(i){if(i.ep)return;i.ep=!0;const r=s(i);fetch(i.href,r)}})();const W={recruitModule:{key:"recruitModule",label:"Recruit",description:"Jobs, pipelines, candidates, interviews, and RMS operations."},careerPortal:{key:"careerPortal",label:"Career Portal",description:"Public job pages and applicant intake."},shareProfile:{key:"shareProfile",label:"Share Profile",description:"Secure candidate profile sharing with clients."},dialer:{key:"dialer",label:"Dialer",description:"Calling workflow and call disposition tracking."},qrBridgeLogin:{key:"qrBridgeLogin",label:"QR Bridge Login",description:"QR-based bridge login for connected RMS sessions."},advancedAnalytics:{key:"advancedAnalytics",label:"Advanced Analytics",description:"Executive metrics, funnel analytics, and exportable insights."}},y={starter:{id:"starter",name:"Starter",priceMonthly:1499,maxUsers:1,features:["recruitModule","shareProfile"]},professional:{id:"professional",name:"Professional",priceMonthly:2999,maxUsers:3,features:["recruitModule","shareProfile","dialer"]},enterprise:{id:"enterprise",name:"Enterprise",priceMonthly:8999,maxUsers:10,features:["recruitModule","shareProfile","dialer","qrBridgeLogin","advancedAnalytics"]},custom:{id:"custom",name:"Custom",priceMonthly:null,maxUsers:null,features:Object.keys(W),configurable:!0}},M={trialing:"trialing",active:"active",grace:"grace"};function Se(e="starter"){return y[e]||y.starter}function w(e={},t={}){const s=Se(e.plan||t.plan),a=e.customLimits||t.customLimits||{},i=e.customFeatures||t.features;return{plan:s.id,maxUsers:Number(a.maxUsers||e.maxUsers||t.maxUsers||s.maxUsers||1),features:Array.isArray(i)&&i.length?i:s.features,priceMonthly:a.priceMonthly??e.priceMonthly??s.priceMonthly}}const l={fullAccess:"full_access",manageUsers:"manage_users",manageRoles:"manage_roles",manageBilling:"manage_billing",manageJobs:"manage_jobs",manageCandidates:"manage_candidates",useDialer:"use_dialer",shareProfiles:"share_profiles",readOnly:"read_only",viewAnalytics:"view_analytics",useQrBridgeLogin:"use_qr_bridge_login"},E={owner:{id:"owner",label:"Owner",permissions:Object.values(l)},admin:{id:"admin",label:"Admin",permissions:[l.manageUsers,l.manageRoles,l.manageJobs,l.manageCandidates,l.shareProfiles,l.readOnly,l.viewAnalytics]},recruiter:{id:"recruiter",label:"Recruiter",permissions:[l.manageCandidates,l.useDialer,l.shareProfiles,l.readOnly]},viewer:{id:"viewer",label:"Viewer",permissions:[l.readOnly]}},Pe={recruitModule:[l.manageJobs,l.manageCandidates,l.readOnly],careerPortal:[l.manageJobs,l.readOnly],shareProfile:[l.shareProfiles],dialer:[l.useDialer],qrBridgeLogin:[l.useQrBridgeLogin],advancedAnalytics:[l.viewAnalytics]};function Ce(e="viewer"){return E[e]||E.viewer}const Ne=new Set([M.trialing,M.active,M.grace]);function k(e,t){if(!e||e.status!=="active")return!1;const s=Ce(e.role);return s.permissions.includes("full_access")||s.permissions.includes(t)}function L(e,t,s){return!e||e.status!=="active"||!ie(t)?!1:w(t,e).features.includes(s)}function T(e,t,s,a){return L(t,s,a)?(Pe[a]||[]).some(r=>k(e,r)):!1}function G(e,t,s){if(!e||e.status!=="active")return{allowed:!1,reason:"Company is not active."};if(!ie(t))return{allowed:!1,reason:"Subscription is not active."};const{maxUsers:a}=w(t,e);return s>=a?{allowed:!1,reason:`User limit reached: ${s}/${a}.`}:{allowed:!0,reason:"User can be added."}}function ie(e){if(!e||!Ne.has(e.status))return!1;const t=e.currentPeriodEnd||e.trialEndsAt||e.expiresAt;if(!t)return!0;const s=t.seconds?new Date(t.seconds*1e3):new Date(t);if(Number.isNaN(s.getTime()))return!0;const a=Number(e.gracePeriodDays||0),i=new Date(s);return i.setDate(i.getDate()+a),i>=new Date}const ne={apiKey:"AIzaSyDKuFUJyHUl5AIFSFHCg-4S_wadsha6Et4",authDomain:"recruitment-suite-hr.firebaseapp.com",projectId:"recruitment-suite-hr",storageBucket:"recruitment-suite-hr.firebasestorage.app",messagingSenderId:"1049067446272",appId:"1:1049067446272:web:a0eb4e5a9fac1589a8f8e5",measurementId:"G-87FVXXYEP7"},re=se(ne),V=te(re),v=he(re),Ue=se(ne,"SecondaryApp"),Re=te(Ue);function q(e){return{id:e.id,...e.data()}}async function ke(e,t="createdAt",s="desc",a=100){const i=B(v,e);try{return(await j(_(i,ae(t,s),Z(a)))).docs.map(q)}catch(r){if(r.code==="failed-precondition"||r.message.includes("requires an index"))return(await j(_(i,Z(a)))).docs.map(q);throw r}}async function Le(e,t,s="createdAt"){const a=B(v,e);return(await j(_(a,we("companyId","==",t),ae(s,"desc")))).docs.map(q)}async function Y(e,t){if(!t)return null;const s=await $e(I(v,e,t));return s.exists()?q(s):null}async function H(e,t){const s={...t,createdAt:b(),updatedAt:b()};return(await Ie(B(v,e),s)).id}async function oe(e,t,s){return await Ae(I(v,e,t),{...s,createdAt:b(),updatedAt:b()},{merge:!0}),t}async function P(e,t,s){await xe(I(v,e,t),{...s,updatedAt:b()})}async function qe({company:e,owner:t,subscriptionId:s}){return Ee(v,async a=>{const i=e.companyId||I(B(v,"companies")).id,r=I(v,"companies",i),u=I(v,"users",t.userId),f=I(v,"subscriptions",s);return a.set(r,{...e,companyId:i,createdAt:b(),updatedAt:b()}),a.set(u,{...t,companyId:i,createdAt:b(),updatedAt:b()}),a.update(f,{companyId:i,updatedAt:b()}),i})}const le=["nextgenudaan@gmail.com","it.nextgenudaan@gmail.com"],Be=le.join(" or ");function De(e){return ve(V,e)}async function Oe(e,t){return(await be(V,e,t)).user}async function ce(){await ye(V)}async function de(e){if(!e)return{firebaseUser:null,user:null,company:null,subscription:null,blocked:!1};const t=(e.email||"").toLowerCase(),s=await Me("platformAdmins",e.uid);if((s==null?void 0:s.status)==="active")return{firebaseUser:e,platformAdmin:s,user:{id:e.uid,userId:e.uid,name:s.name||e.email||"Platform Admin",email:e.email,role:s.role||"owner",status:"active"},company:null,subscription:null,blocked:!1,adminMode:!0};if(le.includes(t))try{return await oe("platformAdmins",e.uid,{name:t==="it.nextgenudaan@gmail.com"?"NextGen Udaan IT Admin":"NextGen Udaan Owner",email:t,role:"owner",status:"active",bootstrappedBy:"owner_email"}),de(e)}catch{return{firebaseUser:e,user:null,company:null,subscription:null,blocked:!0,ownerOnly:!0,ownerBootstrapMissing:!0,blockedReason:`Owner profile is not initialized. Create /platformAdmins/${e.uid} with email "${t}", role "owner", and status "active".`}}return{firebaseUser:e,user:null,company:null,subscription:null,blocked:!0,ownerOnly:!0,blockedReason:`This private control panel is restricted to ${Be}.`}}async function Me(e,t){try{return await Y(e,t)}catch(s){if(s.code==="permission-denied"||s.message.includes("permissions"))return null;throw s}}async function ue(e,t){const s=w(e),a=t.ownerId||crypto.randomUUID();return qe({subscriptionId:e.id,company:{companyId:t.companyId,companyName:t.companyName,ownerId:a,subscriptionId:e.id,plan:e.plan||y.starter.id,maxUsers:s.maxUsers,status:"active",features:s.features,customLimits:e.customLimits||{}},owner:{userId:a,name:t.ownerName,email:t.ownerEmail.toLowerCase(),role:"owner",status:"active",inviteStatus:"accepted"}})}async function je({company:e,subscription:t,activeUserCount:s,userId:a,name:i,email:r,role:u}){const f=G(e,t,s);if(!f.allowed)throw new Error(f.reason);return oe("users",a,{userId:a,companyId:e.id,name:i,email:r.toLowerCase(),role:u,status:"active",inviteStatus:"credentials_sent",credentialsProvidedBy:"platform_admin",activatedAt:new Date().toISOString()})}async function _e(e,t){if(!E[t])throw new Error("Unknown role.");await P("users",e,{role:t})}async function Te(e){return Le("users",e)}async function Fe(e){var i;const t=y[e.plan]||y.starter,s=e.plan==="custom"?{maxUsers:Number(e.maxUsers||1),priceMonthly:Number(e.priceMonthly||0)}:{},a=w({plan:t.id,customLimits:s,customFeatures:e.features});return H("subscriptions",{subscriptionId:e.subscriptionId||`sub_${crypto.randomUUID()}`,purchaseRequestId:e.purchaseRequestId||"",firebaseUid:e.firebaseUid||"",razorpayCustomerId:e.razorpayCustomerId||"",razorpaySubscriptionId:e.razorpaySubscriptionId||"",razorpayPlanId:e.razorpayPlanId||"",customerName:e.customerName,customerEmail:e.customerEmail.toLowerCase(),billingEmail:((i=e.billingEmail)==null?void 0:i.toLowerCase())||e.customerEmail.toLowerCase(),companyName:e.companyName||"",plan:t.id,priceMonthly:a.priceMonthly,maxUsers:a.maxUsers,customLimits:s,customFeatures:a.features,status:e.status||"trialing",trialEndsAt:e.trialEndsAt||null,currentPeriodStart:e.currentPeriodStart||new Date().toISOString(),currentPeriodEnd:e.currentPeriodEnd||null,gracePeriodDays:Number(e.gracePeriodDays||7),cancelAtPeriodEnd:!1,lastPaymentStatus:e.lastPaymentStatus||"not_started",manuallyConfirmedBy:e.manuallyConfirmedBy||"",manuallyConfirmedAt:e.manuallyConfirmedAt||null})}async function ze(e,t){const s=y[t];if(!s)throw new Error("Unknown upgrade plan.");await P("subscriptions",e,{plan:s.id,maxUsers:s.maxUsers,priceMonthly:s.priceMonthly,customLimits:{},customFeatures:s.features,status:"active",pendingPlanChange:null})}async function We(e,t){const s=y[t];if(!s)throw new Error("Unknown downgrade plan.");await P("subscriptions",e,{pendingPlanChange:{plan:s.id,effectiveAt:"period_end",requestedAt:new Date().toISOString()}})}async function Ge(e){await P("subscriptions",e,{cancelAtPeriodEnd:!0,status:"cancelled"})}async function C({companyId:e,actorId:t,action:s,entityType:a,entityId:i,metadata:r={}}){return H("activityLogs",{companyId:e,actorId:t,action:s,entityType:a,entityId:i,metadata:r})}const Ve=new Intl.NumberFormat("en-IN",{style:"currency",currency:"INR",maximumFractionDigits:0});function Ye(e){if(!e)return"N/A";const t=e.seconds?new Date(e.seconds*1e3):new Date(e);return Number.isNaN(t.getTime())?"N/A":t.toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"})}function pe(e){if(!e)return"N/A";const t=e.seconds?new Date(e.seconds*1e3):new Date(e);return Number.isNaN(t.getTime())?"N/A":t.toLocaleString("en-IN",{day:"2-digit",month:"short",year:"numeric",hour:"2-digit",minute:"2-digit"})}function c(e=""){return e.toString().replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#039;")}function F(e=0,t=1){return t?Math.min(100,Math.round(e/t*100)):0}function p(e,t=!1){var a;(a=document.querySelector(".toast"))==null||a.remove();const s=document.createElement("div");s.className=`toast${t?" error":""}`,s.textContent=e,document.body.appendChild(s),setTimeout(()=>s.remove(),3400)}const S=document.getElementById("app"),ee={overview:{icon:"fa-gauge-high",label:"Overview",title:"Owner Control Center",subtitle:"Review paid purchase requests, confirm payment, and manually provision customer access."},requests:{icon:"fa-inbox",label:"Purchase Requests",title:"Payment Requests",subtitle:"Confirm paid Razorpay subscriptions, then create the subscription, company, owner user, and access pass."},companies:{icon:"fa-building-shield",label:"Companies",title:"Company Workspaces",subtitle:"Every subscription provisions one isolated company workspace."},users:{icon:"fa-users-gear",label:"Users",title:"User Management",subtitle:"Invite users, enforce plan limits, and assign RBAC roles."},roles:{icon:"fa-user-lock",label:"Roles",title:"Roles & Permissions",subtitle:"System roles map directly to reusable permission helpers."},subscriptions:{icon:"fa-credit-card",label:"Subscriptions",title:"Manual Subscription Control",subtitle:"You control plan status, upgrades, downgrades, cancellations, trial, grace, and suspension."},modules:{icon:"fa-diagram-project",label:"RMS Modules",title:"RMS Module Access",subtitle:"Feature access depends on both plan entitlement and role permissions."},architecture:{icon:"fa-database",label:"Architecture",title:"Production Architecture",subtitle:"Firestore schema, isolation model, access flow, and deployment notes."}};let n={view:"overview",session:null,subscriptions:[],purchaseRequests:[],accessPasses:[],companies:[],users:[],roles:[],permissions:[],logs:[]};document.addEventListener("DOMContentLoaded",()=>{g(),De(async e=>{var t;try{n.session=await de(e),(t=n.session)!=null&&t.blocked||await x(),g()}catch(s){console.error(s),me(s.message)}})});async function x(){const[e,t,s,a,i,r,u]=await Promise.all([$("subscriptions"),$("accessPasses"),$("companies"),$("users"),$("roles"),$("permissions"),$("activityLogs")]),f=e.filter(d=>!d.companyId).map(d=>{let h="starter";return d.plan_id==="plan_SoAKfnYYCTZHDo"&&(h="professional"),d.plan_id==="plan_SouJvWzj8xFSgg"&&(h="enterprise"),d.plan&&(h=d.plan),{id:d.id,buyerName:d.name||"Unknown Buyer",buyerEmail:d.email||"no-email@test.com",companyName:d.company||`${d.name||"Customer"} Workspace`,mobile:d.mobile||"",plan:h,planName:d.plan_name||U(h),status:d.status||"active",provisioningStatus:d.companyId?"completed":"pending",createdAt:d.created_at||new Date().toISOString(),updatedAt:d.created_at||new Date().toISOString(),razorpaySubscriptionId:d.subscription_id||d.id,razorpayPlanId:d.plan_id||""}});n={...n,subscriptions:e,purchaseRequests:f,accessPasses:t,companies:s,users:a,roles:i,permissions:r,logs:u}}async function $(e){try{return await ke(e)}catch(t){if(t.code==="permission-denied"||t.message.includes("permissions"))return console.warn(`${e} is blocked by Firestore rules for this account.`),[];throw t}}function g(){var t,s,a;if(!((t=n.session)!=null&&t.firebaseUser)){me();return}if(n.session.blocked){He();return}const e=ee[n.view];S.className="",S.innerHTML=`
        <div class="app-shell">
            <aside class="sidebar">
                <div class="brand">
                    <div class="logo-mark"><i class="fas fa-shield-halved"></i></div>
                    <div>
                        <span class="brand-title">NextGen Udaan</span>
                        <span class="brand-subtitle">Control Center</span>
                    </div>
                </div>
                <nav class="nav">
                    ${Object.entries(ee).map(([i,r])=>`
                        <button class="nav-button ${i===n.view?"active":""}" data-view="${i}">
                            <i class="fas ${r.icon}"></i>
                            <span>${r.label}</span>
                        </button>
                    `).join("")}
                </nav>
                <div class="tenant-card">
                    <div class="flex items-center gap-3 mb-3">
                        <div class="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400">
                            <i class="fas fa-user-shield"></i>
                        </div>
                        <div class="flex-1 overflow-hidden">
                            <strong class="truncate">${c(((s=n.session.company)==null?void 0:s.companyName)||"Platform Admin")}</strong>
                            <span class="truncate">${n.session.adminMode?"Super Admin":c(((a=n.session.user)==null?void 0:a.role)||"Admin")}</span>
                        </div>
                    </div>
                    <button class="btn w-full !bg-red-500/10 !text-red-400 !border-red-500/20 hover:!bg-red-500/20 transition-all" id="logoutButton" type="button">
                        <i class="fas fa-power-off"></i> Sign Out
                    </button>
                </div>
            </aside>
            <main class="content">
                <header class="topbar glass-card">
                    <div class="flex flex-col">
                        <h1 class="text-2xl font-bold tracking-tight">${e.title}</h1>
                        <p class="text-xs text-slate-500 font-medium">${e.subtitle}</p>
                    </div>
                    <div class="actions">
                        <button class="btn hover-lift" id="refreshButton" type="button">
                            <i class="fas fa-rotate"></i> Sync
                        </button>
                        <button class="btn btn-primary shimmer" id="primaryAction" type="button">
                            <i class="fas fa-plus"></i> ${$t()}
                        </button>
                    </div>
                </header>
                <section id="viewRoot" class="fade-in">${Je()}</section>
            </main>
        </div>
    `,it(),nt()}function me(e=""){S.className="shell-loading",S.innerHTML=`
        <form class="boot-card form" id="loginForm">
            <div class="brand-mark"><i class="fas fa-shield-halved"></i></div>
            <div>
                <h1>NextGen Udaan Access</h1>
                <p class="muted">Private owner login. Customers should not use this panel.</p>
            </div>
            ${e?`<p class="badge badge-danger">${c(e)}</p>`:""}
            <div class="field">
                <label for="loginEmail">Email</label>
                <input id="loginEmail" type="email" autocomplete="email" required>
            </div>
            <div class="field">
                <label for="loginPassword">Password</label>
                <input id="loginPassword" type="password" autocomplete="current-password" required>
            </div>
            <button class="btn btn-primary" type="submit"><i class="fas fa-lock"></i> Sign In</button>
        </form>
    `,document.getElementById("loginForm").addEventListener("submit",async t=>{t.preventDefault();try{await Oe(document.getElementById("loginEmail").value.trim(),document.getElementById("loginPassword").value)}catch(s){p(s.message,!0)}})}function He(){S.className="expired",S.innerHTML=`
        <div class="panel">
            <p class="eyebrow">${n.session.ownerOnly?"Owner access required":"Subscription required"}</p>
            <h1>${n.session.ownerOnly?"This account is not an admin":"Access is paused"}</h1>
            <p class="muted">${c(n.session.blockedReason||"Subscription inactive. Contact NextGen Udaan to restore access.")}</p>
            ${n.session.ownerOnly?'<p class="muted">Create that Firestore document once, then refresh and sign in again.</p>':""}
            <div class="actions">
                <button class="btn btn-primary" id="billingRetry"><i class="fas fa-copy"></i> Copy UID</button>
                <button class="btn" id="logoutButton"><i class="fas fa-arrow-right-from-bracket"></i> Logout</button>
            </div>
        </div>
    `,document.getElementById("logoutButton").addEventListener("click",ce),document.getElementById("billingRetry").addEventListener("click",()=>{var e,t;(t=navigator.clipboard)==null||t.writeText(((e=n.session.firebaseUser)==null?void 0:e.uid)||""),p("UID copied.")})}function Je(){switch(n.view){case"requests":return Ke();case"companies":return Xe();case"users":return Ze();case"roles":return et();case"subscriptions":return tt();case"modules":return st();case"architecture":return at();default:return Qe()}}function Qe(){const e=n.purchaseRequests.filter(i=>i.status==="payment_received").length,t=n.purchaseRequests.filter(i=>i.provisioningStatus!=="completed").length,s=n.subscriptions.filter(i=>["active","trialing","grace"].includes(i.status)).length,a=n.companies.filter(i=>i.status==="active").length;return`
        <div class="space-y-8 animate-fade-in">
            <!-- Hero Stats -->
            <section class="grid metrics !grid-cols-1 md:!grid-cols-2 lg:!grid-cols-4 gap-6">
                ${R("Paid Requests",e,"fa-receipt","blue")}
                ${R("Pending Setup",t,"fa-hourglass-half","amber")}
                ${R("Active Subs",s,"fa-credit-card","indigo")}
                ${R("Companies",a,"fa-building","emerald")}
            </section>

            <div class="grid two gap-8">
                <div class="space-y-8">
                    <!-- Provisioning Queue -->
                    <div class="panel glass-card overflow-hidden">
                        <div class="p-6 border-b border-white/5 flex justify-between items-center bg-white/5">
                            <div>
                                <h3 class="text-lg font-bold">Provisioning Queue</h3>
                                <p class="text-xs text-slate-500">Awaiting owner activation</p>
                            </div>
                            ${m(t+" Pending","warning")}
                        </div>
                        <div class="p-0">
                            ${z(n.purchaseRequests.slice(0,6),!0)}
                        </div>
                    </div>

                    <!-- Usage Stats -->
                    <div class="panel glass-card">
                        <div class="p-6 border-b border-white/5">
                            <h3 class="text-lg font-bold">Plan Usage</h3>
                            <p class="text-xs text-slate-500">Tenant resource consumption</p>
                        </div>
                        <div class="p-6">
                            ${yt()}
                        </div>
                    </div>
                </div>

                <!-- Recent Activity -->
                <div class="panel glass-card">
                    <div class="p-6 border-b border-white/5 flex justify-between items-center">
                        <div>
                            <h3 class="text-lg font-bold">Audit Log</h3>
                            <p class="text-xs text-slate-500">Real-time system events</p>
                        </div>
                        <i class="fas fa-history text-slate-600"></i>
                    </div>
                    <div class="p-0">
                        ${bt(n.logs.slice(0,10))}
                    </div>
                </div>
            </div>
        </div>
    `}function Ke(){const e=n.purchaseRequests.filter(s=>s.provisioningStatus!=="completed"),t=n.purchaseRequests.filter(s=>s.provisioningStatus==="completed");return`
        <div class="grid">
            <section class="hero">
                <div>
                    <p class="eyebrow">Manual confirmation workflow</p>
                    <h2>Confirm payment, then provision access.</h2>
                    <p class="muted">Use this queue after a buyer completes Razorpay checkout. The button creates the subscription, company, owner user profile, and access pass in Firestore.</p>
                </div>
                <div class="domain-strip">
                    ${o("1. Buyer login","Firebase Auth account from public checkout")}
                    ${o("2. Razorpay","Subscription created and linked to a purchase request")}
                    ${o("3. Owner review","You confirm payment in this portal")}
                    ${o("4. Access pass","SaaS login details are created after provisioning")}
                </div>
            </section>
            <section class="grid two">
                <div class="panel">
                    <div class="table-head">
                        <div>
                            <h3>Needs Owner Action</h3>
                            <p class="muted">${e.length} request${e.length===1?"":"s"} waiting for review.</p>
                        </div>
                    </div>
                    ${z(e)}
                </div>
                <div class="panel">
                    <div class="table-head">
                        <div>
                            <h3>Provisioned</h3>
                            <p class="muted">${t.length} completed customer setup${t.length===1?"":"s"}.</p>
                        </div>
                    </div>
                    ${z(t,!0)}
                </div>
            </section>
        </div>
    `}function Xe(){return`
        <div class="grid two">
            <div class="panel">
                <h3>Create Company Workspace</h3>
                <p class="muted">Creates the customer workspace and first login profile after you create the Firebase Auth user.</p>
                <form id="companyForm" class="form">
                    <div class="field">
                        <label for="companySubscription">Subscription</label>
                        <select id="companySubscription" required>
                            <option value="">Select subscription</option>
                            ${n.subscriptions.filter(t=>!t.companyId&&["active","trialing","grace"].includes(t.status)).map(t=>`<option value="${t.id}">${c(t.customerName)} - ${U(t.plan)}</option>`).join("")}
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
                ${mt(n.companies)}
            </div>
        </div>
    `}function Ze(){return`
        <div class="grid two">
            <div class="panel">
                <h3>Invite User</h3>
                <p class="muted">Create the Firebase Auth account first, then add the user profile here and send the customer their app link plus credentials.</p>
                <form id="userForm" class="form">
                    <div class="field">
                        <label for="userCompany">Company</label>
                        <select id="userCompany" required>
                            <option value="">Select company</option>
                            ${n.companies.map(e=>`<option value="${e.id}">${c(e.companyName)} - ${O(e.id)}/${e.maxUsers}</option>`).join("")}
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
                            ${Object.values(E).map(e=>`<option value="${e.id}">${e.label}</option>`).join("")}
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
                ${ft(n.users)}
            </div>
        </div>
    `}function et(){const e=Object.values(E),t=Object.values(l);return`
        <div class="space-y-8 animate-fade-in">
            <!-- RBAC Matrix -->
            <div class="panel glass-card overflow-hidden">
                <div class="p-6 border-b border-white/5 flex justify-between items-center bg-white/5">
                    <div>
                        <h3 class="text-lg font-bold">Permission Matrix</h3>
                        <p class="text-xs text-slate-500">Cross-role capability mapping for the Nextgen Ecosystem</p>
                    </div>
                    <div class="flex gap-2">
                        ${e.map(s=>m(s.label,"soft")).join("")}
                    </div>
                </div>
                <div class="table-wrap overflow-x-auto">
                    <table class="w-full text-left">
                        <thead>
                            <tr class="border-b border-white/5 text-[10px] font-black uppercase tracking-widest text-slate-500">
                                <th class="px-6 py-4">Permission Scope</th>
                                ${e.map(s=>`<th class="px-6 py-4 text-center">${s.label}</th>`).join("")}
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-white/5">
                            ${t.map(s=>`
                                <tr class="hover:bg-white/5 transition-colors">
                                    <td class="px-6 py-4">
                                        <div class="font-bold text-slate-200">${s.replace(/_/g," ")}</div>
                                        <div class="text-[10px] text-slate-500 font-medium uppercase">Capability</div>
                                    </td>
                                    ${e.map(a=>{const i=a.permissions.includes(s)||a.permissions.includes("full_access");return`
                                            <td class="px-6 py-4 text-center">
                                                <div class="flex justify-center">
                                                    <div class="w-6 h-6 rounded-md flex items-center justify-center ${i?"bg-emerald-500/20 text-emerald-400":"bg-white/5 text-slate-600"}">
                                                        <i class="fas ${i?"fa-check":"fa-minus text-[10px]"}"></i>
                                                    </div>
                                                </div>
                                            </td>
                                        `}).join("")}
                                </tr>
                            `).join("")}
                        </tbody>
                    </table>
                </div>
            </div>

            <div class="grid two gap-8">
                <!-- Role Assignment -->
                <div class="panel glass-card">
                    <div class="p-6 border-b border-white/5">
                        <h3 class="text-lg font-bold">Assign Member Role</h3>
                        <p class="text-xs text-slate-500">Update permissions for a specific user profile</p>
                    </div>
                    <div class="p-6">
                        <form id="roleForm" class="space-y-6">
                            <div class="space-y-2">
                                <label class="text-xs font-bold text-slate-500 uppercase tracking-widest">Select User</label>
                                <select id="roleUser" class="theme-input" required>
                                    <option value="">Select a member...</option>
                                    ${n.users.map(s=>`<option value="${s.id}">${c(s.name)} (${c(s.email)})</option>`).join("")}
                                </select>
                            </div>
                            <div class="space-y-2">
                                <label class="text-xs font-bold text-slate-500 uppercase tracking-widest">Target Role</label>
                                <div class="grid grid-cols-2 gap-3">
                                    ${e.map(s=>`
                                        <label class="relative flex flex-col p-4 rounded-xl border border-white/5 bg-white/5 cursor-pointer hover:bg-white/10 transition-all">
                                            <input type="radio" name="roleValue" value="${s.id}" class="sr-only" required>
                                            <span class="text-sm font-bold text-slate-200">${s.label}</span>
                                            <span class="text-[10px] text-slate-500 font-medium">${s.permissions.length} perms</span>
                                        </label>
                                    `).join("")}
                                </div>
                            </div>
                            <button class="btn btn-primary w-full shimmer" type="submit">
                                <i class="fas fa-user-shield mr-2"></i> Update Permissions
                            </button>
                        </form>
                    </div>
                </div>

                <!-- Role Summary -->
                <div class="panel glass-card p-8 flex flex-col justify-center items-center text-center space-y-4">
                    <div class="w-16 h-16 rounded-2xl bg-blue-500/20 flex items-center justify-center text-blue-400 text-2xl">
                        <i class="fas fa-fingerprint"></i>
                    </div>
                    <div>
                        <h3 class="text-xl font-bold">Unified Identity</h3>
                        <p class="text-sm text-slate-500 max-w-[280px]">Nextgen RBAC ensures that a user's role in the Access Portal is instantly recognized across all ecosystem applications.</p>
                    </div>
                    <div class="domain-strip w-full">
                        ${o("Isolation","Tenant-level")}
                        ${o("Sync","Real-time")}
                        ${o("Engine","Firestore-Native")}
                    </div>
                </div>
            </div>
        </div>
    `}function tt(){return`
        <div class="grid">
            <section class="grid three">
                ${Object.values(y).map(gt).join("")}
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
                                ${Object.values(y).map(e=>`<option value="${e.id}">${e.name}</option>`).join("")}
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
                    ${vt(n.subscriptions)}
                </div>
            </section>
        </div>
    `}function st(){const e=wt(),t=fe(e),s=n.session.user;return`
        <div class="grid">
            <section class="panel">
                <div class="table-head">
                    <div>
                        <h3>Current Access Evaluation</h3>
                        <p class="muted">Reusable helper output for <code>hasPermission()</code>, <code>hasFeature()</code>, and module gates.</p>
                    </div>
                </div>
                <div class="grid three">
                    ${Object.values(W).map(a=>`
                        <div class="panel">
                            <h3>${a.label}</h3>
                            <p class="muted">${a.description}</p>
                            ${m(L(e,t,a.key)?"Plan enabled":"Plan blocked",L(e,t,a.key)?"success":"danger")}
                            ${m(T(s,e,t,a.key)?"Role allowed":"Role blocked",T(s,e,t,a.key)?"success":"warning")}
                        </div>
                    `).join("")}
                </div>
            </section>
            <section class="panel">
                <h3>Permission Probe</h3>
                <p class="muted">Active user: ${c((s==null?void 0:s.name)||"Unknown")} - role: ${c((s==null?void 0:s.role)||"none")}</p>
                <div>${Object.values(l).map(a=>m(`${a}: ${k(s,a)?"yes":"no"}`,k(s,a)?"success":"soft")).join("")}</div>
            </section>
        </div>
    `}function at(){return`
        <div class="grid">
            <section class="hero">
                <div>
                    <p class="eyebrow">Login access flow</p>
                    <h2>Payment request first, owner activation second.</h2>
                    <p class="muted">Buyers pay on the public site. You confirm payment here, then customers use <code>app.nextgenudaan.in</code> after their access pass is active.</p>
                </div>
                <div class="domain-strip">
                    ${o("1. Firebase Auth","Verify signed-in user")}
                    ${o("2. /platformAdmins/{uid}","Your private owner access to all tenants")}
                    ${o("3. /purchaseRequests/{id}","Paid buyer request awaiting owner confirmation")}
                    ${o("4. /users/{uid}","Customer app login profile")}
                    ${o("5. /companies/{companyId}","Tenant status and plan")}
                    ${o("6. /subscriptions/{id}","Status, expiry, grace, suspension")}
                </div>
            </section>
            <section class="grid two">
                <div class="panel">
                    <h3>Firestore Collections</h3>
                    <div class="domain-strip">
                        ${o("/platformAdmins/{uid}","owner-only admin access for this panel")}
                        ${o("/purchaseRequests/{id}","buyer, company, Razorpay ids, payment and provisioning status")}
                        ${o("/accessPasses/{id}","final company, plan, modules, owner, and app login handoff")}
                        ${o("/companies/{companyId}","companyName, ownerId, subscriptionId, plan, maxUsers, status, features")}
                        ${o("/users/{userId}","companyId, name, email, role, status, inviteStatus")}
                        ${o("/subscriptions/{subscriptionId}","plan, maxUsers, status, dates, Razorpay ids, custom limits")}
                        ${o("/roles/{roleId}","companyId, label, permissions, status")}
                        ${o("/permissions/{permissionId}","key, module, description")}
                        ${o("/activityLogs/{logId}","companyId, actorId, action, entity, metadata")}
                    </div>
                </div>
                <div class="panel">
                    <h3>Production Notes</h3>
                    <div class="domain-strip">
                        ${o("Tenant isolation","All RMS reads and writes include companyId equality checks.")}
                        ${o("Optimized queries","Use companyId + createdAt indexes for users, jobs, candidates, and logs.")}
                        ${o("Credential flow","You create Auth users, add /users profiles, and send app link plus credentials.")}
                        ${o("Webhook sync","Existing Razorpay webhook updates /subscriptions and logs activity.")}
                        ${o("Suspension","Failed payment enters grace, then suspended after gracePeriodDays.")}
                    </div>
                </div>
            </section>
        </div>
    `}function it(){var e,t,s;document.querySelectorAll("[data-view]").forEach(a=>{a.addEventListener("click",()=>{n.view=a.dataset.view,g()})}),(e=document.getElementById("logoutButton"))==null||e.addEventListener("click",ce),(t=document.getElementById("refreshButton"))==null||t.addEventListener("click",async()=>{await x(),g(),p("Data refreshed.")}),(s=document.getElementById("primaryAction"))==null||s.addEventListener("click",()=>{var a,i;(a=document.querySelector("form input, form select"))==null||a.focus(),(i=document.querySelector("form"))==null||i.scrollIntoView({behavior:"smooth",block:"center"})})}function nt(){var e,t,s,a;(e=document.getElementById("subscriptionForm"))==null||e.addEventListener("submit",lt),(t=document.getElementById("companyForm"))==null||t.addEventListener("submit",ct),(s=document.getElementById("userForm"))==null||s.addEventListener("submit",dt),(a=document.getElementById("roleForm"))==null||a.addEventListener("submit",ut),document.querySelectorAll("[data-provision-request]").forEach(i=>{i.addEventListener("click",()=>ot(i.dataset.provisionRequest))}),document.querySelectorAll("[data-sub-action]").forEach(i=>{i.addEventListener("click",()=>pt(i))})}function rt(e){return e.toString().toLowerCase().trim().replace(/\s+/g,"-").replace(/[^\w\-]+/g,"").replace(/\-\-+/g,"-").replace(/^-+/,"").replace(/-+$/,"")}async function ot(e){var J,Q,K;const t=n.purchaseRequests.find(A=>A.id===e);if(!t){p("Purchase request not found.",!0);return}const s=rt(t.companyName),a=prompt(`Confirm Subdomain Slug for this Company:
(e.g., entering 'brawn' will create brawn.nextgenudaan.in/app)`,s);if(!a){p("Provisioning cancelled.",!0);return}const i="NextGen@2026!";let r;try{p("Creating secure login credentials...",!1),r=(await ge(Re,t.buyerEmail,i)).user}catch(A){if(A.code==="auth/email-already-in-use"){const X=prompt(`An authentication account with this email already exists.
If you want to link to their existing account, enter their Firebase UID from the console below (or click Cancel):`);if(!X){p("Provisioning cancelled.",!0);return}r={uid:X,email:t.buyerEmail}}else{console.error("Auth Creation Error:",A),p("Failed to create Auth user: "+A.message,!0);return}}await P("subscriptions",t.id,{customerName:t.buyerName,customerEmail:t.buyerEmail,plan:t.plan,status:"active",provisioningStatus:"completed",updatedAt:new Date().toISOString()});const u=await Y("subscriptions",t.id);p("Provisioning workspace...",!1);const f=await ue(u,{companyId:a,companyName:t.companyName,ownerId:r.uid,ownerName:t.buyerName,ownerEmail:t.buyerEmail}),d=await H("accessPasses",{purchaseRequestId:t.id,subscriptionId:t.id,companyId:f,ownerId:r.uid,ownerEmail:t.buyerEmail,ownerName:t.buyerName,companyName:t.companyName,plan:t.plan,planName:U(t.plan),maxUsers:w(u).maxUsers,features:w(u).features,appUrl:`https://${a}.nextgenudaan.in/app`,status:"active",activatedAt:new Date().toISOString(),activatedBy:((J=n.session.user)==null?void 0:J.email)||"owner"});await C({companyId:f,actorId:((Q=n.session.user)==null?void 0:Q.id)||"system",action:"purchase_request.provisioned",entityType:"purchaseRequest",entityId:t.id,metadata:{subscriptionId:t.id,accessPassId:d,plan:t.plan}}),await x(),g();const h=`Workspace Subdomain: ${a}.nextgenudaan.in/app
Admin Email: ${t.buyerEmail}
Default Password: ${i}`;(K=navigator.clipboard)==null||K.writeText(h),alert(`🎉 Workspace Provisioned Successfully!

Credentials have been COPIED to your clipboard:

${h}

You can now paste this directly into an email to your client.`)}async function lt(e){var a,i;e.preventDefault();const t={customerName:document.getElementById("customerName").value.trim(),customerEmail:document.getElementById("customerEmail").value.trim(),plan:document.getElementById("plan").value,maxUsers:document.getElementById("customMaxUsers").value,priceMonthly:document.getElementById("customPrice").value,status:document.getElementById("status").value},s=await Fe(t);await C({companyId:((a=n.session.company)==null?void 0:a.id)||"platform",actorId:((i=n.session.user)==null?void 0:i.id)||"system",action:"subscription.created",entityType:"subscription",entityId:s,metadata:{plan:t.plan}}),await x(),g(),p("Subscription created.")}async function ct(e){var a;e.preventDefault();const t=await Y("subscriptions",document.getElementById("companySubscription").value),s=await ue(t,{companyName:document.getElementById("companyName").value.trim(),ownerId:document.getElementById("ownerId").value.trim(),ownerName:document.getElementById("ownerName").value.trim(),ownerEmail:document.getElementById("ownerEmail").value.trim()});await C({companyId:s,actorId:((a=n.session.user)==null?void 0:a.id)||"system",action:"company.provisioned",entityType:"company",entityId:s}),await x(),g(),p("Company workspace provisioned.")}async function dt(e){var u;e.preventDefault();const t=n.companies.find(f=>f.id===document.getElementById("userCompany").value),s=fe(t),a=O(t.id),i=G(t,s,a);if(!i.allowed){p(i.reason,!0);return}const r=await je({company:t,subscription:s,activeUserCount:a,userId:document.getElementById("inviteUid").value.trim(),name:document.getElementById("inviteName").value.trim(),email:document.getElementById("inviteEmail").value.trim(),role:document.getElementById("inviteRole").value});await C({companyId:t.id,actorId:((u=n.session.user)==null?void 0:u.id)||"system",action:"user.login_profile_created",entityType:"user",entityId:r}),await x(),g(),p("Customer login profile created.")}async function ut(e){var i,r;e.preventDefault();const t=document.getElementById("roleUser").value,s=document.getElementById("roleValue").value;await _e(t,s);const a=n.users.find(u=>u.id===t);await C({companyId:(a==null?void 0:a.companyId)||((i=n.session.company)==null?void 0:i.id)||"platform",actorId:((r=n.session.user)==null?void 0:r.id)||"system",action:"role.assigned",entityType:"user",entityId:t,metadata:{role:s}}),await x(),g(),p("Role assigned.")}async function pt(e){var i,r;const t=e.dataset.subId,s=e.dataset.subAction,a=e.dataset.plan;s==="upgrade"&&await ze(t,a),s==="downgrade"&&await We(t,a),s==="cancel"&&await Ge(t),s==="suspend"&&await P("subscriptions",t,{status:"suspended"}),await C({companyId:((i=n.session.company)==null?void 0:i.id)||"platform",actorId:((r=n.session.user)==null?void 0:r.id)||"system",action:`subscription.${s}`,entityType:"subscription",entityId:t,metadata:{plan:a}}),await x(),g(),p(`Subscription ${s} saved.`)}function z(e,t=!1){return e.length?`
        <div class="table-wrap overflow-x-auto">
            <table class="w-full text-left">
                <thead>
                    <tr class="border-b border-white/5 text-[10px] font-black uppercase tracking-widest text-slate-500">
                        <th class="px-6 py-4">Buyer</th>
                        <th class="px-6 py-4">Plan</th>
                        <th class="px-6 py-4">Status</th>
                        <th class="px-6 py-4">Provisioning</th>
                        ${t?"":'<th class="px-6 py-4">Action</th>'}
                    </tr>
                </thead>
                <tbody class="divide-y divide-white/5">
                    ${e.map(s=>{const a=s.provisioningStatus==="completed";return`
                            <tr class="hover:bg-white/5 transition-colors">
                                <td class="px-6 py-4">
                                    <div class="font-bold text-slate-200">${c(s.companyName||s.buyerName||"Unknown buyer")}</div>
                                    <div class="text-[10px] text-slate-500 font-medium">${c(s.buyerEmail||"")}</div>
                                </td>
                                <td class="px-6 py-4">
                                    ${m(U(s.plan),"info")}
                                    <div class="text-[10px] text-slate-500 mt-1">${s.maxUsers||w(s).maxUsers} users</div>
                                </td>
                                <td class="px-6 py-4">
                                    ${m(s.status||"pending",D(s.status))}
                                    <div class="text-[10px] text-slate-500 mt-1">${pe(s.updatedAt||s.createdAt)}</div>
                                </td>
                                <td class="px-6 py-4">${m(s.provisioningStatus||"idle",a?"success":"warning")}</td>
                                ${t?"":`
                                    <td class="px-6 py-4">
                                        <button class="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold shadow-lg shadow-blue-500/20 hover:scale-105 transition-all disabled:opacity-50 disabled:scale-100" data-provision-request="${s.id}" ${a?"disabled":""}>
                                            Activate
                                        </button>
                                    </td>
                                `}
                            </tr>
                        `}).join("")}
                </tbody>
            </table>
        </div>
    `:N("No purchase requests in this queue.")}function mt(e){return e.length?`
        <div class="table-wrap">
            <table class="w-full text-left">
                <thead>
                    <tr class="border-b border-white/5 text-[10px] font-black uppercase tracking-widest text-slate-500">
                        <th class="px-6 py-4">Company</th>
                        <th class="px-6 py-4">Plan</th>
                        <th class="px-6 py-4">Status</th>
                        <th class="px-6 py-4">Users</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-white/5">
                    ${e.map(t=>{const s=O(t.id);return`
                            <tr class="hover:bg-white/5 transition-colors">
                                <td class="px-6 py-4">
                                    <div class="font-bold text-slate-200">${c(t.companyName)}</div>
                                    <div class="text-[10px] text-slate-500 font-medium">${c(t.id)}</div>
                                </td>
                                <td class="px-6 py-4">${m(U(t.plan),"info")}</td>
                                <td class="px-6 py-4">${m(t.status||"active",D(t.status))}</td>
                                <td class="px-6 py-4">
                                    <div class="flex justify-between text-[10px] font-bold mb-1">
                                        <span>${s} / ${t.maxUsers}</span>
                                        <span>${F(s,t.maxUsers)}%</span>
                                    </div>
                                    <div class="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                        <div class="h-full bg-gradient-to-r from-blue-500 to-indigo-500" style="width: ${F(s,t.maxUsers)}%"></div>
                                    </div>
                                </td>
                            </tr>
                        `}).join("")}
                </tbody>
            </table>
        </div>
    `:N("No companies provisioned yet.")}function ft(e){return e.length?`
        <div class="table-wrap">
            <table class="w-full text-left">
                <thead>
                    <tr class="border-b border-white/5 text-[10px] font-black uppercase tracking-widest text-slate-500">
                        <th class="px-6 py-4">User</th>
                        <th class="px-6 py-4">Company</th>
                        <th class="px-6 py-4">Role</th>
                        <th class="px-6 py-4">Status</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-white/5">
                    ${e.map(t=>{var s;return`
                        <tr class="hover:bg-white/5 transition-colors">
                            <td class="px-6 py-4">
                                <div class="font-bold text-slate-200">${c(t.name)}</div>
                                <div class="text-[10px] text-slate-500 font-medium">${c(t.email)}</div>
                            </td>
                            <td class="px-6 py-4 text-xs font-medium text-slate-400">${c(ht(t.companyId))}</td>
                            <td class="px-6 py-4">${m(((s=E[t.role])==null?void 0:s.label)||t.role,"info")}</td>
                            <td class="px-6 py-4">${m(t.status||"active",D(t.status))}</td>
                        </tr>
                    `}).join("")}
                </tbody>
            </table>
        </div>
    `:N("No users created yet.")}function vt(e){return e.length?`
        <div class="table-wrap">
            <table class="w-full text-left">
                <thead>
                    <tr class="border-b border-white/5 text-[10px] font-black uppercase tracking-widest text-slate-500">
                        <th class="px-6 py-4">Customer</th>
                        <th class="px-6 py-4">Plan</th>
                        <th class="px-6 py-4">Status</th>
                        <th class="px-6 py-4">Actions</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-white/5">
                    ${e.map(t=>`
                        <tr class="hover:bg-white/5 transition-colors">
                            <td class="px-6 py-4">
                                <div class="font-bold text-slate-200">${c(t.customerName)}</div>
                                <div class="text-[10px] text-slate-500 font-medium">${c(t.customerEmail)}</div>
                            </td>
                            <td class="px-6 py-4">
                                ${m(U(t.plan),"info")}
                                <div class="text-[10px] text-slate-500 mt-1">${t.maxUsers||w(t).maxUsers} users</div>
                            </td>
                            <td class="px-6 py-4">
                                ${m(t.status||"active",D(t.status))}
                                <div class="text-[10px] text-slate-500 mt-1">Ends ${Ye(t.currentPeriodEnd)}</div>
                            </td>
                            <td class="px-6 py-4">
                                <div class="flex gap-2">
                                    <button class="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center hover:bg-blue-500/20 hover:text-blue-400 transition-all" data-sub-action="upgrade" data-plan="enterprise" data-sub-id="${t.id}" title="Upgrade"><i class="fas fa-arrow-up text-xs"></i></button>
                                    <button class="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center hover:bg-amber-500/20 hover:text-amber-400 transition-all" data-sub-action="suspend" data-sub-id="${t.id}" title="Suspend"><i class="fas fa-ban text-xs"></i></button>
                                    <button class="w-8 h-8 rounded-lg bg-red-500/10 text-red-500 flex items-center justify-center hover:bg-red-500/20 transition-all" data-sub-action="cancel" data-sub-id="${t.id}" title="Cancel"><i class="fas fa-trash text-xs"></i></button>
                                </div>
                            </td>
                        </tr>
                    `).join("")}
                </tbody>
            </table>
        </div>
    `:N("No subscriptions created yet.")}function bt(e){return e.length?`
        <div class="table-wrap">
            <table class="w-full text-left">
                <thead>
                    <tr class="border-b border-white/5 text-[10px] font-black uppercase tracking-widest text-slate-500">
                        <th class="px-6 py-4">Action</th>
                        <th class="px-6 py-4">When</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-white/5 text-xs">
                    ${e.map(t=>`
                        <tr class="hover:bg-white/5 transition-colors">
                            <td class="px-6 py-4">
                                <div class="font-bold text-slate-300">${t.action.replace(/_/g," ")}</div>
                                <div class="text-[10px] text-slate-500 font-medium uppercase">${t.entityType}</div>
                            </td>
                            <td class="px-6 py-4 text-slate-500">${pe(t.createdAt)}</td>
                        </tr>
                    `).join("")}
                </tbody>
            </table>
        </div>
    `:N("No activity logs yet.")}function yt(){return n.companies.length?`<div class="domain-strip">${n.companies.map(e=>{const t=O(e.id);return`
            <div>
                <div class="domain-item">
                    <strong>${c(e.companyName)}</strong>
                    <span>${t}/${e.maxUsers} users</span>
                </div>
                <div class="progress"><span style="--value:${F(t,e.maxUsers)}%"></span></div>
            </div>
        `}).join("")}</div>`:N("No usage data yet.")}function gt(e){const t=e.priceMonthly?`${Ve.format(e.priceMonthly)}/month`:"Dynamic pricing";return`
        <div class="panel plan-card">
            <div>
                <h3>${e.name}</h3>
                <div class="plan-price">${t}</div>
                <p class="muted">${e.maxUsers?`${e.maxUsers} max users`:"Custom user limits"}</p>
            </div>
            <div class="plan-features">
                ${e.features.map(s=>`<span><i class="fas fa-check"></i> ${xt(s)}</span>`).join("")}
            </div>
        </div>
    `}function R(e,t,s,a="blue"){const i={blue:"from-blue-600 to-indigo-600 shadow-blue-500/20 text-blue-500",emerald:"from-emerald-500 to-teal-500 shadow-emerald-500/20 text-emerald-500",amber:"from-amber-400 to-orange-500 shadow-amber-500/20 text-amber-500",indigo:"from-indigo-600 to-violet-600 shadow-indigo-500/20 text-indigo-500",rose:"from-rose-500 to-pink-500 shadow-rose-500/20 text-rose-500"},r=i[a]||i.blue;return`
        <div class="panel glass-card p-6 flex items-center gap-6 group hover-lift transition-all">
            <div class="w-14 h-14 rounded-2xl bg-gradient-to-br ${r.split(" ").slice(0,2).join(" ")} flex items-center justify-center text-white text-xl shadow-lg ${r.split(" ")[2]} group-hover:scale-110 transition-transform">
                <i class="fas ${s}"></i>
            </div>
            <div>
                <div class="text-xs font-black uppercase tracking-widest text-slate-500 mb-1">${e}</div>
                <div class="text-3xl font-black text-white">${t}</div>
            </div>
        </div>
    `}function o(e,t){return`
        <div class="p-4 rounded-xl bg-white/5 border border-white/5 flex justify-between items-center group hover:bg-white/10 transition-all">
            <strong class="text-sm font-bold">${c(e)}</strong>
            <span class="text-xs text-slate-500 font-medium">${c(t)}</span>
        </div>
    `}function m(e,t="soft"){const s={success:"bg-emerald-500/10 text-emerald-400 border-emerald-500/20",warning:"bg-amber-500/10 text-amber-400 border-amber-500/20",danger:"bg-rose-500/10 text-rose-400 border-rose-500/20",info:"bg-blue-500/10 text-blue-400 border-blue-500/20",soft:"bg-slate-500/10 text-slate-400 border-slate-500/20"};return`<span class="px-2.5 py-1 rounded-lg border text-[10px] font-black uppercase tracking-wider ${s[t]||s.soft}">${c(e)}</span>`}function N(e){return`<div class="empty">${c(e)}</div>`}function D(e=""){return["active","accepted","payment_received","owner_confirmed","completed"].includes(e)?"success":["trialing","grace","invited","pending","pending_payment","not_started"].includes(e)?"warning":["suspended","cancelled","expired","past_due","disabled","halted","payment_failed"].includes(e)?"danger":"soft"}function O(e){return n.users.filter(t=>t.companyId===e&&t.status!=="disabled").length}function ht(e){var t;return((t=n.companies.find(s=>s.id===e))==null?void 0:t.companyName)||"Unknown company"}function wt(){var e;return((e=n.session)==null?void 0:e.company)||n.companies[0]||null}function fe(e){var t;return((t=n.session)==null?void 0:t.subscription)||n.subscriptions.find(s=>s.id===(e==null?void 0:e.subscriptionId))||n.subscriptions[0]||null}function U(e){var t;return((t=y[e])==null?void 0:t.name)||"Custom"}function xt(e){var t;return((t=W[e])==null?void 0:t.label)||e}function $t(){return n.view==="requests"?"Review Request":n.view==="companies"?"Create Company":n.view==="users"?"Invite User":n.view==="roles"?"Assign Role":n.view==="subscriptions"?"Create Plan":"New Record"}window.NextGenAccess={hasPermission:k,hasFeature:L,canAddUser:G,canAccessModule:T,getCompanyUsers:Te};
