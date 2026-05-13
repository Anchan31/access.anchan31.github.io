import {
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signOut
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { auth } from "./firebase.js";
import { getRecord } from "./firestoreService.js";

export function watchAuth(callback) {
    return onAuthStateChanged(auth, callback);
}

export async function login(email, password) {
    const credential = await signInWithEmailAndPassword(auth, email, password);
    return credential.user;
}

export async function logout() {
    await signOut(auth);
}

export async function loadAccessSession(firebaseUser) {
    if (!firebaseUser) {
        return { firebaseUser: null, user: null, company: null, subscription: null, blocked: false };
    }

    const platformAdmin = await safeGetRecord("platformAdmins", firebaseUser.uid);
    if (platformAdmin?.status === "active") {
        return {
            firebaseUser,
            platformAdmin,
            user: {
                id: firebaseUser.uid,
                userId: firebaseUser.uid,
                name: platformAdmin.name || firebaseUser.email || "Platform Admin",
                email: firebaseUser.email,
                role: "platform_admin",
                status: "active"
            },
            company: null,
            subscription: null,
            blocked: false,
            adminMode: true
        };
    }

    return {
        firebaseUser,
        user: null,
        company: null,
        subscription: null,
        blocked: true,
        ownerOnly: true,
        blockedReason: `This private control panel requires /platformAdmins/${firebaseUser.uid} with status "active".`
    };

}

async function safeGetRecord(path, id) {
    try {
        return await getRecord(path, id);
    } catch (error) {
        if (error.code === "permission-denied" || error.message.includes("permissions")) {
            return null;
        }
        throw error;
    }
}
