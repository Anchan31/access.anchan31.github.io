import {
    addDoc,
    collection,
    doc,
    getDoc,
    getDocs,
    limit,
    orderBy,
    query,
    runTransaction,
    serverTimestamp,
    updateDoc,
    setDoc,
    where,
    writeBatch
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { db } from "./firebase.js";

export function withId(snapshot) {
    return {
        id: snapshot.id,
        ...snapshot.data()
    };
}

export async function listCollection(path, orderField = "createdAt", direction = "desc", max = 100) {
    const ref = collection(db, path);
    try {
        const snap = await getDocs(query(ref, orderBy(orderField, direction), limit(max)));
        return snap.docs.map(withId);
    } catch (error) {
        if (error.code === "failed-precondition" || error.message.includes("requires an index")) {
            const snap = await getDocs(query(ref, limit(max)));
            return snap.docs.map(withId);
        }
        throw error;
    }
}

export async function listByCompany(path, companyId, orderField = "createdAt") {
    const ref = collection(db, path);
    const snap = await getDocs(query(ref, where("companyId", "==", companyId), orderBy(orderField, "desc")));
    return snap.docs.map(withId);
}

export async function getRecord(path, id) {
    if (!id) return null;
    const snap = await getDoc(doc(db, path, id));
    return snap.exists() ? withId(snap) : null;
}

export async function createRecord(path, payload) {
    const record = {
        ...payload,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
    };
    const ref = await addDoc(collection(db, path), record);
    return ref.id;
}

export async function setRecord(path, id, payload) {
    await setDoc(doc(db, path, id), {
        ...payload,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
    }, { merge: true });
    return id;
}

export async function updateRecord(path, id, payload) {
    await updateDoc(doc(db, path, id), {
        ...payload,
        updatedAt: serverTimestamp()
    });
}

export async function atomicCreateCompany({ company, owner, subscriptionId }) {
    return runTransaction(db, async (transaction) => {
        const companyRef = doc(collection(db, "companies"));
        const ownerRef = doc(db, "users", owner.userId);
        const subscriptionRef = doc(db, "subscriptions", subscriptionId);

        transaction.set(companyRef, {
            ...company,
            companyId: companyRef.id,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        });

        transaction.set(ownerRef, {
            ...owner,
            companyId: companyRef.id,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        });

        transaction.update(subscriptionRef, {
            companyId: companyRef.id,
            updatedAt: serverTimestamp()
        });

        return companyRef.id;
    });
}

export async function writeSeed(recordsByCollection) {
    const batch = writeBatch(db);
    Object.entries(recordsByCollection).forEach(([collectionName, records]) => {
        records.forEach((record) => {
            const id = record.id || record[`${collectionName.slice(0, -1)}Id`];
            const ref = id ? doc(db, collectionName, id) : doc(collection(db, collectionName));
            batch.set(ref, {
                ...record,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp()
            }, { merge: true });
        });
    });
    await batch.commit();
}
